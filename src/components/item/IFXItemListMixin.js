/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      items: [],
      selected: [],
      search: '',
      deepSearch: false,
      searchBooleans: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    getSetItems() {
      return (
        this.apiRef
          .getList()
          .then((items) => {
            this.items = items
          })
          .catch((error) => {
            this.showMessage(error)
            this.$router.replace({ name: 'Home' })
          })
      )
    },
    getFieldsForExport() {
      return Object.fromEntries(
        this.headers.filter((h) => h.title && h.title !== 'Actions').map((h) => [h.title, h.title])
      )
    },
    // Set name of exported file
    getNameForExport() {
      const today = new Date()
      return `${this.itemType}_Export_${today.toISOString().substring(0, 10)}.csv`
    },
    getDataForExport() {
      /* eslint-disable no-plusplus, no-continue */
      const formattedItems = []
      for (let i = 0; i < this.filteredItems.length; i++) {
        const newRecord = {}
        for (let j = 0; j < this.headers.length; j++) {
          const header = this.headers[j]
          const keys = header.key.split('.')
          const formattedKey = header.title
          let item = this.filteredItems[i]
          let value = item
          keys.forEach((key) => {
            value = value[key]
          })
          if (!value && value !== false) continue
          if (header.key === 'startDate' || header.key === 'endDate') {
            value = moment(String(value)).format('M/DD/YYYY h:mm A')
            if (!value) {
              value = 'None'
            }
          } else if (header.key.toLowerCase().includes('date')) {
            value = value.substring(0, 10)
          } else if (header.key === 'organization') {
            value = this.$api.organization.parseSlug(value).name
          } else if (header.key === 'fullName') {
            // If item is user or contact
            value = value.fullName
            // If item is organization
          } else if (header.key === 'slug') {
            value = value.slug
          }
          newRecord[formattedKey] = value
        }
        formattedItems.push(newRecord)
      }
      return formattedItems
      /* eslint-enable no-plusplus, no-continue */
    },
    navigateToItemCreate() {
      this.$router.push({ name: `${this.itemType}Create`, query: { next: this.$route.path } })
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
          return Object.keys(item).some((j) => {
            let thingToBeSearched = item[j]
            if (this.searchBooleans && typeof item[j] === 'boolean' && item[j]) {
              // If this is a boolean and true, search the key name instead
              thingToBeSearched = j
            }
            return this.filterSearch(thingToBeSearched, search)
          })
        })
      }
      return items
    },
    filterSearch(v, s) {
      let search = s
      if (this.deepSearch && v && typeof v === 'object' && !Array.isArray(v) && v.data) {
        const item = v.data
        return Object.keys(item).some((j) => {
          let thingToBeSearched = item[j]
          if (this.searchBooleans && typeof item[j] === 'boolean' && item[j]) {
            // If this is a boolean and true, search the key name instead
            thingToBeSearched = j
          }
          return this.filterSearch(thingToBeSearched, search)
        })
      }
      if (search && v) {
        let val = v.toString().toLowerCase()
        if (Object.prototype.hasOwnProperty.call(v, 'errorMessage')) {
          val = v.errorMessage.toLowerCase()
        }
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search = search.replace('.', '')
        }
        return val !== null && ['undefined', 'boolean'].indexOf(typeof v) === -1 && val.indexOf(search) !== -1
      }
      return false
    },
    getAdditionalData() {
      // This is a placeholder that gets overridden in the component if it needs to load extra data
      return Promise.resolve()
    }
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
    this.search = this.$api.storage.getItem(this.searchStorageKey, 'session') || ''
    this.isLoading = true
    this.getAdditionalData().then(() => {
      this.getSetItems().then(() => {
        this.isLoading = false
      })
    })
  },
}