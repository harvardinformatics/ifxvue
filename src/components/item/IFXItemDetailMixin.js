import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
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
      this.rtr.push({ name: `${this.itemType}Edit`, params: { id }, query: { next: this.$route.path } })
    },
    can(ability, user = this.$api.authUser) {
      // if (!user) {
      //   // eslint-disable-next-line no-param-reassign
      //   user = this.$api.authUser
      // }
      return this.$api.auth.can(ability, user)
    },
    async init() {
      this.item = await this.apiRef.getByID(this.id, true)
    },
  },
  computed: {
    detailTitle() {
      return this.splitOnCapitals(this.itemType).join(' ')
    },
    djangoAdminUrl() {
      if (this.adminPath && this.item.id) {
        return `${this.adminPath}/${this.item.id}`
      }
      return ''
    },
  },
  mounted() {
    this.isLoading = true
    this.init()
      .then(() => (this.isLoading = false))
      .catch((err) => {
        this.showMessage(err)
        this.rtr.replace({ name: `${this.itemType}List` })
      })
  },
}
