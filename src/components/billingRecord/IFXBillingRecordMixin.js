export default {
  data() {
    return {
      itemType: 'BillingRecord',
    }
  },
  computed: {
    apiRef() {
      return this.$api.billingRecord
    }
  }
}