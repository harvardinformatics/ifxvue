<script>
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import SubscriptionMixin from '@/components/subscription/SubscriptionMixin'

export default {
  name: 'IFXSubscriptionList',
  mixins: [IFXItemListMixin, SubscriptionMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  props: {},
  data() {
    return {
      key: 0,
      currentUserRecord: {},
    }
  },
  methods: {
    async getSetItems() {
      this.isLoading = true
      return this.apiRef
        .getList()
        .then((res) => {
          this.items = res
        })
        .catch((error) => {
          this.showMessage(error)
        })
        .finally(() => (this.isLoading = false))
    },
    subscribeToChannel(item) {
      this.$api.subscription
        .subscribeToChannel(item.subscriptionId)
        .then(() => {
          this.showMessage(`Subscribed to channel ${item.channelTitle}`)
        })
        .catch((error) => {
          this.showMessage(error)
        })
        .finally(() => {
          this.reloadSubscriptions()
        })
    },
    unsubscribeFromChannel(item) {
      this.$api.subscription
        .unsubscribeFromChannel(item.subscriptionId)
        .then(() => {
          this.showMessage(`Unsubscribed from channel ${item.channelTitle}`)
        })
        .catch((error) => {
          this.showMessage(error)
        })
        .finally(() => {
          this.reloadSubscriptions()
        })
    },
    async reloadSubscriptions() {
      await this.getSetItems()
      this.key += 1
    },
    toggleSubscription(item) {
      if (!item.subscribed) {
        this.unsubscribeFromChannel(item)
      } else {
        this.subscribeToChannel(item)
      }
    },
    canChangeSubscription(item) {
      if (item.isMandatory) {
        return false
      }
      return true
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Channel ID', value: 'channelId', sortable: true },
        { text: 'Title', value: 'channelTitle', sortable: true },
        { text: 'Organization', value: 'organizationName', sortable: true },
        { text: 'Subscribed', value: 'actions', sortable: false, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  watch: {},
  async mounted() {
    this.currentUserRecord = await this.$api.auth.getCurrentUserRecord()
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Channel Subscriptions</template>
      <template #actions>
        <IFXSearchField :search.sync="search" />
      </template>
    </IFXPageHeader>
    <v-container>
      <IFXItemDataTable
        :items="filteredItems"
        :headers="headers"
        :selected.sync="selected"
        :itemType="itemType"
        :show-select="false"
        :loading="isLoading"
        sortBy="channelTitle"
        :sortDesc="false"
      >
        <template v-slot:actions="{ item }">
          <v-switch
            v-model="item.subscribed"
            data-cy="toggle-subscription"
            @change="toggleSubscription(item)"
            :disabled="!canChangeSubscription(item)"
          ></v-switch>
        </template>
      </IFXItemDataTable>
    </v-container>
  </v-container>
</template>
<style scoped>
.ellipsis {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-height: 100px;
}
</style>
