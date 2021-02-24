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
      <span v-if='!iconOnly'>{{label}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'IFXLoginIcon',
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
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
  }
}
</script>

<style scoped>
  .action-item {
    display: inline-block !important;
    margin-right: 2rem;
  }
</style>
