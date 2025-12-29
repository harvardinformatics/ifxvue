export default {
  data() {
    return {
      itemType: 'Contact',
      apiRef: null,
    }
  },
  created() {
    this.apiRef = this.$api.contact
  },
}