<template>
  <v-text-field
    v-model="searchLocal"
    class="search-field"
    :label="label"
    :aria-label="ariaLabel"
    single-line
    hide-details
    :clearable="clearable"
    :disabled="disabled"
    data-cy="ifx-search-field"
  ></v-text-field>
</template>

<script>
// Mostly used as search field in IFXPage header for list components
export default {
  name: 'IFXSearchField',
  props: {
    search: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: 'Search',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    searchLocal: {
      get() {
        return this.search
      },
      set(search) {
        this.$emit('update:search', search)
      },
    },
    ariaLabel() {
      return this.label ? this.label : 'Filter List'
    },
  },
}
</script>

<style scoped>
.search-field {
  width: 350px;
  display: inline-block !important;
}
</style>
