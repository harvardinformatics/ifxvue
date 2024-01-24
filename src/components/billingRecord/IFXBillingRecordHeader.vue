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
    getSummaryDetails: {
      type: Function,
      required: true,
    },
  },
  mounted() {
    this.localRowSelectionToggle = this.rowSelectionToggle.concat()
  },
  data() {
    return {
      localRowSelectionToggle: [],
      showSummaryDetail: false,
      summaryButtonText: 'Show',
      summaryDetails: [],
    }
  },
  computed: {},
  methods: {
    syncData() {
      this.$emit('update:row-selection-toggle', this.localRowSelectionToggle)
      this.$emit('update:row-selection-toggle-indeterminate', this.rowSelectionToggleIndeterminateGroup)
      this.toggleGroup(this.group)
    },
    toggleSummaryDetail() {
      this.summaryButtonText = this.showSummaryDetail ? 'Show' : 'Hide'
      if (!this.showSummaryDetail && this.summaryDetails.length === 0) {
        this.summaryDetails = Array.from(this.getSummaryDetails(this.group).entries())
      }
      this.showSummaryDetail = !this.showSummaryDetail
    },
  },
  watch: {},
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
        <span class="ml-3 font-weight-medium">Total charges: {{ summaryCharges | centsToDollars }}</span>
        <v-btn small text @click="toggleSummaryDetail" class="ml-2">{{ summaryButtonText }} Acct Summary</v-btn>
      </div>
    </v-row>
    <v-row v-if="showSummaryDetail">
      <v-col class="py-1 ml-9">
        <v-row v-for="entry in summaryDetails" :key="`${group}-${entry[0]}`" class="text-body-2">
          <v-col cols="5" class="ml-3">{{ entry[0] }}</v-col>
          <v-col class="text-xs-left ml-3 font-weight-medium">{{ entry[1] | centsToDollars }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </td>
</template>
<style scoped lang="scss">
.active {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
