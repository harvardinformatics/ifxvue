<template>
  <div class="action-item">
    <span v-if="!disabled && $api.user.canEditField('User.isActive')">
      <v-checkbox
        v-model="isActiveLocal"
        :label="`${$api.vars.appNameFormatted} Login`"
        color="green"
        on-icon="vpn_key"
        off-icon="close"
      ></v-checkbox>
    </span>
    <span v-else>
      <v-icon v-if="item.isActive" color="green">vpn_key</v-icon>
      <v-icon v-else color="green">close</v-icon>
      <span v-if='!iconOnly' class="v-label theme--light spaced-span">{{`${this.$api.vars.appNameFormatted} Login`}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'IFXLoginIcon',
  props: {
    value: {
      type: Boolean,
      required: false
    },
    item: {
      type: Object,
      required: true
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    disabled() {
      return !this.value
    },
    isActiveLocal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
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
  .spaced-span {
    margin: 0.5em;
  }
</style>
