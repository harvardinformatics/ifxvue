import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: [String, Number],
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
      this.item = await this.apiRef.getByID(this.id)
    }
  },
  computed: {
    detailTitle() {
      return this.splitOnCapitals(this.itemType).join(' ')
    }
  },
  mounted() {
    this.isLoading = true
    this.init()
      .then(() => this.isLoading = false)
      .catch(err => {
        this.showMessage(err)
        this.rtr.replace({ name: `${this.itemType}List` })
      })
  }
}
