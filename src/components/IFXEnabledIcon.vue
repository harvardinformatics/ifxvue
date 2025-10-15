<template>
  <div class="action-item">
    <span v-if="!disabled && $api.user.canEditField('User.isEnabled')"
          style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;"
          @click="toggleEnabled">
      <v-icon :color='color'>{{displayIcon}}</v-icon>
      <span>{{label}}</span>
    </span>
    <span v-else style="display: inline-flex; align-items: center; gap: 4px;">
      <v-icon :color="color" size="small">{{displayIcon}}</v-icon>
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
      color: 'green-darken-3',
      offIcon: 'mdi-close',
      onIcon: 'mdi-emoticon'
    }
  },
  computed: {
    displayIcon() {
      return this.isEnabledLocal ? this.onIcon : this.offIcon
    },
    label() {
      if (this.iconOnly) {
        return ''
      }
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
  },
  methods: {
    toggleEnabled() {
      this.isEnabledLocal = !this.isEnabledLocal
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