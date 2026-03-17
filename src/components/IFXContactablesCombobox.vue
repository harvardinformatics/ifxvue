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
      return-object
      :loading="loading"
    >
      <!-- Display the icons in different colors, based on their contactable type -->
      <template v-slot:item="{ props, item }">
        <v-icon v-if="item.icon" :color="item.color">{{item.icon}}</v-icon>
        <v-list-item v-bind="props">
          <template v-slot:prepend>
            <v-icon v-if="item.icon" :color="item.color">{{ item.icon }}</v-icon>
          </template>
        </v-list-item>
      </template>
      <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" closable>
          <template v-slot:prepend>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </template>
          {{ item.label }}
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
      return item.hasOwnProperty('text') ? item.text : item
    },
    getItemValue(item) {
      return item
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