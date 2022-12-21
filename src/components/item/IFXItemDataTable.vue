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
  },
}
</script>

<template>
  <!-- NOTE: default search is not used. Items should be filtered by search and any other params before they are passed in -->
  <v-data-table
    :headers="headers"
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
  >
    <!-- Loops through all headers and either uses a specified named slot or the data table cell component -->
    <template v-for="header in headers" #[`item.${header.value}`]="{ item }">
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
