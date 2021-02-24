import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      item: {},
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    navigateToItemEdit(id) {
      this.rtr.push({ name: `${this.itemType}Edit`, params: { id } })
    },
    async init() {
      try {
        this.item = await this.apiRef.getByID(this.id)
      } catch (error) {
        this.showMessage(error)
        this.rtr.replace({ name: `${this.itemType}List` })
      }
    }
  },
  computed: {
    detailTitle() {
      return this.splitOnCapitals(this.itemType).join(' ')
    }
  },
  mounted() {
    this.isLoading = true
    this.init().then(() => this.$nextTick(() => this.isLoading = false))
  }
}
