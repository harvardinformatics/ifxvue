<script>
export default {
  name: 'IFXDataTableCell',
  props: {
    header: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    custom: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    name() {
      return this.header.value
    }
  }
}
</script>

<template>
  <span v-if="custom">
    <slot name="custom"></slot>
  </span>
  <span v-else-if="name==='expenses'">
    <div v-for="expense in item.expenses" :key="expense.code">{{expense.code}}</div>
  </span>
  <span v-else-if="name==='expense_code'">
    <div>{{item.expense_code ? item.expense_code : 'N/A'}}</div>
  </span>
  <span v-else-if="name==='id'" data-cy='navigate-to-detail' @click.prevent="() => navigateToDetail(type, item.id)">
    <a class='data-table-id'>{{item.id}}</a>
  </span>
  <span v-else-if="name==='rowActionEdit'">
    <IFXButton btnType='edit' x-small data-cy='navigate-to-edit' @action='navigateToEdit(type, item.id)'></IFXButton>
  </span>
  <span v-else-if="name==='delivery_date'">
    <div>{{item.deliveryDate | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='date_created'">
    <div>{{item.date_created | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='dateCreated'">
    <div>{{item.dateCreated | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='dateJoined'">
    <div>{{item.dateJoined | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='groups'">
    <div>{{getGroupsString(item)}}</div>
  </span>
  <span v-else-if="name==='email'">
    <a :href="`mailto:${item.email}`">{{ item.email }}</a>
  </span>
  <span v-else-if="name==='date_modified'">
    <div>{{item.date_modified | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='dateModified'">
    <div>{{item.dateModified | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='sent'">
    <div>{{item.sent | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='reading_date'">
    <div>{{item.reading_date | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='date_valid'">
    <div>{{item.dateValid | humanDatetime}}</div>
  </span>
  <span v-else-if="name==='price_per_liter'">
    <div>{{item.price_per_liter | centsToDollars}}</div>
  </span>
  <span v-else-if="name==='credit_per_liter'">
    <div>{{item.credit_per_liter | centsToDollars}}</div>
  </span>
  <span v-else-if="name==='scf_per_liter'">
    <div>{{item.scf_per_liter | centsToDollars}}</div>
  </span>
  <span v-else-if="name==='active'">
    <div>{{item.active | capitalizeFirstLetter}}</div>
  </span>
  <span v-else-if="['to', 'cc', 'bcc'].includes(name)">
    <div>{{item.recipients[name].join(", ")}}</div>
  </span>
  <span v-else-if="name==='message'">
    <div>{{truncateString(item.message)}}</div>
  </span>
  <span v-else-if="name==='detail'">
    <a v-if='item.type === "email"' class='no-select' :href="`mailto:${item.detail}`">{{truncateString(item.detail, 30)}}</a>
    <span v-else>{{truncateString(item.detail, 30)}}</span>
  </span>
  <span v-else-if="name==='parents'">
    <div>{{formatOrganizationParents(item.parents)}}</div>
  </span>
  <span v-else-if="name==='rank'">
    <div>{{formatOrganizationRank(item.rank)}}</div>
  </span>
  <span v-else-if="name ==='isLoginActive'">
    <IFXLoginIcon :item='item' iconOnly />
  </span>
  <span v-else>
    <span>{{this.item[this.name]}}</span>
  </span>
</template>

<style scoped>
  .data-table-id {
    margin-right: 1rem;
  }
</style>
