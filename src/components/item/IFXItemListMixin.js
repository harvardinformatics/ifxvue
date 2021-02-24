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
      return this.apiRef.getList()
        .then(items => {
          if (has(items, 'data')) {
            console.error('getList should return a list of formatted objects')
          }
          this.items = items
        })
        // TODO: work on handling this error
        .catch(error => {
          this.showMessage(error)
          this.rtr.replace({ name: 'Home' })
        })
    },
    getLabelsForExport() {
      return this.headers.map(h => h.text)
    },
    getNameForExport() {
      const today = new Date()
      return `${this.itemType}_Export_${today.toISOString().substring(0, 10)}.csv`
    },
    getDataForExport() {
      const formattedItems = []
      for (let i = 0; i < this.filteredItems.length; i++) {
        const item = this.filteredItems[i]
        const newRecord = {}
        for (let j = 0; j < this.headers.length; j++) {
          const header = this.headers[j]
          const key = header.value
          const formattedKey = header.text
          let value = item[key]
          if (!value && value !== false) continue
          if (value.fullName) {
            value = value.fullName
          } else if (value.slug) {
            value = value.slug
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
      this.rtr.push({ name: `${this.itemType}Create` })
    },
    getItemsFilteredBySearch() {
      let items = this.items
      if (this.search) {
        const search = this.search.toString().toLowerCase()
        items = items.filter(i => {
          let item = i
          if (i.data) {
            item = i.data
          }
          return Object.keys(item).some(j => this.filterSearch(item[j], search))
        })
      }
      return items
    },
    filterSearch(v, search) {
      if (search && v) {
        const val = v.toString().toLowerCase()
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search = search.replace('.', '')
        }
        return val !== null
        && ['undefined', 'boolean'].indexOf(typeof val) === -1
        && val.indexOf(search) !== -1
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
    }
  },
  watch: {
    search(search) {
      this.$api.storage.setItem(this.searchStorageKey, search, 'session')
    }
  },
  mounted() {
    this.isLoading = true
    this.getSetItems()
      .then(() => this.isLoading = false)
  }
}
