<script>
/* eslint-disable vue/valid-v-slot */

export default {
  name: 'IFXItemDataTable',
  props: {
    selected: {
      type: Array,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    showSelect: {
      type: Boolean,
      required: false,
      default: true,
    },
    itemKey: {
      type: String,
      required: false,
      default: 'id',
    },
    hideDefaultFooter: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    sortBy: {
      type: [String, Array],
      required: false,
      default: 'date_modified',
    },
    sortDesc: {
      type: [Boolean, Array],
      required: false,
      default: true,
    },
    multiSort: {
      type: Boolean,
      required: false,
      default: false,
    },
    trackPageNum: {
      type: Boolean,
      required: false,
      default: true,
    },
    defaultItemsPerPage: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  data: () => ({
    currentPage: 1,
    itemsPerPage: null,
  }),
  watch: {
    itemsPerPage(val) {
      if (val) {
        this.$api.storage.setItem(this.itemsPerPageStorageKey, val, 'local')
      }
    },
  },
  mounted() {
    // Initialize itemsPerPage from storage
    const stored = this.$api.storage.getItem(this.itemsPerPageStorageKey, 'local')
    this.itemsPerPage = stored ? parseInt(stored, 10) : this.defaultItemsPerPage

    if (this.trackPageNum && this.$route?.query?.page) {
      const num = parseInt(this.$route.query.page, 10)
      this.currentPage = Number.isNaN(num) ? 1 : num
    }
  },
  methods: {
    clickRow(event, { item }) {
      if (this.hasRowClickEvent) {
        this.$emit('click-row', item)
      }
      return null
    },
    checkboxState(value, indeterminate) {
      if (indeterminate) {
        return 'mixed'
      }
      return value.toString()
    },
    pageChange(item) {
      this.$emit('update:page', item)
      if (this.trackPageNum) {
        this.currentPage = item
      }
      return null
    },
  },
  computed: {
    hasRowClickEvent() {
      return !!this.$attrs['onClickRow']
    },
    rowClass() {
      return {
        'row-pointer': this.hasRowClickEvent,
      }
    },
    selectedLocal: {
      get() {
        return this.selected
      },
      set(selected) {
        return this.$emit('update:selected', selected)
      },
    },
    footerProps() {
      return {
        'items-per-page-options': this.defaultItemsPerPageOptions,
      }
    },
    itemsPerPageStorageKey() {
      return `${this.itemType}TableItemsPerPage`
    },
    permissionCheckedHeaders() {
      return this.headers
        .filter((h) => (h.permission !== undefined ? h.permission : true))
        .map((header) => ({
          ...header,
          title: header.title ?? header.text,
          key: header.key ?? header.value,
        }))
    },
    sortByOptions() {
      if (Array.isArray(this.sortBy)) {
        return this.sortBy.map((key, index) => ({
          key,
          order: Array.isArray(this.sortDesc)
            ? this.sortDesc[index]
              ? 'desc'
              : 'asc'
            : this.sortDesc
            ? 'desc'
            : 'asc',
        }))
      }
      return [{ key: this.sortBy, order: this.sortDesc ? 'desc' : 'asc' }]
    },
  },
}
</script>

<template>
  <v-data-table
    :headers="permissionCheckedHeaders"
    v-model="selectedLocal"
    :items="items"
    :sort-by="sortByOptions"
    :multi-sort="multiSort"
    v-model:items-per-page="itemsPerPage"
    :class="rowClass"
    @click:row="clickRow"
    :show-select="showSelect"
    :item-value="itemKey"
    return-object
    :loading="loading"
    @update:page="pageChange"
    :page="currentPage"
  >
    <template #header.data-table-select="{ allSelected, selectAll, someSelected }">
      <v-checkbox-btn
        role="checkbox"
        :aria-checked="checkboxState(allSelected, someSelected)"
        :aria-label="`${allSelected ? 'Deselect' : 'Select'} all rows`"
        :model-value="allSelected"
        :indeterminate="someSelected && !allSelected"
        @update:model-value="selectAll(!allSelected)"
        :ripple="false"
      ></v-checkbox-btn>
    </template>

    <template #header.rowActionEdit="{ header }">
      <span class="d-sr-only" :key="header?.key || 'rowActionEdit'">
        Buttons to go to the Edit page for the item in each row
      </span>
    </template>

    <template #header.rowActionCopy="{ header }">
      <span class="d-sr-only" :key="header?.key || 'rowActionCopy'">Buttons to Copy an item in each row</span>
    </template>

    <template #header.rowActionDetailEdit="{ header }">
      <span class="d-sr-only" :key="header?.key || 'rowActionDetailEdit'">
        Buttons to go to the editable Detail page for the item in each row
      </span>
    </template>

    <template #no-data>
      <span class="text-grey-darken-1">No data available</span>
    </template>

    <template #loading>
      <span class="text-grey-darken-1">Loading items...</span>
    </template>

    <template v-for="header in permissionCheckedHeaders" #[`item.${header.key}`]="{ item }">
      <span v-if="header.namedSlot" v-bind:key="header.key">
        <slot :name="header.key" :item="item"></slot>
      </span>
      <IFXDataTableCell
        v-else
        :header="header"
        :item="item"
        :type="itemType"
        :key="header.key"
        :custom="header.custom"
        :page="currentPage"
      ></IFXDataTableCell>
    </template>
  </v-data-table>
</template>

<style scoped>
.row-pointer :deep(tbody tr:hover) {
  cursor: pointer;
}
</style>
