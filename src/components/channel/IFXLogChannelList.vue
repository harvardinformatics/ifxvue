<script>
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXMailButton from '@/components/mailing/IFXMailButton';

export default {
  name: 'LogChannelList',
  mixins: [IFXItemListMixin, IFXLogChannelMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXMailButton,
  },
  data() {
    return {
      recipientField: '',
    }
  },
  computed: {
    headers() {
      const headers :model-value= [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Title', key: 'title', sortable: true },
        { title: 'Organization', key: 'organization', sortable: true },
        { title: '', key: 'rowActionEdit', sortable: false, namedSlot: true }
      ]
      return headers.filter((h) :model-value=> !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    composeEmail() {
      // Get the email addresses in "recipient" form for all subscribers to the selected channels
      const ids :model-value= this.selected.map((item) :model-value=> item.id)
      const params :model-value= {}
      this.$api.logChannel.getSubscriberEmails(ids).then((res) :model-value=> {
        params[this.recipientField] :model-value= res.subscribers.join(',')
        params.plainEmail :model-value= true
        this.$router.push({
          name: 'MailingCompose',
          params,
        })
      })
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Channels</template>
      <template #actions>
        <v-row>
          <v-col sm:model-value="6">
            <IFXSearchField v-model:search:model-value="search" />
          </v-col>
          <v-col>
            <v-row justify:model-value="end">
              <v-col></v-col>
              <v-col sm:model-value="3">
                <IFXButton btnType:model-value="add" size:model-value="small" @action:model-value="navigateToItemCreate" />
              </v-col>
              <v-col sm:model-value="3">
                <IFXMailButton
                  v-model:model-value="recipientField"
                  :disabled:model-value="!selected.length"
                  toolTip:model-value="Send email to channel subscribers"
                  @input:model-value="composeEmail()"
                ></IFXMailButton>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :loading:model-value="isLoading" :items:model-value="filteredItems" :headers:model-value="headers" :selected.sync:model-value="selected" :itemType:model-value="itemType">
    </IFXItemDataTable>
  </v-container>
</template>
