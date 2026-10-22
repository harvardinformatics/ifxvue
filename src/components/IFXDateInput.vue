<!-- IFXDateInput.vue -->
<script>
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
