export default {
  data() {
    return {
      itemType: 'Organization',
    }
  },
  computed: {
    apiRef() {
      return this.$api.organization
    }
  }
}