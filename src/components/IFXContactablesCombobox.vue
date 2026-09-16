<template>
  <div class="dropdown">
    <v-combobox
      :ref='ref'
      v-model="selected"
      :items="contactables"
      v-model:search="search"
      @update:model-value="handleChange"
      :label="$capitalizeFirstLetter(label)"
      chips
      clearable
      multiple
      hide-selected
      :item-title="getItemText"
      :item-value="getItemValue"
      :rules="rules"
      :menu-props="{closeOnContentClick:true}"
      :required='required'
      :error-messages='errorMessage'
      no-data-text="No new results match that query."
      :class="{'required': required}"
      :loading="loading"
    >
      <!-- Display the icons in different colors, based on their contactable type -->
      <template v-slot:item="{ props, item }">
        <v-icon v-if="item.raw.icon" :color="item.raw.color">{{item.raw.icon}}</v-icon>
        <v-list-item v-bind="props" v-if="item.raw.text" v-text="item.raw.text"></v-list-item>
        <v-list-item v-bind="props" v-else v-text="item.raw"></v-list-item>
      </template>
      <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" closable @click:close="removeFromSelected(item.raw)">
          <v-icon v-if="item.raw.icon" :color="item.raw.color" class="mr-2">{{item.raw.icon}}</v-icon>
          <span>{{ item.raw.text || item.raw.label || item.raw.name || item.raw }}</span>
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script>
// Primarily used in mailingCompose component for searching through multiple types of objects
// (i.e. contactables: organization, user, contact)
import { mapActions } from 'vuex'

export default {
  name: 'IFXContactablesCombobox',
  props: {
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    isSearchDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    fieldError: {
      type: String,
      required: false,
      default: null
    },
    contactables: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      search: null,
      items: [],
      errorMessage: '',
      selected: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    getItemText(item) {
      if (item.text) return item.text
      if (item.label) return item.label
      if (item.name) return item.name
      if (typeof item === 'string') return item
      return String(item)
    },
    getItemValue(item) {
      return item
    },
    removeFromSelected(item) {
      const index = this.selected.findIndex((i) => i.id === item.id)
      if (index !== -1) {
        this.selected.splice(index, 1)
      }
    },
    handleChange() {
      this.$emit('update:modelValue', this.selected)
      this.search = null
    },
  },
  computed: {
    ref() {
      return `mailingField${this.label}`
    },
    rules() {
      return this.required ? this.formRules.generic : []
    },
  },
  watch: {
    fieldError: {
      handler(n) {
        if (n) {
          this.errorMessage = n
        }
      }
    }
  },
  created() {
    this.isLoading = true
  },
  mounted() {
    if (this.modelValue) {
      this.selected = this.modelValue.slice()
    }
  }
}
</script>
<style lang="scss" scoped>
.dropdown {
  max-height: 10rem;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>