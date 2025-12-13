<script>
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXSearchField from '@/components/IFXSearchField'

export default {
  name: 'IFXLabBillingSummaryList',
  mixins: [IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  props: {
    facility: {
      required: true,
      type: Object,
    },
    showSelectors: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      DEFAULT_RANGE: 5,
      onlyShowSuspiciousRows: false,
      theHeaders: [{ title: 'Lab Name', value: 'organization', sortable: true }],
      startMonth: null,
      startYear: null,
      endMonth: new Date().getMonth(),
      endYear: new Date().getFullYear(),
      startMenu: false,
      startMonthAndYear: null,
      endMenu: false,
      endMonthAndYear: null,
      fetchingData: false,
      maxDate: new Date().toISOString().slice(0, 7),
      startViewMode: 'months',
      endViewMode: 'months',
      selectedStartYear: null,
      selectedEndYear: null,
    }
  },
  mounted() {
    if (!this.endMonth) {
      this.endMonth = 12
      this.endYear--
    }
    this.startYear = this.endYear
    this.selectedStartYear = this.startYear
    this.selectedEndYear = this.startYear
    this.startMonth = this.endMonth - this.DEFAULT_RANGE
    if (this.startMonth < 1) {
      this.startMonth += 12
      this.startYear--
    }
    this.startMonthAndYear = `${this.startYear}-${String(this.startMonth).padStart(2, '0')}`
    this.endMonthAndYear = `${this.endYear}-${String(this.endMonth).padStart(2, '0')}`
  },
  methods: {
    async getSetItems() {
      this.theHeaders.splice(1)
      this.items.splice(0)
      this.fetchingData = true

      let monthRange = this.endMonth - this.startMonth
      monthRange += 12 * (this.endYear - this.startYear)

      for (let i = 0; i <= monthRange; i++) {
        const curMonth = this.startMonth + i
        const thisMonth = curMonth % 12 || 12
        const paddedMonth = thisMonth.toString().padStart(2, '0')
        const thisYear = this.startYear + Math.floor((curMonth - 1) / 12)
        this.theHeaders.push({
          title: `${thisMonth} / ${thisYear}`,
          value: `${thisYear}-${paddedMonth}`,
          sortable: true,
          namedSlot: true,
        })
      }
      const results = await this.$api.getLabChargeHistory(
        this.facility,
        this.startMonth,
        this.startYear,
        this.endMonth,
        this.endYear
      )
      const labData = Object.entries(results.data)
      labData.forEach(([lab, values]) => {
        const newData = { organization: lab, ...values }
        this.items.push(newData)
      })
      this.fetchingData = false
    },
    updateViewMode(viewMode, type) {
      if (type === 'start') {
        this.startViewMode = viewMode === 'year' ? 'year' : 'months'
      } else {
        this.endViewMode = viewMode === 'year' ? 'year' : 'months'
      }
    },
    updateStartYear(year) {
      this.selectedStartYear = year
    },
    updateStartMonth(month) {
      this.startMonth = month + 1
      this.startYear = this.selectedStartYear
      this.startMonthAndYear = `${this.startYear}-${String(this.startMonth).padStart(2, '0')}`
      this.startMenu = false
    },
    updateEndYear(year) {
      this.selectedEndYear = year
    },
    updateEndMonth(month) {
      this.endMonth = month + 1
      this.endYear = this.selectedEndYear
      this.endMonthAndYear = `${this.endYear}-${String(this.endMonth).padStart(2, '0')}`
      this.endMenu = false
    },
    updateTable() {
      this.getSetItems()
    },
  },
  computed: {
    headers() {
      return this.theHeaders.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
    refinedItems() {
      if (this.onlyShowSuspiciousRows) {
        return this.filteredItems.filter((row) => {
          let hasNonZeroCharges = false
          let hasZero = false
          this.headers.forEach((header) => {
            if (header.value !== 'organization') {
              const charge = row[header.value]
              if (charge) {
                hasNonZeroCharges = true
              } else {
                hasZero = true
              }
            }
          })
          return hasNonZeroCharges && hasZero
        })
      }
      return this.filteredItems
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Lab Billing Summary</template>
      <template #subtitle>
        <span>{{ facility.name }}</span>
      </template>
      <template #actions>
        <span class="d-flex flex-row flex-nowrap">
          <IFXSearchField v-model:search="search" />
          <v-switch
            class="ml-3"
            v-model="onlyShowSuspiciousRows"
            label="Only labs with gaps"
            data-cy="suspicious-labs"
          ></v-switch>
        </span>
      </template>
    </IFXPageHeader>
    <v-row v-if="showSelectors">
      <v-col class="flex-grow-1 flex-shrink-0">
        <v-menu
          v-model="startMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="startMonthAndYear"
              label="Select start month and year"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker
            :view-mode="startViewMode"
            @update:view-mode="updateViewMode($event, 'start')"
            @update:year="updateStartYear"
            @update:month="updateStartMonth"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-0">
        <v-menu
          v-model="endMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="endMonthAndYear"
              label="Select end month and year"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker
            :view-mode="endViewMode"
            @update:view-mode="updateViewMode($event, 'end')"
            @update:year="updateEndYear"
            @update:month="updateEndMonth"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="d-flex flex-row align-center flex-grow-0 flex-shrink-1">
        <v-btn size="small" @click="updateTable" color="primary">Get Summary</v-btn>
      </v-col>
    </v-row>
    <IFXItemDataTable
      :items="refinedItems"
      :headers="headers"
      v-model:selected="selected"
      :showSelect="false"
      itemType="labBillingSummary"
      :loading="fetchingData"
      :defaultItemsPerPage="-1"
    >
      <template v-for="header in headers" #[header.value]="{ item }">
        <span :key="header.value">
          <span v-if="item[header.value] !== undefined">
            {{ $dollars(item[header.value]) }}
          </span>
          <span v-else class="text-grey-darken-1">No Charges</span>
        </span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>