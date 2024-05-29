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
      isValid: false,
      isEditing: true,
      item: {},
      cachedItem: {},
      errors: {},
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    can(ability, user = this.$api.authUser) {
      return this.$api.auth.can(ability, user)
    },
    getAdditionalData() {
      // This is a placeholder that gets overridden in the component if it needs to load extra data
      return Promise.resolve()
    },
    getItem() {
      return this.apiRef.getByID(this.id)
    },
    async init() {
      try {
        this.item = await this.getItem()
        this.cacheItem()
      } catch (error) {
        this.showMessage(error)
        throw error
      }
    },
    // Used for comparison before submission and resetting form
    cacheItem() {
      // TODO: decompose item first
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
      // this.cachedItem = JSON.parse(JSON.stringify(this.apiRef.decompose(this.item)))
    },
    submit() {
      if (this.isEditing) this.submitUpdate()
      else this.submitSave()
    },
    clearAllErrors() {
      this.errors = {}
    },
    // Used by individual form fields to clear their own errors
    clearError(key) {
      if (this.errors.hasOwnProperty(key)) {
        this.$delete(this.errors, key)
      }
    },
    submitUpdate() {
      this.apiRef
        .update(this.item)
        .then(async (res) => {
          const message = `${this.itemType} updated successfully.`
          this.showMessage(message)
          await this.sleep(this.routeDelay)
          if (this.$route.query.next) {
            this.$router.push({ path: this.$route.query.next })
          } else {
            this.rtr.push({ name: this.itemDetail, params: { id: res.data.id } })
          }
        })
        .catch((error) => {
          const { response } = error
          if (response) {
            this.errors = response.data
          }
          this.showMessage(error)
        })
    },
    hasItemChanged() {
      // TODO: add decomposition by default
      return JSON.stringify(this.cachedItem) !== JSON.stringify(this.item)
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
    isSubmittable() {
      return this.hasItemChanged()
    },
  },
  mounted() {
    this.isLoading = true
    this.getAdditionalData().then(() => {
      this.init()
        .then(() => (this.isLoading = false))
        .catch((err) => {
          this.showMessage(err)
          this.rtr.replace({ name: `${this.itemType}List` })
        })
    })
  },
}
