<script>
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXReportRunMixin from '@/components/report/IFXReportRunMixin'

export default {
  name: 'IFXReportRunList',
  mixins: [IFXReportRunMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, click: true, width: '60px' },
        { text: 'Report', value: 'report', sortable: true, width: '150px' },
        { text: 'Excel', value: 'xlsFilePath', sortable: false, namedSlot: true },
        { text: 'CSV', value: 'textFilePath', sortable: false, namedSlot: true, width: '150px' },
        { text: 'Last Run', value: 'updated', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <IFXSearchField :search.sync="search" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template #xlsFilePath="{ item }">
        <a :href="item.xlsFileUrl">{{ item.xlsFilePath }}</a>
      </template>
      <template #textFilePath="{ item }">
        <a :href="item.textFileUrl">{{ item.textFilePath }}</a>
      </template>
      <template #updated="{ item }">
        {{ item.updated | humanDatetime }}
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
