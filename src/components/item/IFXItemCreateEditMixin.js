// Mixin for all create/edit components for items in IFX library
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      default: '',
      type: String,
    },
    isEditing: {
      default: false,
      type: Boolean,
    },
    emitNavigate: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isLoading: false,
      isValid: false,
      item: {},
      cachedItem: {},
      errors: {},
      submitting: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
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
    getAdditionalData() {
      return Promise.resolve()
    },
    can(ability, user = this.$api.authUser) {
      return this.$api.auth.can(ability, user)
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
      this.apiRef
        .update(this.item)
        .then(async (res) => {
          this.submitting = false
          const message = `${this.itemType} updated successfully.`
          this.showMessage(message)
          await this.sleep(this.routeDelay)
          if (this.emitNavigate) {
            this.$emit('navigate', this.item)
          } else if (this.$route.query.next) {
            const query = {}
            if (this.$route.query.page) {
              query.page = this.$route.query.page
            }
            if (this.$route.query.tab) {
              query.tab = this.$route.query.tab
            }
            this.$router.push({ path: this.$route.query.next, query })
          } else {
            this.$router.push({ name: this.itemDetail, params: { id: res.data.id } })
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
        .finally(() => {
          this.submitting = false
        })
    },
    submitSave() {
      this.$nextTick(() => {
        this.submitting = true
      })
      this.apiRef
        .save(this.item)
        .then(async (res) => {
          this.submitting = false
          const message = `${this.itemType} created with ID: ${res.data.id}.`
          this.showMessage(message)
          await this.sleep(this.routeDelay)
          if (this.emitNavigate) {
            this.$emit('navigate', this.item)
          } else if (this.$route.query.next) {
            const query = {}
            if (this.$route.query.page) {
              query.page = this.$route.query.page
            }
            if (this.$route.query.tab) {
              query.tab = this.$route.query.tab
            }
            this.$router.push({ path: this.$route.query.next, query })
          } else {
            this.$router.push({ name: this.itemDetail, params: { id: res.data.id } })
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
    getItem() {
      if (this.isEditing) {
        return this.apiRef.getByID(this.id)
      }
      return this.apiRef.create({})
    },
    hasItemChanged() {
      return JSON.stringify(this.cachedItem) !== JSON.stringify(this.item)
    },
  },
  computed: {
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.id}`
      }
      return `Create ${itemTitle}`
    },
    description() {
      return ''
    },
    itemDetail() {
      return `${this.itemType}Detail`
    },
    isSubmittable() {
      if (this.isEditing) {
        return this.isValid && this.hasItemChanged()
      }
      return this.isValid
    },
  },
  mounted() {
    this.isLoading = true
    this.getAdditionalData().then(() => {
      this.init()
        .then(() => this.$nextTick(() => (this.isLoading = false)))
        .catch((error) => {
          this.showMessage(error)
          this.$router.replace({ name: 'Home' })
        })
    })
  },
}