// To be added to IFX list pages for billable items (product usage subclasses)
// this must have a facility object

export default {
  methods: {
    skinnyBillingRecordTableCellDisplay(skinnyBillingRecords) {
      let result = ''
      if (skinnyBillingRecords) {
        const states = []
        skinnyBillingRecords.forEach((sbr) => {
          const url = this.$router.resolve({
            name: 'BillingRecordDetail',
            params: { id: sbr.id, facility_id: this.facility.id },
          }).href
          states.push(`<a href="${url}">${sbr.currentState}</a>`)
        })
        result = states.join(', ')
      }
      return result
    },
    canGenerateBillingRecords() {
      return this.$api.auth.can('generate-billing-records', this.$api.authUser)
    },
    billingRecordsHaveBeenGenerated() {
      // Return true if any of the productUsages have billing records already
      if (this.filteredItems) {
        return this.filteredItems.some((pu) => pu.billingRecords.length > 0)
      }
      return false
    },
    calculateBillingMonth() {
      // Go to generate billing records page
      if (this.selectedDate) {
        const parts = this.selectedDate.split('-')
        this.$router.push({
          name: 'CalculateBillingMonthAll',
          params: { facility_id: this.facility.id, year: parts[0], month: parts[1] },
        })
      } else {
        this.$router.push({ name: 'CalculateBillingMonthFacility', params: { facility_id: this.facility.id } })
      }
    },
  }
}
