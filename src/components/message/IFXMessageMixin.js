export default {
  data() {
    return {
      itemType: 'Message',
    }
  },
  computed: {
    apiRef() {
      return this.$api.message
    }
  }
}