export default {
  data() {
    return {
      itemType: 'Account',
    }
  },
  computed: {
    apiRef() {
      return this.$api.account
    }
  }
}