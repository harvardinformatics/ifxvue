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
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'Organization', value: 'organization', sortable: true },
        { text: '', value: 'rowActionEdit', sortable: false, namedSlot: true }
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    composeEmail() {
      // Get the email addresses of all subscribers to the selected channels
      return ''
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Channels</template>
      <template #actions>
        <IFXSearchField :search.sync="search" />
        <IFXButton btnType="add" small @action="navigateToItemCreate" />
        <IFXMailButton
          v-model="recipientField"
          :disabled="!filteredItems.length"
          toolTip="Send email to channel subscribers"
          @input="composeEmail()"
        ></IFXMailButton>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :loading="isLoading" :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
    </IFXItemDataTable>
  </v-container>
</template>
