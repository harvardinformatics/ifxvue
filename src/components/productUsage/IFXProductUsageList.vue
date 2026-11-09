<script>
import has from 'lodash/has'
import IFXSearchField from '@/components/IFXSearchField'
import IFXActionSelect from '@/components/action/IFXActionSelect'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'

export default {
  name: 'IFXProductUsageList',
  mixins: [IFXProductUsageMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXActionSelect,
    IFXItemDataTable,
  },
  props: {
    productCategory: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      page: 1,
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true, width: '60px' },
        { text: 'Product', value: 'product', sortable: true },
        { text: 'Quantity', value: 'decimalQuantity', sortable: true, namedSlot: true },
        { text: 'Description', value: 'description', sortable: true, width: '150px' },
        { text: 'Organization', value: 'organization', sortable: true, slot: true, namedSlot: true },
        { text: 'Product User', value: 'productUser', sortable: true, slot: true, namedSlot: true },
        { text: 'Logged By', value: 'loggedBy', sortable: true, slot: true, namedSlot: true },
        { text: 'Start Date', value: 'startDate', sortable: true, namedSlot: true },
        { text: 'End Date', value: 'endDate', sortable: false, namedSlot: true },
        { text: '', value: 'rowAction', slot: true, sortable: false, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
  },
  methods: {
    getSetItems() {
      // Override this to pass in the productCategory
      const params = this.productCategory ? { product_category: this.productCategory } : {}
      return (
        this.apiRef
          .getList(params)
          .then((items) => {
            if (has(items, 'data')) {
              console.error('getList should return a list of formatted objects')
            }
            this.items = items
          })
          // TODO: work on handling this error
          .catch((error) => {
            this.showMessage(error)
            this.rtr.replace({ name: 'Home' })
          })
      )
    },
    displayQuantityWithUnits(item) {
      const quantity = Number.parseFloat(item.decimalQuantity).toFixed(2)
      return this.pluralize(quantity, item.units)
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 || string === 'ea' ? '' : 's'}`
    },
    getFullName(user) {
      return user.fullName ? user.fullName : `${user.firstName} ${user.lastName}`
    },
    goToUserDetailPage(user) {
      this.$router.push({ name: 'UserDetail', params: { id: user.id } })
    },
    async handleDelete(item) {
      try {
        await this.apiRef.delete(item)
        this.showMessage(`${item.product} Product Usage deleted successfully`)
        this.getSetItems()
      } catch (error) {
        this.showMessage(error)
      }
    },
    // Method for handling page changes
    pageChange(item) {
      this.page = item
      return null
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>{{ listTitle }} {{ productCategory ? `for ${productCategory}` : '' }}</template>
      <template #actions>
        <IFXSearchField v-model:search="search" />
        <IFXActionSelect
          :actionKeys="['deleteItems']"
          :apiRef="apiRef"
          @get-set-items="getSetItems"
          v-model:selectedItems="selected"
        />
        <IFXButton btnType="add" small @action="navigateToItemCreate" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items="filteredItems"
      :headers="headers"
      v-model:selected="selected"
      :show-select="true"
      :itemType="itemType"
      @update:page="pageChange"
      :page="page"
      :loading="isLoading"
    >
      <template #decimalQuantity="{ item }">
        {{ displayQuantityWithUnits(item) }}
      </template>
      <template #organization="{ item }">
        {{ $orgNameFromSlug(item.organization) }}
      </template>
      <template #productUser="{ item }">
        <router-link :to="{ name: 'UserDetail', params: { id: item.productUser.id } }">
          {{ getFullName(item.productUser) }}
        </router-link>
      </template>
      <template #loggedBy="{ item }">
        <router-link :to="{ name: 'UserDetail', params: { id: item.loggedBy.id } }">
          {{ getFullName(item.loggedBy) }}
        </router-link>
      </template>
      <template #startDate="{ item }">
        {{ $humanDatetime(item.startDate) }}
      </template>
      <template #endDate="{ item }">
        {{ $humanDatetime(item.endDate) }}
      </template>
      <template #rowAction="{ item }">
        <span class="my-2 d-flex flex-row">
          <IFXTooltip
            top
            icon="mdi-trash-can-outline"
            x-small
            color="error"
            data-cy="delete-usage"
            @action="handleDelete(item)"
            tooltip="Delete this Product Usage"
            :disabled="bulkDeleteDisabled"
          ></IFXTooltip>
          <IFXButton class="ml-2" btnType="edit" xSmall @action="navigateToEdit(itemType, item.id, page)" />
        </span>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>
<style lang="scss" scoped>
.hand-pointer {
  cursor: pointer;
}
</style>
