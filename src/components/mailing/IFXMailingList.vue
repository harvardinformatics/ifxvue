<script>
import IFXActionSelect from '@/components/action/IFXActionSelect'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMailingMixin from '@/components/mailing/IFXMailingMixin'

export default {
  name: 'IFXMailingList',
  mixins: [IFXMailingMixin, IFXItemListMixin],
  components: {
    IFXItemDataTable,
    IFXSearchField,
    IFXActionSelect
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Sent', value: 'sent', sortable: true },
        { text: 'Subject', value: 'subject', sortable: true },
        { text: 'From', hide: 'mdAndDown', value: 'fromstr' },
        { text: 'To', value: 'tostr' },
        { text: 'CC', hide: 'mdAndDown', value: 'ccstr' },
        { text: 'BCC', hide: 'mdAndDown', value: 'bccstr' },
        { text: 'Message', value: 'message' },
        { text: 'Status', hide: 'mdAndDown', value: 'status' },
        { text: '', value: 'rowActionEdit', sortable: false }
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <IFXSearchField :search.sync='search'/>
        <IFXActionSelect
          :actionKeys="['deleteItems']"
          :apiRef='apiRef'
          @get-set-items='getSetItems'
          :selectedItems.sync='selected'
        />
        <IFXButton btnType="add" @action="navigateToItemCreate"/>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items='items'
      :headers='headers'
      :selected.sync='selected'
      :itemType='itemType'
    />
  </v-container>
</template>

<style scoped>
.mailing-list-table {
  padding: 1rem;
}
</style>
