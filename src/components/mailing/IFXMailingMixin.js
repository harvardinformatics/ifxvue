export default {
  data() {
    return {
      itemType: 'Mailing',
    }
  },
  computed: {
    apiRef() {
      return this.$api.mailing
    }
  }
}