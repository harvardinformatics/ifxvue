<script>
export default {
  name: 'IFXBillingRecordHeaderDecimal',
  props: {
    group: {
      type: String,
      required: true,
    },
    colSpan: {
      type: Number,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    showCheckboxes: {
      type: Boolean,
      required: true,
    },
    toggle: {
      type: Function,
      required: true,
    },
    toggleGroup: {
      type: Function,
      required: true,
    },
    rowSelectionToggle: {
      type: Array,
      required: false,
    },
    rowSelectionToggleIndeterminateGroup: {
      type: Boolean,
      required: false,
    },
    summaryCharges: {
      type: Number,
      required: true,
    },
  },
  mounted() {},
  data() {
    return {
      localRowSelectionToggle: [],
    }
  },
  computed: {},
  methods: {
    syncData() {
      this.$emit('update:row-selection-toggle', this.localRowSelectionToggle)
      this.$emit('update:row-selection-toggle-indeterminate', this.rowSelectionToggleIndeterminateGroup)
      this.toggleGroup(this.group)
    },
  },
  watch: {
    rowSelectionToggle: {
      handler(value) {
        this.localRowSelectionToggle = value.concat()
      },
      immediate: true,
    },
  },
}
</script>
<template>
  <td :colspan="colSpan" class="py-4">
    <v-row>
      <v-checkbox
        v-if="showCheckboxes"
        v-model="localRowSelectionToggle"
        :value="group"
        hide-details
        multiple
        :indeterminate.sync="rowSelectionToggleIndeterminateGroup"
        class="shrink ml-3 mt-0"
        @change="syncData()"
      ></v-checkbox>
      <div>
        <v-btn icon small @click="toggle">
          <v-icon :class="{ active: isOpen }">mdi-menu-right</v-icon>
        </v-btn>
        <span class="group-header">
          {{ $api.organization.parseSlug(group).name }}
        </span>
        <span class="ml-3 font-weight-medium">Total charges: {{ $dollars(summaryCharges) }}</span>
      </div>
    </v-row>
  </td>
</template>
<style scoped lang="scss">
.active {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
