<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'

export default {
  name: 'IFXLogChannelDetail',
  mixins: [IFXLogChannelMixin, IFXItemDetailMixin],
  components: {
    IFXItemDataTable,
  },
  data() {
    return {
      subscriptions: [],
      isLoadingSubscriptions: true,
      search: '',
      selected: [],
      deepSearch: true,
      searchBooleans: true,
      isLoading: true,
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'User', value: 'user', namedSlot: true, sortable: true },
        { text: 'Subscribed?', value: 'subscribed', sortable: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    filteredSubscriptions() {
      return this.getSubscriptionsFilteredBySearch() || []
    },
  },
  methods: {
    getSubscriptionsFilteredBySearch() {
      console.log('Filtering subscriptions with search:', this.search, this.subscriptions)
      let items = this.subscriptions
      if (this.search && items.length) {
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
        if (v.hasOwnProperty('errorMessage')) {
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
    getSubscriptions() {
      // Fetch subscriptions for this channel
      this.isLoadingSubscriptions = true
      this.$api.logSubscription.getList({ channel_id: this.id }).then((response) => {
        this.subscriptions = response
        this.isLoadingSubscriptions = false
        this.isLoading = false
      })
    },
  },
  mounted() {
    this.getSubscriptions()
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.title }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="6">
          <v-text-field
            v-model="search"
            label="Search Subscriptions"
            clearable
            clear-icon="mdi-close-circle"
          ></v-text-field>
        </v-col>
        <v-col>
          &nbsp;
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col>
          <IFXItemDataTable
            :loading="isLoadingSubscriptions"
            :items="filteredSubscriptions"
            :headers="headers"
            :selected.sync="selected"
            itemType="IFXLogSubscription">
            <template #user="{ item }">
              <span>{{ item.user.full_name }}</span>
            </template>
          </IFXItemDataTable>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
