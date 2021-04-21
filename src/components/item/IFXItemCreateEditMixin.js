// Mixin for all create/edit components for items in IFX library
//
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      default: '',
      type: String
    },
    isEditing: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false,
      isValid: false,
      item: {},
      cachedItem: {},
      errors: {},
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
    // Used for comparison before submission and resetting form
    cacheItem() {
      // TODO: decompose item first
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
      // this.cachedItem = JSON.parse(JSON.stringify(this.apiRef.decompose(this.item)))
    },
    can(ability, user) {
      return this.$api.auth.can(ability, user)
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
        delete this.errors[key]
      }
    },
    submitUpdate() {
      this.apiRef.update(this.item)
        .then(async res => {
          const message = `${this.itemType} updated successfully. You will be routed to the details page.`
          this.showMessage(message)
          await this.sleep(this.routeDelay)
          this.rtr.push({ name: this.itemDetail, params: { id: res.data.id } })
        })
        .catch(error => {
          const { response } = error
          if (response) {
            this.errors = response.data
          }
          this.showMessage(error)
        })
    },
    submitSave() {
      this.apiRef.save(this.item)
        .then(async res => {
          const message = `${this.itemType} created with ID: ${res.data.id}. You will be routed to the details page.`
          this.showMessage(message)
          await this.sleep(this.routeDelay)
          this.rtr.push({ name: this.itemDetail, params: { id: res.data.id } })
        })
        .catch(error => {
          const { response } = error
          if (response) {
            this.errors = response.data
          }
          this.showMessage(error)
        })
    },
    getItem() {
      if (this.isEditing) {
        // If editing, id should be available to get specific item from server
        return this.apiRef.getByID(this.id)
      }
      // Otherwise, create a new item
      return this.apiRef.create({ })
    },
    hasItemChanged() {
      // TODO: add decomposition by default
      return JSON.stringify(this.cachedItem) !== JSON.stringify(this.item)
    },
  },
  computed: {

    /**
     * Computes title for PageHeader
     * If editing, the id of the item is displayed
     * @returns {string}
     */
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.id}`
      }
      return `Create ${itemTitle}`
    },
    /**
     * Computes description for PageHeader
     * @returns {string}
     */
    description() {
      if (this.isEditing) {
        return `Use this form to edit this ${this.itemType}`
      }
      return `Use this form to create a new ${this.itemType}.`
    },
    itemDetail() {
      return `${this.itemType}Detail`
    },
    isSubmittable() {
      if (this.isEditing) {
        return this.isValid && this.hasItemChanged()
      }
      return this.isValid
    }
  },
  mounted() {
    this.isLoading = true
    this.init()
      .then(() => this.$nextTick(() => (this.isLoading = false)))
      .catch((error) => {
        this.showMessage(error)
        this.rtr.replace({ name: 'Home' })
      })
  }
}
