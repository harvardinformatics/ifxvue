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
      submitting: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    can(ability, user = this.$api.authUser) {
      return this.$api.auth.can(ability, user)
    },
    getAdditionalData() {
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
    cacheItem() {
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
    },
    submit() {
      if (this.isEditing) this.submitUpdate()
      else this.submitSave()
    },
    clearAllErrors() {
      this.errors = {}
    },
    clearError(key) {
      if (Object.prototype.hasOwnProperty.call(this.errors, key)) {
        delete this.errors[key]
      }
    },
    submitUpdate() {
      this.$nextTick(() => {
        this.submitting = true
      })
      return this.apiRef
        .update(this.item)
        .then(async () => {
          this.submitting = false
          const message = `${this.itemType} updated successfully.`
          this.showMessage(message)
          if (this.$route.query.next) {
            await this.sleep(this.routeDelay)
            this.$router.push({ path: this.$route.query.next })
          } else {
            this.init()
          }
        })
        .catch((error) => {
          this.submitting = false
          const { response } = error
          if (response) {
            this.errors = response.data
          }
          this.showMessage(error)
        })
    },
    hasItemChanged() {
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
          this.$router.replace({ name: `${this.itemType}List` })
        })
    })
  },
}