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
      showDeactivatedRates: false,
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
    filteredRates() {
      if (this.item?.rates) {
        return this.item.rates.filter((r) => r.active || this.showDeactivatedRates)
      }
      return []
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
        <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Product Number</h3>
        </v-col>
        <v-col>
          {{ item.productNumber }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Facility</h3>
        </v-col>
        <v-col>
          {{ item.facility }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Description</h3>
        </v-col>
        <v-col>
          {{ item.description }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="d-flex justify-space-between">
            <h3>Rates</h3>
            <v-checkbox
              class="pt-0 mt-0"
              v-model="showDeactivatedRates"
              label="Show deactivated rates"
              data-cy="show-deactivated-rates"
            ></v-checkbox>
          </div>
          <IFXItemDataTable
            v-if="filteredRates.length"
            :items="filteredRates"
            :headers="headers"
            :selected.sync="selected"
            itemType="ProductRate"
            :showSelect="false"
          >
            <template #active="{ item }">
              <v-tooltip v-if="item.active" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs" color="#fcbd01">lightbulb</v-icon>
                </template>
                <span>Active rate</span>
              </v-tooltip>
              <v-tooltip v-else top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs" color="#ccc">lightbulb</v-icon>
                </template>
                <span>Inactive rate</span>
              </v-tooltip>
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
