<script>
import IFXActionSelect from '@/components/action/IFXActionSelect'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'

import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXMessageList',
  mixins: [IFXMessageMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXActionSelect,
    IFXItemDataTable
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Subject', value: 'subject' },
        { text: 'Message', value: 'message' },
        { text: '', value: 'rowActionEdit' },
        { text: '', value: 'rowActionCopy' }
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
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
      :items='filteredItems'
      :headers='headers'
      :selected.sync='selected'
      :itemType='itemType'
    />
  </v-container>
</template>
