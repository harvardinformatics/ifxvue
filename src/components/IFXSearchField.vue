<template>
  <v-text-field
    v-model="searchLocal"
    class="search-field"
    :label="label"
    :aria-label="ariaLabel"
    variant="underlined"
    density="compact"
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
    // Vue 3 standard
    modelValue: {
      type: String,
      required: false,
      default: '',
    },
    // Vue 2 backward compatibility
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
        // Prefer modelValue (Vue 3), fallback to search (Vue 2)
        return this.modelValue || this.search
      },
      set(value) {
        // Emit both events for compatibility
        this.$emit('update:modelValue', value)
        this.$emit('update:search', value)
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