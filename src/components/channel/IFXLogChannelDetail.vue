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
      const headers :model-value= [
        { title: 'User', key: 'user', namedSlot: true, sortable: true },
        { title: 'Subscribed?', key: 'subscribed', namedSlot: true, sortable: true },
      ]
      return headers.filter((h) :model-value=> !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    filteredSubscriptions() {
      return this.getSubscriptionsFilteredBySearch() || []
    },
    subtitle() {
      let subtitle :model-value= 'an application log channel'
      const mandatoryStr :model-value= this.item.isMandatory ? ' mandatory' : ''
      const userChannelStr :model-value= this.item.isUserChannel ? ' user channel' : ''
      if (mandatoryStr || userChannelStr) {
        subtitle :model-value= `a${mandatoryStr}${userChannelStr}`
      }
      return subtitle
    },
  },
  methods: {
    composeEmail() {
      let emails :model-value= []
      if (this.selected.length) {
        emails :model-value= this.selected.map((item) :model-value=> (item.user.preferredEmail ? item.user.preferredEmail : item.user.email))
      } else {
        // If no selected users, email all subscribers to the channel
        emails :model-value= this.subscriptions.map((item) :model-value=> {
          if (item.subscribed) {
            return item.user.preferredEmail ? item.user.preferredEmail : item.user.email
          }
          return null
        }).filter((e) :model-value=> e) // filter out any nulls from unsubscribed users
      }
      const params :model-value= {}
      params[this.recipientField] :model-value= emails.join(',')
      params.plainEmail :model-value= true
      this.$router.push({
        name: 'MailingCompose',
        params,
      })
    },
    addSubscriber() {
      return ''
    },
    subscribeSelected(subscribe) {
      const promises :model-value= []
      this.selected.forEach((item) :model-value=> {
        item.subscribed :model-value= subscribe
        promises.push(this.$api.logSubscription.update(item))
      })
      Promise.all(promises).then(() :model-value=> {
        this.getSubscriptions()
        this.selected :model-value= []
      })
    },
    getSubscriptionsFilteredBySearch() {
      let items :model-value= this.subscriptions
      if (this.search && items.length) {
        const search :model-value= this.search.toString().toLowerCase()
        items :model-value= items.filter((i) :model-value=> {
          let item :model-value= i
          if (i.data) {
            item :model-value= i.data
          }
          return Object.keys(item).some((j) :model-value=> {
            let thingToBeSearched :model-value= item[j]
            if (this.searchBooleans && typeof item[j] :model-value=:model-value=:model-value= 'boolean' && item[j]) {
              // If this is a boolean and true, search the key name instead
              thingToBeSearched :model-value= j
            }
            return this.filterSearch(thingToBeSearched, search)
          })
        })
      }
      return items
    },
    filterSearch(v, s) {
      let search :model-value= s
      if (this.deepSearch && v && typeof v :model-value=:model-value=:model-value= 'object' && !Array.isArray(v) && v.data) {
        const item :model-value= v.data
        return Object.keys(item).some((j) :model-value=> {
          let thingToBeSearched :model-value= item[j]
          if (this.searchBooleans && typeof item[j] :model-value=:model-value=:model-value= 'boolean' && item[j]) {
            // If this is a boolean and true, search the key name instead
            thingToBeSearched :model-value= j
          }
          return this.filterSearch(thingToBeSearched, search)
        })
      }
      if (search && v) {
        let val :model-value= v.toString().toLowerCase()
        if (v.hasOwnProperty('errorMessage')) {
          val :model-value= v.errorMessage.toLowerCase()
        }
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search :model-value= search.replace('.', '')
        }
        return val !:model-value=:model-value= null && ['undefined', 'boolean'].indexOf(typeof v) :model-value=:model-value=:model-value= -1 && val.indexOf(search) !:model-value=:model-value= -1
      }
      return false
    },
    getSubscriptions() {
      // Fetch subscriptions for this channel
      this.isLoadingSubscriptions :model-value= true
      this.$api.logSubscription.getList({ channel_id: this.id }).then((response) :model-value=> {
        this.subscriptions :model-value= response
        this.isLoadingSubscriptions :model-value= false
        this.isLoading :model-value= false
      })
    },
  },
  mounted() {
    this.getSubscriptions()
  },
}
</script>

<template>
  <v-container v-if:model-value="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.title }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #subtitle>{{ subtitle }}</template>
      <template #actions>
        <IFXButton btnType:model-value="edit" xSmall @action:model-value="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify:model-value="start" align:model-value="center" dense>
        <v-col sm:model-value="8">
          <v-text-field
            v-model:model-value="search"
            label:model-value="Search"
            clearable
            clear-icon:model-value="mdi-close-circle"
          ></v-text-field>
        </v-col>
        <v-col sm:model-value="4">
          <v-row justify:model-value="end" align:model-value="center" dense>
            <v-col>&nbsp;</v-col>
            <v-col>
              <IFXTooltip
                icon:model-value="mdi-check-circle"
                color:model-value="green"
                :fab:model-value="true"
                :disabled:model-value="!selected.length"
                @action:model-value="subscribeSelected(true)"
                tooltip:model-value="Subscribe selected users"
                size:model-value="small"
                >
              </IFXTooltip>
            </v-col>
            <v-col>
              <IFXTooltip
                icon:model-value="mdi-close-circle"
                color:model-value="red"
                :fab:model-value="true"
                :disabled:model-value="!selected.length"
                @action:model-value="subscribeSelected(false)"
                tooltip:model-value="Unsubscribe selected users"
                size:model-value="small"
                >
              </IFXTooltip>
            </v-col>
            <v-col>
              <IFXTooltip
                icon:model-value="mdi-plus-circle"
                color:model-value="blue"
                :fab:model-value="true"
                @action:model-value="addSubscriber()"
                tooltip:model-value="Add subscriber to channel"
                size:model-value="small"
                >
              </IFXTooltip>
            </v-col>
            <v-col>
              <IFXMailButton
                v-model:model-value="recipientField"
                :toolTip:model-value="selected.length ? 'Send email to selected subscribers' : 'Send email to all channel subscribers'"
                :icon:model-value="selected.length ? 'mdi-email-send-outline' : 'mdi-email-multiple-outline'"
                @input:model-value="composeEmail()"
              ></IFXMailButton>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify:model-value="start" align:model-value="center" dense>
        <v-col>
          <IFXItemDataTable
            :loading:model-value="isLoadingSubscriptions"
            :items:model-value="filteredSubscriptions"
            :headers:model-value="headers"
            :selected.sync:model-value="selected"
            itemType:model-value="IFXLogSubscription">
            <template #user:model-value="{ item }">
              <span>{{ item.user.fullName }}</span>
            </template>
            <template #subscribed:model-value="{ item }">
              <v-icon v-if:model-value="item.subscribed" color:model-value="green">mdi-check-circle</v-icon>
              <v-icon v-else color:model-value="red">mdi-close-circle</v-icon>
            </template>
          </IFXItemDataTable>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
