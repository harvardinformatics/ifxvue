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
      default: false,
    },
  },
  data: () => ({
    currentPage: 1,
  }),
  mounted() {
    if (this.trackPageNum && this.rt?.query?.page) {
      const num = parseInt(this.rt.query.page, 10)
      this.currentPage = Number.isNaN(num) ? 1 : num
    }
  },
  methods: {
    // Method for handling click events on rows
    // Only active if user has specified a click-row event
    clickRow(item) {
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
    // Method for handling page changes
    pageChange(item) {
      this.$emit('update:page', item)
      if (this.trackPageNum) {
        this.currentPage = item
      }
      return null
    },
  },
  computed: {
    // Checks if user has specified a click event for the row
    hasRowClickEvent() {
      return !!this.$listeners['click-row']
    },
    // If the row has a click event, make the cursor into a pointer on hover
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
    options: {
      get() {
        return {
          // Gets items per page from storage or sets default items per page
          itemsPerPage: this.$api.storage.getItem(this.itemsPerPageStorageKey, 'local') || this.defaultItemsPerPage,
        }
      },
      set(options) {
        this.$api.storage.setItem(this.itemsPerPageStorageKey, options.itemsPerPage, 'local')
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
      return this.headers.filter((h) => (h.permission !== undefined ? h.permission : true))
    },
  },
}
</script>

<template>
  <!-- NOTE: default search is not used. Items should be filtered by search and any other params before they are passed in -->
  <v-data-table
    :headers="permissionCheckedHeaders"
    v-model="selectedLocal"
    :items="items"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
    :multi-sort="multiSort"
    :options.sync="options"
    :footer-props="footerProps"
    :class="rowClass"
    @click:row="clickRow"
    :show-select="showSelect"
    :item-key="itemKey"
    :hide-default-footer="hideDefaultFooter"
    :loading="loading"
    @update:page="pageChange"
    :page="currentPage"
  >
    <!-- Loops through all headers and either uses a specified named slot or the data table cell component -->
    <template #header.data-table-select="{ props, on }">
      <v-simple-checkbox
        role="checkbox"
        :aria-checked="checkboxState(props.value, props.indeterminate)"
        :aria-label="`${props.value ? 'Deselect' : 'Select'} all rows`"
        :value="props.value"
        :indeterminate="props.indeterminate"
        v-on="on"
      ></v-simple-checkbox>
    </template>

    <template #header.rowActionEdit="{ header }">
      <span class="d-sr-only" v-bind:key="header.value">Buttons to go to the Edit page for the item in each row</span>
    </template>

    <template #header.rowActionCopy="{ header }">
      <span class="d-sr-only" v-bind:key="header.value">Buttons to Copy an item in each row</span>
    </template>

    <template #header.rowActionDetailEdit="{ header }">
      <span class="d-sr-only" v-bind:key="header.value">
        Buttons to go to the editable Detail page for the item in each row
      </span>
    </template>

    <template #no-data>
      <span class="grey--text text--darken-1">No data available</span>
    </template>

    <template #loading>
      <span class="grey--text text--darken-1">Loading items...</span>
    </template>

    <template v-for="header in permissionCheckedHeaders" #[`item.${header.value}`]="{ item }">
      <span v-if="header.namedSlot" v-bind:key="header.value">
        <slot :name="header.value" :item="item"></slot>
      </span>
      <IFXDataTableCell
        v-else
        :header="header"
        :item="item"
        :type="itemType"
        :key="header.value"
        :custom="header.custom"
        :page="currentPage"
      ></IFXDataTableCell>
    </template>
  </v-data-table>
</template>

<style scoped>
/* Deep selector for Vue/Vuetify to make row update on hover */
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
