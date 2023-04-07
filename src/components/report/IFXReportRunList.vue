<script>
import { mapActions } from 'vuex'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXReportRunMixin from '@/components/report/IFXReportRunMixin'

export default {
  name: 'IFXReportRunList',
  mixins: [IFXReportRunMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  data() {
    return {
      reportTypes: [],
      showReportDialog: false,
      startMonth: '',
      endMonth: '',
      dateMenu: false,
      startDateMenu: false,
      endDateMenu: false,
      useFiscalYear: false,
      selectedReport: {},
      reportRunning: false,
      reportResponse: null,
      currentMonth: new Date().toISOString(),
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, click: true, width: '60px' },
        { text: 'Report', value: 'report', sortable: true, width: '150px' },
        { text: 'Excel', value: 'xlsFilePath', sortable: false, namedSlot: true },
        { text: 'CSV', value: 'textFilePath', sortable: false, namedSlot: true, width: '150px' },
        { text: 'Last Run', value: 'updated', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    getSetItems() {
      return (
        this.apiRef
          .getList()
          .then((items) => {
            this.items = items
            // Get all available reports
            this.$api.report.getList().then((reports) => {
              this.reportTypes = Array.from(reports)
              if (this.reportTypes.length === 1) {
                // If only one report, preload it
                this.selectedReport = this.reportTypes[0]
              }
            })
          })
          // TODO: work on handling this error
          .catch((error) => {
            this.showMessage(error)
            this.rtr.replace({ name: 'Home' })
          })
      )
    },
    openReportDialog() {
      this.showReportDialog = true
    },
    closeReportDialog() {
      this.showReportDialog = false
      this.reportRunning = false
      this.reportResponse = {}
      this.useFiscalYear = false
    },
    async runSelectedReport() {
      this.reportRunning = true
      // build params
      const monthRange = this.endMonth ? `${this.startMonth}:${this.endMonth}` : this.startMonth
      const params = {
        date_range: this.useFiscalYear ? 'fy' : monthRange,
        name: this.selectedReport.name,
      }
      try {
        const res = await this.$api.report.runReport(params)
        this.reportResponse = this.$api.reportRun.create(res.data)
        if (this.reportResponse?.id) {
          // Check if this is an existing report
          const index = this.items.findIndex((item) => item.id === this.reportResponse.id)
          if (index !== -1) {
            // Replace the old report info with the new info, which will be the time the report was run.
            this.items.splice(index, 1, this.reportResponse)
          } else {
            // A new report so add it to the list
            this.items.push(this.reportResponse)
          }
          const updatedTime = this.$options.filters.humanDatetime(this.reportResponse.updated)
          const msg = `Report id ${this.reportResponse.id} completed at ${updatedTime}`
          this.showMessage(msg)
          this.closeReportDialog()
        }
      } catch (err) {
        this.showMessage(err)
      } finally {
        this.reportRunning = false
      }
    },
    toggleFiscalYear() {
      // Close any open menus
      this.startDateMenu = false
      this.endDateMenu = false
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <v-row class="flex-nowrap">
          <v-col><IFXSearchField :search.sync="search" /></v-col>
          <v-col sm="2">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-btn v-if="reportTypes.length" v-bind="attrs" fab small color="green" @click="openReportDialog()">
                    <v-icon dark>mdi-text-box-plus-outline</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>Run a report</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template #xlsFilePath="{ item }">
        <a :href="item.xlsFileUrl">{{ item.xlsFilePath }}</a>
      </template>
      <template #textFilePath="{ item }">
        <a :href="item.textFileUrl">{{ item.textFilePath }}</a>
      </template>
      <template #updated="{ item }">
        {{ item.updated | humanDatetime }}
      </template>
    </IFXItemDataTable>
    <v-dialog v-bind="attrs" v-if="showReportDialog" v-model="showReportDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Run a report</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="isValid">
            <v-row class="text-body-1">
              <v-col align="center">
                <v-autocomplete
                  v-model="selectedReport"
                  :items="reportTypes"
                  item-text="name"
                  item-value="id"
                  label="Select Report"
                  :rules="formRules.generic"
                  return-object
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <div class="text-body-1 mb-0 mt-2">Select starting and ending months</div>
            <v-row class="text-body-1">
              <v-col cols="6">
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :disabled="useFiscalYear"
                      v-model="startMonth"
                      label="Start Month"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hint="YYYY-MM format"
                      persistent-hint
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :max="currentMonth"
                    :min="endMonth"
                    v-model="startMonth"
                    type="month"
                    @input="startDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="endMonthMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :disabled="useFiscalYear"
                      v-model="endMonth"
                      label="End Month (optional)"
                      prepend-icon="mdi-calendar"
                      clear-icon="mdi-close-circle"
                      clearable
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hint="YYYY-MM format"
                      persistent-hint
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :min="startMonth"
                    :max="currentMonth"
                    v-model="endMonth"
                    type="month"
                    @input="endMonthMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row class="text-body-1">
              <v-col>
                <div class="text-divider font-italic text-center">or</div>
                <v-checkbox
                  v-model="useFiscalYear"
                  label="Use current fiscal year"
                  @click="toggleFiscalYear()"
                ></v-checkbox>
              </v-col>
            </v-row>
            <div v-if="reportRunning">
              Running {{ selectedReport.name }}...
              <v-progress-linear indeterminate></v-progress-linear>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="closeReportDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isValid" @click="runSelectedReport">Run</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style lang="scss" scoped>
.text-divider {
  display: flex;
  align-items: center;
  letter-spacing: 0.1em;
  --text-divider-gap: 1rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background-color: silver;
    flex-grow: 1;
  }

  &::before {
    margin-right: var(--text-divider-gap);
  }

  &::after {
    margin-left: var(--text-divider-gap);
  }
}
</style>
