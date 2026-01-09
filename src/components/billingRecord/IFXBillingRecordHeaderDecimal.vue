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
      default: () => [],
    },
    rowSelectionToggleIndeterminateGroup: {
      type: Boolean,
      required: false,
      default: false,
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
      localIndeterminate: false,
    }
  },
  computed: {},
  methods: {
    syncData() {
      this.$emit('update:rowSelectionToggle', this.localRowSelectionToggle)
      this.$emit('update:rowSelectionToggleIndeterminateGroup', this.localIndeterminate)
      this.toggleGroup(this.group)
    },
    updateIndeterminate(value) {
      this.localIndeterminate = value
      this.$emit('update:rowSelectionToggleIndeterminateGroup', value)
    },
  },
  watch: {
    rowSelectionToggle: {
      handler(value) {
        this.localRowSelectionToggle = value ? value.concat() : []
      },
      immediate: true,
    },
    rowSelectionToggleIndeterminateGroup: {
      handler(value) {
        this.localIndeterminate = value
      },
      immediate: true,
    },
  },
}
</script>
<template>
  <tr>
    <td :colspan="colSpan" class="py-4">
      <v-row>
        <v-checkbox
          v-if="showCheckboxes"
          v-model="localRowSelectionToggle"
          :value="group"
          hide-details
          v-model:indeterminate="localIndeterminate"
          class="shrink ml-3 mt-0"
          @update:model-value="syncData()"
        ></v-checkbox>
        <div>
          <v-btn size="small" variant="text" @click="toggle">
            <v-icon :class="{ active: isOpen }">mdi-menu-right</v-icon>
          </v-btn>
          <span class="group-header">
            {{ $api.organization.parseSlug(group).name }}
          </span>
          <span class="ml-3 font-weight-medium">Total charges: {{ $dollars(summaryCharges) }}</span>
        </div>
      </v-row>
    </td>
  </tr>
</template>
<style scoped lang="scss">
.active {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>