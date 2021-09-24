<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXProductMixin from '@/components/product/IFXProductMixin'

export default {
  name: 'IFXProductDetail',
  mixins: [IFXProductMixin, IFXItemDetailMixin],
  components: {
    IFXItemDataTable,
  },
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Price', value: 'price', sortable: true },
        { text: 'Units', value: 'units', sortable: true, slot: true },
        { text: 'Max Quantity', value: 'maxQty', sortable: false, namedSlot: true },
        { text: 'Active', value: 'active', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.name }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <IFXButton btnType="edit" @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row>
        <v-col>
          <h3>Product Number</h3>
          <p>{{ item.productNumber }}</p>
        </v-col>
        <v-col>
          <h3>Facility</h3>
          <p>{{ item.facility }}</p>
        </v-col>
        <v-col>
          <h3>Description</h3>
          <p>{{ item.description }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Rates</h3>
          <IFXItemDataTable
            v-if="item.rates && item.rates.length"
            :items="item.rates"
            :headers="headers"
            :selected.sync="selected"
            itemType="ProductRate"
            :showSelect="false"
          >
            <template #active="{ item }">
              {{ item.active ? 'Yes' : 'No' }}
            </template>
            <template #maxQty="{ item }">
              {{ item.maxQty ? `${pluralize(item.maxQty, item.units)}` : '∞' }}
            </template>
          </IFXItemDataTable>
          <span v-else>None</span>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
