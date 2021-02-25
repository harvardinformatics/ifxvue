<template>
  <div class="action-item">
    <span v-if="!disabled && $api.user.canEditField('User.isEnabled')">
      <v-checkbox
        v-model="isEnabledLocal"
        :label="label"
        :color="color"
        :on-icon="onIcon"
        :off-icon="offIcon"
      ></v-checkbox>
    </span>
    <span v-else>
      <v-icon :color="color">{{displayIcon}}</v-icon>
      <span v-if='!iconOnly'>{{label}}</span>
    </span>
  </div>
</template>

<script>
// Icon for displaying the enabled state of a user
// TODO: can be merged with IFXLoginIcon
export default {
  name: 'IFXEnabledIcon',
  props: {
    isEnabled: {
      type: Boolean,
      required: true
    },
    // Removes text label, for use in data table cells and other small-footprint spaces
    iconOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      color: 'green darken-3',
      offIcon: 'close',
      onIcon: 'mood'
    }
  },
  computed: {
    displayIcon() {
      return this.isEnabledLocal ? this.onIcon : this.offIcon
    },
    label() {
      return 'FAS User'
    },
    isEnabledLocal: {
      get() {
        return this.isEnabled
      },
      set(bool) {
        this.$emit('update:isEnabled', bool)
      }
    }
  }
}
</script>

<style scoped>
  .action-item {
    display: inline-block !important;
    margin-right: 2rem;
  }
</style>
