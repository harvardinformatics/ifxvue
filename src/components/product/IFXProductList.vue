<script>
import IFXActionSelect from '@/components/action/IFXActionSelect'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXProductMixin from '@/components/product/IFXProductMixin'

export default {
  name: 'IFXProductList',
  mixins: [IFXProductMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXActionSelect,
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true, width: '60px' },
        { text: 'Product Number', value: 'productNumber', sortable: true, slot: true, width: '150px' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Description', value: 'description', sortable: true, width: '150px' },
        { text: 'Facility', value: 'facility', sortable: true, slot: true },
        { text: 'Rates', value: 'rates', sortable: false, namedSlot: true },
        { text: 'Reporting Group', value: 'reportingGroup', sortable: true, slot: true },
        { text: '', value: 'rowActionEdit', slot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    displayRateNames(item) {
      return item.rates.length ? item.rates.map((rate) => rate.name).join(', ') : 'None'
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
        <IFXActionSelect
          :actionKeys="['deleteProduct']"
          :apiRef="apiRef"
          @get-set-items="getSetItems"
          :selectedItems.sync="selected"
        />
        <IFXButton btnType="add" small @action="navigateToItemCreate" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template #rates="{ item }">
        {{ displayRateNames(item) }}
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
