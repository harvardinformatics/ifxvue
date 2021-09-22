<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXProductMixin from '@/components/product/IFXProductMixin'

export default {
  name: 'IFXProductDetail',
  mixins: [IFXProductMixin, IFXItemDetailMixin],
  components: {
    IFXDeleteItemButton,
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
        { text: 'ID', value: 'id', sortable: true, slot: true },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Price', value: 'price', sortable: true },
        { text: 'Units', value: 'units', sortable: true, slot: true },
        { text: 'Max Quantity', value: 'maxQty', sortable: false, slot: true },
        { text: 'Active', value: 'active', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {},
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.name }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <!-- TODO: check why this cannot be edited -->
        <IFXButton v-if="!item.productNumber" btnType="edit" @action="navigateToItemEdit(id)" />
        <IFXDeleteItemButton v-if="!item.productNumber" :item="item" :apiRef="apiRef" :itemType="itemType" />
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
          </IFXItemDataTable>
          <span v-else>None</span>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
