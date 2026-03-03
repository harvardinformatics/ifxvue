<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXMailButton from '@/components/mailing/IFXMailButton';

export default {
  name: 'IFXLogChannelDetail',
  mixins: [IFXLogChannelMixin, IFXItemDetailMixin],
  components: {
    IFXItemDataTable, IFXMailButton
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
      recipientField: null,
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'User', value: 'user', namedSlot: true, sortable: true },
        { text: 'Subscribed?', value: 'subscribed', namedSlot: true, sortable: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    filteredSubscriptions() {
      return this.getSubscriptionsFilteredBySearch() || []
    },
    subtitle() {
      let subtitle = 'an application log channel'
      const mandatoryStr = this.item.isMandatory ? ' mandatory' : ''
      const userChannelStr = this.item.isUserChannel ? ' user channel' : ''
      if (mandatoryStr || userChannelStr) {
        subtitle = `a${mandatoryStr}${userChannelStr}`
      }
      return subtitle
    },
  },
  methods: {
    composeEmail() {
      const emails = this.selected.map((item) => (item.preferredEmail ? item.preferredEmail : item.user.email))
      const params = {}
      params[this.recipientField] = emails.join(',')
      params.plainEmail = true
      this.$router.push({
        name: 'MailingCompose',
        params,
      })
    },
    addSubscriber() {
      return ''
    },
    subscribeSelected(subscribe) {
      const promises = []
      this.selected.forEach((item) => {
        item.subscribed = subscribe
        promises.push(this.$api.logSubscription.update(item))
      })
      Promise.all(promises).then(() => {
        this.getSubscriptions()
        this.selected = []
      })
    },
    getSubscriptionsFilteredBySearch() {
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
      <template #subtitle>{{ subtitle }}</template>
      <template #actions>
        <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="6">
          <v-text-field
            v-model="search"
            label="Search"
            clearable
            clear-icon="mdi-close-circle"
          ></v-text-field>
        </v-col>
        <v-col>
          <IFXMailButton
            v-model="recipientField"
            :disabled="!selected.length"
            toolTip="Send email to selected subscribers"
            @input="composeEmail()"
          ></IFXMailButton>
        </v-col>
        <v-col sm="4">
          <v-row justify="end" align="center" dense>
            <v-col>&nbsp;</v-col>
            <v-col>
              <IFXTooltip
                icon="mdi-check-circle"
                color="green"
                :fab="true"
                :disabled="!selected.length"
                @action="subscribeSelected(true)"
                tooltip="Subscribe selected users"
                :small="true"
                >
              </IFXTooltip>
            </v-col>
            <v-col>
              <IFXTooltip
                icon="mdi-close-circle"
                color="red"
                :fab="true"
                :disabled="!selected.length"
                @action="subscribeSelected(false)"
                tooltip="Unsubscribe selected users"
                :small="true"
                >
              </IFXTooltip>
            </v-col>
            <v-col>
              <IFXTooltip
                icon="mdi-plus-circle"
                color="blue"
                :fab="true"
                @action="addSubscriber()"
                tooltip="Add subscriber to channel"
                :small="true"
                >
              </IFXTooltip>
            </v-col>
          </v-row>
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
              <span>{{ item.user.fullName }}</span>
            </template>
            <template #subscribed="{ item }">
              <v-icon v-if="item.subscribed" color="green">mdi-check-circle</v-icon>
              <v-icon v-else color="red">mdi-close-circle</v-icon>
            </template>
          </IFXItemDataTable>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
