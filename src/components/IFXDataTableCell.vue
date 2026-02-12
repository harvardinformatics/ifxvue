<script>
// Library of data table cell types
// Assumes use with IFXDataTable component
import IFXLoginIcon from '@/components/IFXLoginIcon'

export default {
  name: 'IFXDataTableCell',
  components: {
    IFXLoginIcon,
  },
  props: {
    header: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: false,
      default: 1,
    },
    // User can define their own custom display
    custom: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    name() {
      return this.header.key
    },
  },
  methods: {
    getDetailRoute(type, id) {
      return {
        name: `${type}Detail`,
        params: { id },
        query: { page: this.page }
      }
    },
    getEditRoute(type, id) {
      return {
        name: `${type}Edit`,
        params: { id },
        query: { page: this.page }
      }
    },
    navigateToCopy(type, item) {
      this.$router.push({
        name: `${type}New`,
        query: {
          copy: item.id,
          page: this.page
        }
      })
    },
  },
}
</script>

<template>
  <span v-if="custom">
    <slot name="custom"></slot>
  </span>
  <span v-else-if="name === 'expenses'">
    <div v-for="expense in item.expenses" :key="expense.code">{{ expense.code }}</div>
  </span>
  <span v-else-if="name === 'expenseCode'">
    <div>{{ item.expenseCode ? item.expenseCode : 'N/A' }}</div>
  </span>
  <span v-else-if="name === 'id'" data-cy="navigate-to-detail">
    <router-link
      :to="getDetailRoute(type, item.id)"
      class="data-table-id"
    >
      {{ item.id }}
    </router-link>
  </span>
  <span v-else-if="name === 'loggedBy'" data-cy="navigate-to-detail">
    <router-link
      :to="getDetailRoute('User', item.loggedBy.id)"
      class="data-table-id"
    >
      {{ item.loggedBy.fullName }}
    </router-link>
  </span>
  <span v-else-if="name === 'user'" data-cy="navigate-to-detail">
    <router-link
      :to="getDetailRoute('User', item.user.id)"
      class="data-table-id"
    >
      {{ item.user.fullName }}
    </router-link>
  </span>
  <span v-else-if="name === 'rowActionEdit'">
    <IFXButton
      btnType="edit"
      small
      data-cy="navigate-to-edit"
      @action="$router.push(getEditRoute(type, item.id))"
    />
  </span>
  <span v-else-if="name === 'rowActionDetailEdit'">
    <IFXButton
      btnType="edit"
      small
      data-cy="navigate-to-detail"
      @action="$router.push(getDetailRoute(type, item.id))"
    />
  </span>
  <span v-else-if="name === 'rowActionCopy'">
    <IFXButton
      btnType="copy"
      small
      data-cy="navigate-to-copy"
      @action="navigateToCopy(type, item)"
    />
  </span>
  <span v-else-if="name === 'withdrawlDate'">
    <div>{{ $humanDatetime(item.withdrawalDate) }}</div>
  </span>
  <span v-else-if="name === 'deliveryDate'">
    <div>{{ $humanDatetime(item.deliveryDate) }}</div>
  </span>
  <span v-else-if="name === 'created'">
    <div>{{ $humanDatetime(item.created) }}</div>
  </span>
  <span v-else-if="name === 'updated'">
    <div>{{ $humanDatetime(item.updated) }}</div>
  </span>
  <span v-else-if="name === 'dateCreated'">
    <div>{{ $humanDatetime(item.dateCreated) }}</div>
  </span>
  <span v-else-if="name === 'dateJoined'">
    <div>{{ $humanDatetime(item.dateJoined) }}</div>
  </span>
  <span v-else-if="name === 'groups'">
    <div>{{ getGroupsString(item) }}</div>
  </span>
  <span v-else-if="name === 'organization'">
    <div>{{ truncateString(item.organization, 30) }}</div>
  </span>
  <span v-else-if="name === 'comment'">
    <div>{{ truncateString(item.comment, 30) }}</div>
  </span>
  <span v-else-if="name === 'email'">
    <a class="data-table-link" :href="`mailto:${item.email}`">{{ item.email }}</a>
  </span>
  <span v-else-if="name === 'dateModified'">
    <div>{{ $humanDatetime(item.dateModified) }}</div>
  </span>
  <span v-else-if="name === 'sent'">
    <div>{{ $humanDatetime(item.sent) }}</div>
  </span>
  <span v-else-if="name === 'readingDate'">
    <div>{{ $humanDatetime(item.readingDate) }}</div>
  </span>
  <span v-else-if="name === 'dateValid'">
    <div>{{ $humanDatetime(item.dateValid) }}</div>
  </span>
  <span v-else-if="name === 'pricePerLiter'">
    <div>{{ $centsToDollars(item.pricePerLiter) }}</div>
  </span>
  <span v-else-if="name === 'creditPerLiter'">
    <div>{{ $centsToDollars(item.creditPerLiter) }}</div>
  </span>
  <span v-else-if="name === 'scfPerLiter'">
    <div>{{ $centsToDollars(item.scfPerLiter) }}</div>
  </span>
  <span v-else-if="name === 'price'">
    <div>{{ $centsToDollars(item.price) }}</div>
  </span>
  <span v-else-if="name === 'active'">
    <div>{{ $capitalizeFirstLetter(item.active) }}</div>
  </span>
  <span v-else-if="['to', 'cc', 'bcc'].includes(name)">
    <div>{{ item.recipients[name].join(', ') }}</div>
  </span>
  <span v-else-if="name === 'message'">
    <div>{{ truncateString(item.message) }}</div>
  </span>
  <span v-else-if="name === 'detail'">
    <a v-if="item.type === 'email'" class="data-table-link no-select" :href="`mailto:${item.detail}`">
      {{ truncateString(item.detail, 30) }}
    </a>
    <span v-else>{{ truncateString(item.detail, 30) }}</span>
  </span>
  <span v-else-if="name === 'parents'">
    <div>{{ formatOrganizationParents(item.parents) }}</div>
  </span>
  <span v-else-if="name === 'rank'">
    <div>{{ formatOrganizationRank(item.rank) }}</div>
  </span>
  <span v-else-if="name === 'isLoginActive'">
    <IFXLoginIcon :isActive="item.isActive" :disabled="true" :iconOnly="true" />
  </span>
  <span v-else>
    <span>{{ item[name] }}</span>
  </span>
</template>

<style scoped>
.data-table-id {
  margin-right: 1rem;
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  text-decoration: none;
}

.data-table-id:hover {
  text-decoration: underline;
}

.data-table-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.data-table-link:hover {
  text-decoration: underline;
}
</style>