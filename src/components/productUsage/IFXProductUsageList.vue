<script>
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'

export default {
  name: 'IFXProductUsageList',
  mixins: [IFXProductUsageMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true, width: '60px' },
        // { text: 'Product Number', value: 'productNumber', sortable: true, slot: true, width: '150px' },
        { text: 'Product Name', value: 'ProductName', sortable: true },
        { text: 'Quantity', value: 'decimalQuantity', sortable: true, namedSlot: true },
        { text: 'Description', value: 'description', sortable: true, width: '150px' },
        { text: 'Organization', value: 'organization', sortable: true, slot: true, namedSlot: true },
        { text: 'Product User', value: 'productUser', sortable: true, slot: true, namedSlot: true },
        { text: 'Logged By', value: 'loggedBy', sortable: true, slot: true },
        { text: 'Start Date', value: 'startDate', sortable: true, namedSlot: true },
        { text: 'End Date', value: 'endDate', sortable: false, namedSlot: true },
        { text: '', value: 'rowActionEdit', slot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    displayQuantityWithUnits(item) {
      const units = this.pluralize(item.decimalQuantity, item.units)
      return `${item.decimalQuantity} ${units}`
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
    getFullName(item) {
      return item.fullName ? item.fullName : `${item.firstName} ${item.lastName}`
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
      <template #decimalQuantity="{ item }">
        {{ displayQuantityWithUnits(item) }}
      </template>
      <template #organization="{ item }">
        {{ item.organization | orgNameFromSlug }}
      </template>
      <template #productUser="{ item }">
        {{ item.organization | orgNameFromSlug }}
      </template>
      <template #startDate="{ item }">
        {{ item.startDate | humanDatetime }}
      </template>
      <template #endDate="{ item }">
        {{ item.endDate | humanDatetime }}
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
