<script>
export default {
  name: 'IFXBillingRecordTransactions',
  components: {},
  props: {
    billingRecord: {
      type: Object,
      required: true,
    },
  },
  mounted() {},
  data() {
    return {
      txnHeaders: [
        { text: 'ID', value: 'id', sortable: true, hide: true },
        { text: 'Charge', value: 'charge', sortable: true, width: '100px', namedSlot: true },
        { text: 'Rate', value: 'rate', sortable: true },
        { text: 'User', value: 'author.full_name', sortable: true },
        { text: 'Description', value: 'description', sortable: true },
      ],
    }
  },
  computed: {},
  methods: {},
  watch: {},
}
</script>
<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <td :colspan="12" class="pl-10 pr-0 pb-1">
    <v-data-table
      :headers="txnHeaders"
      :items="billingRecord.transactions"
      class="elevation-1"
      hide-default-footer
      dense
    >
      <template v-slot:item.charge="{ item }">
        {{ item.charge | centsToDollars }}
      </template>
    </v-data-table>
  </td>
</template>
<style scoped></style>
<style>
#data-table .v-data-table__expand-icon--active {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
#data-table .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
