<template>
  <div class='action-item'>
    <span v-if="!disabled && $api.user.canEditField('User.isActive')">
      <v-icon :color="color" class="mr-2">{{ displayIcon }}</v-icon>
      <v-checkbox
        v-model="isActiveLocal"
        :label="label"
        :color="color"
        hide-details
      ></v-checkbox>
    </span>
    <span v-else class="disabled-view">
      <v-icon :color="color">{{ displayIcon }}</v-icon>
      <span v-if="!iconOnly">{{ label }}</span>
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
      offIcon: 'mdi-close',
      onIcon: 'mdi-key'
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

.disabled-view {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.disabled-view .v-icon {
  vertical-align: middle;
  margin-top: -2px;
}
</style>