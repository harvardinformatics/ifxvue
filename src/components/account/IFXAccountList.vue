<script>
import { IFXItemDataTable, IFXSearchField, IFXActionSelect, IFXItemListMixin } from 'ifxvue'
import accountMixin from '@/components/account/IFXAccountMixin'

export default {
  name: 'IFXAccountList',
  mixins: [accountMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXActionSelect
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Code', value: 'code', sortable: true },
        { text: 'Account Type', value: 'account_type', sortable: true },
        { text: 'Active', value: 'active', sortable: true },
        { text: 'Expiration Date', value: 'expiration_date', sortable: true },
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
      :items='filteredItems'
      :headers='headers'
      :selected.sync='selected'
      :itemType='itemType'
    />
  </v-container>
</template>
