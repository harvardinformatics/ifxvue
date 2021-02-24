<template>
  <v-combobox
    v-if='!isLoading'
    :ref='ref'
    :loading="isSearching"
    v-model="selected"
    :items="items"
    :search-input.sync="search"
    @change="clearSearch"
    :label="label | capitalizeFirstLetter"
    chips
    clearable
    multiple
    :cache-items='true'
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
    <template #item="{item}">
      <v-icon :color="item.color">{{item.icon}}</v-icon>
      <v-list-item v-text='item.text'></v-list-item>
    </template>
    <template #selection="{item}">
      <v-chip v-if='isContactableObj(item)' :color='item.color' close @click:close ="removeRecipient(item)">{{item.slug}}</v-chip>
      <v-chip v-else close @click:close ="removeRecipient(item)">{{item}}</v-chip>
    </template>
  </v-combobox>
</template>
<script>
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'

export default {
  name: 'IFXCombobox',
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
    }
  },
  data() {
    return {
      isLoading: false,
      isSearching: false,
      search: null,
      items: [],
      errorMessage: '',
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
    querySelections: debounce(async function (val) {
      this.isSearching = true
      this.items = await this.$api.contactables.getList(val).then(res => res)
      this.isSearching = false
    }, 750),
    clearSearch() {
      this.search = null
      // this.$refs[this.ref].blur()
    },
    removeRecipient(item) {
      const payload = { key: this.label, value: item }
      this.$store.dispatch('mailing/deleteValue', payload)
    },
    isEmailValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    isContactableObj({ slug, color }) {
      return !!slug && !!color
    }
  },
  computed: {
    ref() {
      return `mailingField${this.label}`
    },
    rules() {
      return this.required ? this.formRules.generic : []
    },
    selected: {
      get() {
        // console.log(this.$store.getters[`mailing/${this.label}`])
        return this.$store.getters[`mailing/${this.label}`]
      },
      set(valuesArray) {
        const payload = { key: this.label, value: valuesArray }
        this.$store.dispatch('mailing/setValue', payload)
      }
    }
  },
  watch: {
    search(n, o) {
      if (this.isSearchDisabled) return
      if (n && this.areValuesDifferent(n, o)) {
        this.querySelections(n)
      }
    },
    fieldError: {
      handler(n) {
        if (n) {
          this.errorMessage = n
          console.log(n)
        }
      }
    }
  },
  created() {
    this.isLoading = true
  },
  mounted() {
    this.$nextTick(() => this.isLoading = false)
  }
}
</script>
