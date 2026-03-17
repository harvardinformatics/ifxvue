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
        { title: 'ID', key: 'id', sortable: true, hide: true },
        { title: 'Charge', key: 'charge', sortable: true, width: '100px', namedSlot: true },
        { title: 'Rate', key: 'rate', sortable: true },
        { title: 'User', key: 'author.full_name', sortable: true },
        { title: 'Description', key: 'description', sortable: true },
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
        {{ $centsToDollars(item.charge) }}
      </template>
      <template v-slot:item.rate="{ item }">
        {{ item.rate }}
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
