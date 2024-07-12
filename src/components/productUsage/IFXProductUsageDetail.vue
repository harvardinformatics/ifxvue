<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'

export default {
  name: 'IFXProductDetail',
  mixins: [IFXProductUsageMixin, IFXItemDetailMixin],
  components: {},
  data() {
    return {
      selected: [],
    }
  },
  computed: {
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
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Billable</h3>
        </v-col>
        <v-col>
          <span v-if="item.billable">Yes</span>
          <span v-else>No</span>
        </v-col>
      </v-row>
      <v-row v-if="item.parent" justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Parent product</h3>
        </v-col>
        <v-col>
          {{ item.parent.name }}
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
