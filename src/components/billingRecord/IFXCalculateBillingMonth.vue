<script>
import { mapActions } from 'vuex'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXMonthYearDatePicker from '@/components/IFXMonthYearDatePicker'

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
    },
    fetchInterval: {
      type: Number,
      required: false,
      default: 1000
    }
  },
  components: {
    IFXItemDataTable,
    IFXMonthYearDatePicker,
  },
  data() {
    return {
      selectedDateKey: 'billingRecordListDate',
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
        { title: 'ID', key: 'id', sortable: true },
        { title: 'User', key: 'productUser', sortable: true, namedSlot: true },
        { title: 'Year', key: 'year', sortable: true },
        { title: 'Month', key: 'month', sortable: true },
        { title: 'Organization', key: 'organization', namedSlot: true, sortable: true },
        { title: 'Product', key: 'product', sortable: true, namedSlot: true },
        { title: 'Description', key: 'description' },
        { title: 'Processing', key: 'processing', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
    calculateBillingMonthToolTip() {
      if (!this.canCalculate()) {
        return 'To create new billing for usages that have billing records, check Recalculate'
      }
      if (this.recalculate) {
        return 'Remove existing billing records and recalculate'
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
    filterSearch(v, s) {
      let search = s
      if (v && typeof v === 'object' && !Array.isArray(v) && v.data) {
        const item = v.data
        return Object.keys(item).some((j) => this.filterSearch(item[j], search))
      }
      if (search && v) {
        let val = v.toString().toLowerCase()
        if (Object.prototype.hasOwnProperty.call(v, 'errorMessage')) {
          val = v.errorMessage.toLowerCase()
        }
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
        this.interval = setInterval(() => {
          me.getUsages()
        }, this.fetchInterval)
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
    this.onlyErrors = this.$api.storage.getItem(this.onlyErrorsStorageKey, 'session') === 'true'
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
    <v-row align="center">
      <v-col>
        <IFXMonthYearDatePicker
          v-model="selectedDate"
          label="Month"
          hint="YYYY-MM format"
          persistent-hint
          required
        />
      </v-col>
      <v-col>
        <v-select
          :items="facilities"
          item-title="name"
          v-model="facility"
          label="Facility"
          return-object
          @update:model-value="getUsages()"
        >
        </v-select>
      </v-col>
      <v-col>
        <v-row align="center">
          <v-col>
            <v-checkbox
              v-model="recalculate"
              label="Remove existing billing records and recalculate"
              hide-details
            >
            </v-checkbox>
          </v-col>
          <v-col>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <div>
                  <v-btn
                    v-bind="props"
                    :disabled="!canCalculate()"
                    @click="calculateBillingMonth()"
                    icon="mdi-autorenew"
                    size="small"
                    :color="recalculate ? 'red' : 'primary'"
                  >
                  </v-btn>
                </div>
              </template>
              <span>{{ calculateBillingMonthToolTip }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row align="start">
      <v-col>
        <v-text-field
          v-model="search"
          class="search-field"
          label="Search"
          hide-details
          :clearable="true"
          prepend-icon="mdi-magnify"
          data-cy="ifx-search-field"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-checkbox
          v-model="onlyErrors"
          label="Only errors"
          hide-details
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
          itemType="ReservationUsage"
        >
          <template v-slot:productUser="{ item }">
            {{ item.productUser.fullName }}
          </template>
          <template v-slot:organization="{ item }">
            {{ $orgNameFromSlug(item.organization) }}
          </template>
          <template v-slot:processing="{ item }">
            <span v-if="item.processing" :class="{'billing-error': !item.processing.resolved}">
              {{ item.processing.errorMessage }}
            </span>
            <span v-else>&nbsp;</span>
          </template>
          <template v-slot:product="{ item }">
            {{ item.product.productName }}
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