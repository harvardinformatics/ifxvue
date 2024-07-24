<script>
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
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true, width: '60px' },
        { text: 'Product Number', value: 'productNumber', sortable: true, slot: true, width: '150px' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Description', value: 'description', sortable: true, width: '150px' },
        { text: 'Facility', value: 'facility', sortable: true, slot: true },
        { text: 'Parent', value: 'parent', sortable: true, namedSlot: true },
        { text: 'Category', value: 'productCategory', sortable: true, slot: true, namedSlot: true },
        { text: 'Rates', value: 'rates', sortable: false, namedSlot: true },
        { text: '', value: 'rowActionEdit', slot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    displayRateNames(item) {
      // Only display names for active rates
      return item.rates.length
        ? item.rates
          .filter((rate) => rate.active)
          .map((rate) => rate.name)
          .join(', ')
        : 'None'
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
        <IFXButton btnType="add" small @action="navigateToItemCreate" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template #rates="{ item }">
        {{ displayRateNames(item) }}
      </template>
      <template #parent="{ item }">
        <span v-if="item.parent">{{ item.parent.name }}</span>
      </template>
      <template #productCategory="{ item }">
        <span v-if="item.productCategory">{{ item.productCategory }}</span>
        <span v-else class="grey--text text--darken-1">None</span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
