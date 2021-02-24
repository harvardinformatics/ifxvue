<script>
/* eslint-disable vue/valid-v-slot */

export default {
  name: 'IFXItemDataTable',
  props: {
    selected: {
      type: Array,
      required: true
    },
    // search: {
    //   type: String,
    //   required: false
    // },
    itemType: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    showSelect: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    clickRow(item) {
      if (this.$listeners['click-row']) {
        this.$emit('click-row', item)
      }
      return null
    }
  },
  computed: {
    hasRowClickEvent() {
      return this.$listeners['click-row']
    },
    rowClass() {
      return {
        'row-pointer': !!this.hasRowClickEvent
      }
    },
    selectedLocal: {
      get() {
        return this.selected
      },
      set(selected) {
        return this.$emit('update:selected', selected)
      }
    },
    options: {
      get() {
        return {
          itemsPerPage: this.$api.storage.getItem(this.itemsPerPageStorageKey, 'local') || this.defaultItemsPerPage
        }
      },
      set(options) {
        this.$api.storage.setItem(this.itemsPerPageStorageKey, options.itemsPerPage, 'local')
      }
    },
    footerProps() {
      return {
        'items-per-page-options': this.defaultItemsPerPageOptions
      }
    },
    itemsPerPageStorageKey() {
      return `${this.itemType}TableItemsPerPage`
    }
  }
}
</script>

<template>
  <v-data-table
    :headers="headers"
    v-model='selectedLocal'
    :items="items"
    sort-by='date_modified'
    :sort-desc="true"
    :options.sync='options'
    :footer-props="footerProps"
    :hide-default-footer="false"
    :class='rowClass'
    @click:row="clickRow"
    :show-select='showSelect'
  >
    <template v-for="header in headers" #[`item.${header.value}`]="{item}">
      <span v-if="header.namedSlot" v-bind:key="header.value">
        <slot :name="header.value" :item="item"></slot>
      </span>
      <IFXDataTableCell v-else :header='header' :item='item' :type='itemType' :key='header.value'>
      </IFXDataTableCell>
    </template>
  </v-data-table>
</template>

<style scoped>
  .row-pointer >>> tbody tr :hover {
    cursor: pointer;
  }
</style>
