<script>
/* eslint-disable vue/no-mutating-props */
// const STEP_DISPLAY_NAMES = {
//   'welcome': 'Welcome',
//   'existing_email_checked': 'Existing email checked',
//   'existing_full_name_checked': 'Existing full name checked'
// }
export default {
  name: 'IFXDisplayOnboardStep',
  props: {
    step: Object,
    stepName: String,
    trackName: String
  },
  methods: {
    getStepDisplayName() {
      return this.stepName.charAt(0).toUpperCase() + this.stepName.slice(1).replace(/_/g, ' ')
    },
    emitUpdate() {
      this.$emit('update', {
        step: this.stepName,
        value: this.step.value,
        track: this.trackName
      })
    }
  }
}
</script>
<template>
  <v-row class="justify-space-between align-start" density="compact">
    <v-col class="name-display py-2">
      {{getStepDisplayName()}}
    </v-col>
    <!-- <v-col class="flex-grow-1">
      &nbsp;
    </v-col> -->
    <!-- <v-spacer></v-spacer> -->
    <v-col class="flex-shrink-1 py-0 small-checkbox">
      <v-checkbox
        indeterminate-icon="mdi-cached"
        true-icon="mdi-check"
        false-icon="mdi-close"
        v-model="step.value"
        true-value="complete"
        false-value="incomplete"
        @click.native="emitUpdate()"
        class="mt-0 mb-0"
        color="primary"
      >
      </v-checkbox>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.small-checkbox {
  .v-selection-control {
    margin: 0;
    padding: 0;
  }
  /* .v-input--selection-controls {
    margin: 0;
  } */
  .v-input--checkbox {
    height: 5px;
  }
  .v-input__control {
    height: 5px;
  }
  .v-messages {
    display: none;
  }
}
  .application {
    line-height: 1;
  }
  .name-display {
    flex-grow: 2!important;
  }
</style>
