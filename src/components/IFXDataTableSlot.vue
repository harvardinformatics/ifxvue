<script>
export default {
  name: "IFXDataTableSlot",
  props: {
    name: String,
    item: Object
  }
}
</script>

<template>
  <span v-if="name==='expenses'">
    <div v-for="expense in item.expenses" :key="expense.code">{{expense.code}}</div>
  </span>
  <span v-else-if="name==='expense_code'">
    <div>{{item.expense_code ? item.expense_code : 'N/A'}}</div>
  </span>
  <span v-else-if="name==='delivery_date'">
    <div>{{item.deliveryDate | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='date_created'">
    <span>{{item.date_created | humanDatetime}}</span>
  </span>
  <span v-else-if="name==='date_modified'">
    <span>{{item.date_modified | humanDatetime}}</span>
  </span>
  <span v-else-if="name==='reading_date'">
    <span>{{item.reading_date | humanDatetime}}</span>
  </span>
  <span v-else-if="name==='date_valid'">
    <span>{{item.dateValid | humanDatetime}}</span>
  </span>
  <span v-else-if="name==='price_per_liter'">
    <span>{{item.price_per_liter | centsToDollars}}</span>
  </span>
  <span v-else-if="name==='credit_per_liter'">
    <span>{{item.credit_per_liter | centsToDollars}}</span>
  </span>
  <span v-else-if="name==='scf_per_liter'">
    <span>{{item.scf_per_liter | centsToDollars}}</span>
  </span>
  <span v-else-if="name==='active'">
    <span>{{item.active | capitalizeFirstLetter}}</span>
  </span>
</template>

<style>

</style>