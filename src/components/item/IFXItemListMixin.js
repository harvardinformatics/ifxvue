/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { mapActions } from 'vuex'
import * as has from 'lodash/has'

export default {
  data() {
    return {
      isLoading: false,
      items: [],
      selected: [],
      search: this.$api.storage.getItem(this.searchStorageKey, 'session') || '',
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    getSetItems() {
      // TODO: make this consistent, no api endpoint should be returning .data
      return (
        this.apiRef
          .getList()
          .then((items) => {
            if (has(items, 'data')) {
              console.error('getList should return a list of formatted objects')
            }
            this.items = items
          })
          // TODO: work on handling this error
          .catch((error) => {
            this.showMessage(error)
            this.rtr.replace({ name: 'Home' })
          })
      )
    },
    getLabelsForExport() {
      return this.headers.map((h) => h.text)
    },
    // Set name of exported file
    getNameForExport() {
      const today = new Date()
      return `${this.itemType}_Export_${today.toISOString().substring(0, 10)}.csv`
    },
    // Format data for export to file
    getDataForExport() {
      const formattedItems = []
      // Loop through filtered items
      for (let i = 0; i < this.filteredItems.length; i++) {
        const item = this.filteredItems[i]
        // Init new record, will be a row in the exported file
        const newRecord = {}
        // Loop through column headers
        for (let j = 0; j < this.headers.length; j++) {
          const header = this.headers[j]
          // Key used to access data
          const key = header.value
          // Formatted key for displayed that data in final file
          const formattedKey = header.text
          let value = item[key]
          // If value is undefined, but not false
          if (!value && value !== false) continue
          // TODO: make this check more generalized for multiple item types
          // Check for different item types
          if (value.fullName) {
            // If item is user or contact
            value = value.fullName
            // If item is organization
          } else if (value.slug) {
            value = value.slug
            // If item has date
          } else if (key.toLowerCase().includes('date')) {
            value = value.substring(0, 10)
          }
          newRecord[formattedKey] = value
        }
        formattedItems.push(newRecord)
      }
      return formattedItems
    },
    navigateToItemCreate() {
      this.rtr.push({ name: `${this.itemType}Create`, query: { next: this.$route.path } })
    },
    getItemsFilteredBySearch() {
      let items = this.items
      if (this.search) {
        const search = this.search.toString().toLowerCase()
        items = items.filter((i) => {
          let item = i
          if (i.data) {
            item = i.data
          }
          return Object.keys(item).some((j) => this.filterSearch(item[j], search))
        })
      }
      return items
    },
    // TODO: this is inefficient because it's checking all attributes
    // Make it check only relevant fields
    // Taken almost directly from the Vuetify docs
    filterSearch(v, s) {
      let search = s
      if (search && v) {
        const val = v.toString().toLowerCase()
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search = search.replace('.', '')
        }
        return val !== null && ['undefined', 'boolean'].indexOf(typeof val) === -1 && val.indexOf(search) !== -1
      }
      return false
    },
  },
  computed: {
    listTitle() {
      return `${this.splitOnCapitals(this.itemType).join(' ')}s`
    },
    searchStorageKey() {
      return `${this.itemType}ListSearch`
    },
    filteredItems() {
      return this.getItemsFilteredBySearch()
    },
  },
  watch: {
    search(search) {
      this.$api.storage.setItem(this.searchStorageKey, search, 'session')
    },
  },
  mounted() {
    this.isLoading = true
    this.getSetItems().then(() => (this.isLoading = false))
  },
}
