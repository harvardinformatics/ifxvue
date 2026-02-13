<script>
export default {
  name: 'IFXMonthYearPicker',
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'Select month and year',
    },
    hint: {
      type: String,
      default: 'YYYY-MM format',
    },
    persistentHint: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      menu: false,
      viewMode: 'months',
      selectedYear: new Date().getFullYear(),
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val) {
          this.selectedYear = parseInt(val.split('-')[0])
        }
      },
      immediate: true,
    },
  },
  methods: {
    updateViewMode(viewMode) {
      this.viewMode = viewMode === 'year' ? 'year' : 'months'
    },
    updateYear(year) {
      this.selectedYear = year
    },
    updateMonth(month) {
      // month is 0-indexed from the picker
      const monthNum = month + 1
      const value = `${this.selectedYear}-${String(monthNum).padStart(2, '0')}`
      this.$emit('update:modelValue', value)
      this.menu = false
    },
  },
}
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom start"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="modelValue"
        :label="required ? `${label} *` : label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
        :hint="hint"
        :persistent-hint="persistentHint"
      ></v-text-field>
    </template>
    <v-date-picker
      :view-mode="viewMode"
      @update:view-mode="updateViewMode"
      @update:year="updateYear"
      @update:month="updateMonth"
    ></v-date-picker>
  </v-menu>
</template>