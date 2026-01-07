<script>
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'LogChannelList',
  mixins: [IFXItemListMixin, IFXLogChannelMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'Organization', value: 'organization', sortable: true },
        { text: '', value: 'actions', sortable: false, namedSlot: true }
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
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
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :loading="isLoading" :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template v-slot:actions="{ item }">
        <span style="white-space: nowrap">{{ item.validFrom | columnDate }}</span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
