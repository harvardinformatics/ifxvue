<!-- IFXDateInput.vue 
  Wraps `v-date-input` and returns a formatted string rather than a `Date` object
  Since a lot of our code requires submitting a string (say YYYY-MM-DD), as
  well as displaying that, this is easier than adding a computed to everything.
-->
<script>
// IFXDateInput.vue
// NOTE: Requires <v-date-input>, which is still a Vuetify *labs* component.
// Each consuming app must register it in plugins/vuetify.js:
//   import { VDateInput } from 'vuetify/labs/VDateInput'
//   createVuetify({ components: { VDateInput } })
import moment from 'moment'

export default {
  name: 'IFXDateInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Date], default: null },
    // moment format of the value held by v-model
    valueFormat: { type: String, default: 'YYYY-MM-DD' },
  },
  emits: ['update:modelValue'],
  computed: {
    dateValue: {
      get() {
        if (!this.modelValue) return null
        if (this.modelValue instanceof Date) return this.modelValue
        const m = moment(this.modelValue, this.valueFormat)
        return m.isValid() ? m.toDate() : null
      },
      set(value) {
        this.$emit('update:modelValue', value ? moment(value).format(this.valueFormat) : null)
      },
    },
  },
}
</script>
<template>
  <v-date-input v-model="dateValue" v-bind="$attrs" />
</template>
