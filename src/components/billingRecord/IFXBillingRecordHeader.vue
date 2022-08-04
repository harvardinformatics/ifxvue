<script>
export default {
  name: 'IFXBillingRecordHeader',
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
  mounted() {
    this.localRowSelectionToggle = this.rowSelectionToggle.concat()
  },
  data() {
    return {
      localRowSelectionToggle: []
    }
  },
  computed: {},
  methods: {
    syncData(group) {
      this.$emit('update:row-selection-toggle', this.localRowSelectionToggle)
      this.$emit('update:row-selection-toggle-indeterminate', this.rowSelectionToggleIndeterminateGroup)
      this.toggleGroup(group)
    },
    // logIt(content) {
    //   console.log(content)
    // }
  },
  watch: {},
}
</script>
<template>
  <td :colspan="colSpan">
    <!-- {{ logIt('group header')}} -->
    <v-row>
      <v-checkbox
        v-if="showCheckboxes"
        v-model="localRowSelectionToggle"
        :value="group"
        hide-details
        multiple
        :indeterminate.sync="rowSelectionToggleIndeterminateGroup"
        class="shrink ml-3 mt-0"
        @change="syncData(group)"
      ></v-checkbox>
      <div>
        <v-btn icon small @click="toggle">
          <v-icon>{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
        </v-btn>
        <span class="group-header">
          {{ $api.organization.parseSlug(group).name }}
        </span>
        <span class="ml-3 font-weight-medium">Total charges: {{ summaryCharges | centsToDollars }}</span>
      </div>
    </v-row>
  </td>
</template>
<style scoped lang="scss"></style>
