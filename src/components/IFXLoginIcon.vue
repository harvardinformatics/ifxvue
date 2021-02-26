<template>
  <div class='action-item'>
    <span v-if="!disabled && $api.user.canEditField('User.isActive')">
      <v-checkbox
        v-model="isActiveLocal"
        :label="label"
        :color="color"
        :on-icon="onIcon"
        :off-icon="offIcon"
      ></v-checkbox>
    </span>
    <span v-else>
      <v-icon :color='color'>{{displayIcon}}</v-icon>
      <span>{{label}}</span>
    </span>
  </div>
</template>

<script>
// Icon for displaying the login state of a user
// TODO: can be merged with IFXEnabledIcon
export default {
  name: 'IFXLoginIcon',
  props: {
    isActive: {
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
      color: 'green',
      offIcon: 'close',
      onIcon: 'vpn_key'
    }
  },
  computed: {
    label() {
      if (this.iconOnly) {
        return ''
      }
      return `${this.$api.vars.appNameFormatted} Login`
    },
    displayIcon() {
      return this.isActiveLocal ? this.onIcon : this.offIcon
    },
    isActiveLocal: {
      get() {
        return this.isActive
      },
      set(bool) {
        this.$emit('update:isActive', bool)
      }
    }
  },
}
</script>

<style scoped>
  .action-item {
    display: inline-block !important;
    margin-right: 2rem;
  }
</style>
