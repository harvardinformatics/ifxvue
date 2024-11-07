<script>
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'GenericBillingSummaryList',
  mixins: [IFXItemListMixin],
  components: {
    IFXItemDataTable,
  },
  props: {
    facility: {
      required: true,
      type: Object,
    },
    apiString: {
      required: true,
      type: String,
    },
    itemType: {
      required: true,
      type: String,
    },
    headers: {
      required: true,
      type: Array,
    },
    month: {
      required: false,
      default: new Date().getMonth(),
      type: Number,
    },
    year: {
      required: false,
      default: new Date().getFullYear(),
      type: Number,
    },
    extraParams: {
      required: false,
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {
      fetchingData: false,
    }
  },
  mounted() {},
  methods: {
    async getSetItems() {
      this.fetchingData = true

      const params = {
        month: this.month,
        year: this.year,
        invoice_prefix: this.facility.invoicePrefix,
        ...this.extraParams,
      }
      this.items = await this.$api[this.apiString].getList(params)
      this.fetchingData = false
    },
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXItemDataTable
      :items="items"
      :headers="filteredHeaders"
      :selected.sync="selected"
      :itemType="itemType"
      :showSelect="false"
    >
      <template #totalDecimalCharge="{ item }">
        <span v-if="item.totalDecimalCharge">
          {{ item.totalDecimalCharge | dollars }}
        </span>
        <span v-else class="grey--text text--darken-1">No Charges</span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
