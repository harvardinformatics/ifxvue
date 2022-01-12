<template>
<div class="dropdown">
  <v-combobox
    :ref='ref'
    v-model="selected"
    :items="contactables"
    :search-input.sync="search"
    @change="handleChange"
    :label="label | capitalizeFirstLetter"
    chips
    clearable
    multiple
    hide-selected
    :item-text='getItemText'
    :item-value='getItemValue'
    item-disabled='false'
    :rules="rules"
    :menu-props="{closeOnContentClick:true}"
    :required='required'
    :error-messages='errorMessage'
    no-data-text="No new results match that query."
    :class="{'required': required}"
  >
  <!-- Display the icons in different colors, based on their contactable type -->
    <template #item="{item}">
      <v-icon :color="item.color">{{item.icon}}</v-icon>
      <v-list-item v-text='item.text'></v-list-item>
    </template>
    <template #selection="{item}">
      <v-chip color="transparent" close @click:close="removeFromSelected(item)">
        <v-icon :color="item.color" class="mr-2">{{item.icon}}</v-icon>{{item.label}}
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
    value: {
      type: Array,
      required: true,
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
      return item.text
    },
    getItemValue(item) {
      return item
    },
    removeFromSelected(item) {
      this.selected.splice(this.selected.findIndex((i) => i.id === item.id), 1)
    },
    handleChange() {
      this.$emit('input', this.selected)
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
    if (this.value) {
      this.selected = this.value.slice()
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
