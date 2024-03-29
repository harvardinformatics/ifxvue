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
      selectedDateKey: 'billingRecordListDate', // Coordinates with billing record list page
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
      searchStorageKey: 'calculate-billing-month-search',
      search: null,
      onlyErrorsStorageKey: 'calculate-billing-month-onlyErrors',
      onlyErrors: false,
    }
  },
  watch: {
    search(val) {
      this.$api.storage.setItem(this.searchStorageKey, val, 'session')
    },
    onlyErrors(val) {
      this.$api.storage.setItem(this.onlyErrorsStorageKey, val, 'session')
    },
    selectedDate(val) {
      this.$api.storage.setItem(this.selectedDateKey, val, 'session')
      if (val) {
        this.getUsages()
      }
    },
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'User', value: 'productUser', sortable: true, namedSlot: true, key: 'fullName' },
        { text: 'Year', value: 'year', slot: true, sortable: true },
        { text: 'Month', value: 'month', slot: true, sortable: true },
        { text: 'Organization', value: 'organization', namedSlot: true, sortable: true },
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
    },
    filteredItems: function () {
      return this.getItemsFilteredBySearch()
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    getItemsFilteredBySearch() {
      let items = this.usages
      if (this.search) {
        const search = this.search.toString().toLowerCase()
        items = items.filter((i) => {
          let item = i
          if (i.data) {
            item = i.data
          }
          return Object.keys(item).some((j) => this.filterSearch(item[j], search))
        })
      }
      if (this.onlyErrors) {
        items = items.filter((i) => i.processing && !i.processing.resolved)
      }
      return items
    },
    // TODO: this is inefficient because it's checking all attributes
    // Make it check only relevant fields
    // Taken almost directly from the Vuetify docs
    filterSearch(v, s) {
      let search = s
      if (v && typeof v === 'object' && !Array.isArray(v) && v.data) {
        const item = v.data
        return Object.keys(item).some((j) => this.filterSearch(item[j], search))
      }
      if (search && v) {
        let val = v.toString().toLowerCase()
        if (v.hasOwnProperty('errorMessage')) {
          val = v.errorMessage.toLowerCase()
        }
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search = search.replace('.', '')
        }
        return val !== null && ['undefined', 'boolean'].indexOf(typeof val) === -1 && val.indexOf(search) !== -1
      }
      return false
    },
    canCalculate() {
      if (this.usages?.some((usage) => this.hasFinalBillingRecord(usage))) {
        return false
      }
      return !this.usagesPreviouslyBilled() || this.recalculate
    },
    hasFinalBillingRecord(usage) {
      return usage?.billingRecords?.some((br) => br.currentState === 'FINAL')
    },
    usagesPreviouslyBilled() {
      // Returns true if any of the usages has billingRecords
      if (this.usages) {
        return this.usages.some((usage) => usage.billingRecords?.length)
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
        this.isLoading = true
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
          .finally(() => this.isLoading = false)
      }
    },
    async getUsages() {
      if (this.selectedDate && this.facility) {
        this.isLoading = true
        const yearMonth = this.getYearMonth()
        this.usages = await this.$api.getUsagesForFacility(this.facility, yearMonth.year, yearMonth.month)
        this.isLoading = false
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
  mounted() {
    if (this.month && this.year) {
      this.selectedDate = `${this.year}-${this.month}`
    } else {
      this.selectedDate = this.$api.storage.getItem(this.selectedDateKey, 'session') || null
    }
    this.search = this.$api.storage.getItem(this.searchStorageKey, 'session') || ''
    this.onlyErrors = this.$api.storage.getItem(this.searchStorageKey, 'session') === 'true'
    this.localOrganization = this.organization
    this.setFacility()
      .then(() => {
        this.isLoading = false
        if (this.selectedDate) {
          this.getUsages()
            .catch((error) => { this.showMessage(error) })
        }
      })
  }
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Calculate billing month</template>
    </IFXPageHeader>
    <v-row align="center" dense>
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
                    <v-icon>autorenew</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>{{ calculateBillingMonthToolTip }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row align="start" dense>
      <v-col>
        <v-text-field
          v-model="search"
          class="search-field"
          label="Search"
          single-line
          hide-details
          :clearable="true"
          prepend-icon="search"
          data-cy="ifx-search-field"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="onlyErrors"
          label="Only errors"
        >
        </v-checkbox>
      </v-col>
      <v-col>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <IFXItemDataTable
          :headers="headers"
          :items="filteredItems"
          :showSelect="false"
          :selected="selected"
          :loading="isLoading"
          itemType="ProductUsage"
        >
          <template v-slot:productUser="{ item }">
            {{ item.productUser.fullName }}
          </template>
          <template v-slot:organization="{ item }">
            {{ item.organization|orgNameFromSlug }}
          </template>
          <template v-slot:processing="{ item }">
            <span v-if="item.processing" :class="{'billing-error': !item.processing.resolved}">
              {{ item.processing.errorMessage }}
            </span>
            <span v-else>&nbsp;</span>
          </template>
        </IFXItemDataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .billing-error {
    color: red;
  }
</style>
