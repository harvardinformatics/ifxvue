<script>
import { mapActions } from 'vuex'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'

export default {
  name: 'IFXCalculateBillingMonth',
  props: {
    month: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false
    },
    facilityId: {
      type: String,
      required: false
    },
    organization: {
      type: String,
      required: false,
      default: null
    }
  },
  components: {
    IFXItemDataTable,
  },
  data() {
    return {
      dateMenu: false,
      selectedDate: null,
      localMonth: null,
      localYear: null,
      localOrganization: null,
      facility: null,
      facilities: [],
      interval: null,
      usages: [],
      isLoading: true,
      apiName: null,
      selected: [],
      recalculate: false,
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'User', value: 'productUser', sortable: true, namedSlot: true },
        { text: 'Year', value: 'year', slot: true, sortable: true },
        { text: 'Month', value: 'month', slot: true, sortable: true },
        { text: 'Organization', value: 'organization', slot: true, sortable: true },
        { text: 'Description', value: 'description', slot: true },
        { text: 'Processing', value: 'processing', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    calculateBillingMonthToolTip() {
      if (!this.canCalculate()) {
        return 'To create new billing for usages that have billing records, check Recalculate'
      }
      if (this.recalculate) {
        return 'Recalculate billing records'
      }
      return 'Calculate billing records'
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    canCalculate() {
      if (this.usages && this.usages.some((usage) => this.hasFinalBillingRecord(usage))) {
        return false
      }
      return !this.usagesPreviouslyBilled() || this.recalculate
    },
    hasFinalBillingRecord(usage) {
      return usage.billingRecords && usage.billingRecords.some((br) => br.currentState === 'FINAL')
    },
    usagesPreviouslyBilled() {
      // Returns true if any of the usages has billingRecords
      if (this.usages) {
        return this.usages.some((usage) => usage.billingRecords && usage.billingRecords.length)
      }
      return false
    },
    getYearMonth() {
      const parts = this.selectedDate.split('-')
      return {
        year: parts[0],
        month: parts[1]
      }
    },
    calculateBillingMonth() {
      if (this.selectedDate) {
        const me = this
        const totalUsages = this.usages.length
        // Keep refreshing the usages until the calculation is finished
        this.interval = setInterval(() => {
          me.getUsages()
        }, 1000)
        const yearMonth = this.getYearMonth()
        this.$api.calculateBillingMonth(this.facility, yearMonth.year, yearMonth.month, this.recalculate)
          .then((response) => {
            const message = `${response.data.successes} usages successfully processed (of ${totalUsages})`
            this.showMessage(message)
            clearInterval(this.interval)
            this.getUsages()
          })
          .catch((error) => {
            clearInterval(this.interval)
            this.showMessage(error)
          })
      }
    },
    async getUsages() {
      if (this.selectedDate && this.facility) {
        const yearMonth = this.getYearMonth()
        this.usages = await this.$api.getUsagesForFacility(this.facility, yearMonth.year, yearMonth.month)
      }
    },
    async setFacility() {
      this.facilities = await this.$api.facility.getList()
      if (this.facilities && this.facilityId) {
        this.facility = await this.$api.facility.getByID(this.facilityId)
          .catch((response) => {
            this.showMessage(response.data)
          })
      } else if (this.facilities && this.facilities.length === 1) {
        this.facility = this.facilities[0]
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.interval)
    next()
  },
  watch: {
    selectedDate() {
      if (this.selectedDate) {
        this.getUsages()
      }
    }
  },
  mounted() {
    if (this.month && this.year) {
      this.selectedDate = `${this.year}-${this.month}`
    }
    this.localOrganization = this.organization
    this.setFacility()
      .then(() => {
        this.isLoading = false
        if (this.selectedDate) {
          this.getUsages()
            .then(() => this.calculateBillingMonth())
            .catch((error) => { this.showMessage(error) })
        }
      })
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Calculate billing month</template>
      <template #actions>
      </template>
    </IFXPageHeader>
    <v-row align="center">
      <v-col>
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="selectedDate"
              label="Month *"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              hint="YYYY-MM format"
              persistent-hint
            ></v-text-field>
          </template>
          <v-date-picker v-model="selectedDate" type="month" @input="dateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-select
          :items="facilities"
          item-text="name"
          v-model="facility"
          label="Facility"
          return-object
          @change="getUsages()"
        >
        </v-select>
      </v-col>
      <v-col>
        <v-row align="center" nowrap>
          <v-col>
            <v-checkbox
              v-model="recalculate"
              label="Recalculate"
            >
            </v-checkbox>
          </v-col>
          <v-col>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-btn
                    v-bind="attrs"
                    :disabled="!canCalculate()"
                    @click="calculateBillingMonth()"
                    fab
                    small
                    :color="recalculate ? 'red' : 'primary'"
                  >
                    <v-icon>money</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>{{ calculateBillingMonthToolTip }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <IFXItemDataTable
          :headers="headers"
          :items="usages"
          :showSelect="false"
          :selected="selected"
          itemType="ProductUsage"
        >
          <template v-slot:productUser="{ item }">
            {{ item.productUser.fullName }}
          </template>
          <template v-slot:processing="{ item }">
            <span style="color: red;" v-if="item.processing && item.processing[0] && !item.processing[0].resolved">
              {{ item.processing[0].errorMessage }}
            </span>
            <span v-else-if="item.processing && item.processing[0]">
              OK
            </span>
            <span v-else>&nbsp;</span>
          </template>
        </IFXItemDataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
