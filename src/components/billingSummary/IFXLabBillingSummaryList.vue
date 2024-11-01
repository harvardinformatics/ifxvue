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
      DEFAULT_RANGE: 6,
      onlyShowSuspiciousRows: false,
      theHeaders: [{ text: 'Lab Name', value: 'organization', sortable: true }],
      startMonth: null,
      startYear: null,
      endMonth: new Date().getMonth() + 1,
      endYear: new Date().getFullYear(),
      startMenu: false,
      startMonthAndYear: null,
      endMenu: false,
      endMonthAndYear: null,
      fetchingData: false,
      maxDate: new Date().toISOString().slice(0, 7),
    }
  },
  mounted() {
    this.startYear = this.endYear
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
      // Reset the headers and the items
      this.theHeaders.splice(1)
      this.items.splice(0)
      this.fetchingData = true

      let monthRange = this.endMonth - this.startMonth
      if (monthRange < 0) {
        monthRange += 12 * (this.endYear - this.startYear)
      }

      for (let i = 0; i < monthRange; i++) {
        // Add a header for this month
        const thisMonth = (this.startMonth + i) % 12
        // the keys that come back from Django are padded to 2 digits for month.
        const paddedMonth = thisMonth < 10 ? `0${thisMonth}` : thisMonth.toString()
        const thisYear = this.startYear + Math.floor(i / 12)
        this.theHeaders.push({
          text: `${thisMonth} / ${thisYear}`,
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
      // We get an object back so process it into an array
      const labData = Object.entries(results.data)
      labData.forEach(([lab, values]) => {
        // Create the item entry the way the table expects it
        const newData = { organization: lab, ...values }
        this.items.push(newData)
      })
      this.fetchingData = false
    },
    updateTable() {
      let split = this.startMonthAndYear.split('-')
      this.startMonth = parseInt(split[1], 10)
      this.startYear = parseInt(split[0], 10)
      split = this.endMonthAndYear.split('-')
      this.endMonth = parseInt(split[1], 10)
      this.endYear = parseInt(split[0], 10)
      this.getSetItems()
    },
  },
  computed: {
    headers() {
      return this.theHeaders.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    refinedItems() {
      if (this.onlyShowSuspiciousRows) {
        return this.filteredItems.filter((row) => {
          // There has to be at least one non-zero and one or more zero/no charge entries
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
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Lab Billing Summary</template>
      <template #actions>
        <span class="d-flex flex-row flex-nowrap">
          <IFXSearchField :search.sync="search" />
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
          ref="startMenu"
          v-model="startMenu"
          :close-on-content-click="false"
          :return-value.sync="startMonthAndYear"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startMonthAndYear"
              label="Select start month and year"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startMonthAndYear" type="month" no-title scrollable :max="endMonthAndYear">
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="startMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.startMenu.save(startMonthAndYear)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-0">
        <v-menu
          ref="endMenu"
          v-model="endMenu"
          :close-on-content-click="false"
          :return-value.sync="endMonthAndYear"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endMonthAndYear"
              label="Select end month and year"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endMonthAndYear"
            type="month"
            no-title
            scrollable
            :max="maxDate"
            :min="startMonthAndYear"
          >
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="endMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.endMenu.save(endMonthAndYear)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="d-flex flex-row align-center flex-grow-0 flex-shrink-1">
        <v-btn small @click="updateTable" color="primary">Get Summary</v-btn>
      </v-col>
    </v-row>
    <IFXItemDataTable
      :items="refinedItems"
      :headers="headers"
      :selected.sync="selected"
      :showSelect="false"
      itemType="labBillingSummary"
      :loading="fetchingData"
    >
      <template v-for="header in headers" #[header.value]="{ item }">
        <span :key="header.text">
          <span v-if="item[header.value] !== undefined">
            {{ item[header.value] | dollars }}
          </span>
          <span v-else class="grey--text text--darken-1">No Charges</span>
        </span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
