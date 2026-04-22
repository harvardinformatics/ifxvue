<script>
export default {
  name: 'IFXButton',
  props: {
    btnType: {
      type: String,
      required: true,
    },
    btnColor: {
      type: String,
      required: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
      required: false,
    },
    large: {
      type: Boolean,
      default: false,
      required: false,
    },
    iconColor: {
      type: String,
      default: 'white',
      required: false,
    },
    iconString: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    btnText: {
      type: String,
      required: false,
    },
    inDialog: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    btnColorComputed() {
      if (this.btnColor) {
        return this.btnColor
      }
      let btnColor = ''
      switch (this.btnType) {
        case 'edit':
          btnColor = 'primary'
          break
        case 'add':
          btnColor = 'primary'
          break
        case 'multipleAdd':
          btnColor = 'primary'
          break
        case 'download':
          btnColor = 'primary'
          break
        case 'remove':
          btnColor = 'red'
          break
        case 'reset':
          btnColor = 'yellow'
          break
        case 'submit':
          btnColor = 'primary'
          break
        case 'close':
          btnColor = 'secondary'
          break
        case 'cancel':
          btnColor = 'secondary'
          break
        case 'home':
          btnColor = 'primary'
          break
        case 'copy':
          btnColor = 'primary'
          break
        case 'other':
          btnColor = 'secondary'
          break
        default:
          btnColor = 'secondary'
          break
      }
      return btnColor
    },
    sizeComputed() {
      if (this.xSmall) return 'x-small'
      if (this.small) return 'small'
      if (this.large) return 'large'
      // Default size for icon-only buttons (FAB-like)
      if (!this.btnTextComputed) return 'small'
      return 'default'
    },
    iconStringComputed() {
      if (this.iconString) {
        return this.iconString
      }
      let iconString = ''
      switch (this.btnType) {
        case 'edit':
          iconString = 'mdi-pencil'
          break
        case 'remove':
          iconString = 'mdi-delete'
          break
        case 'add':
          iconString = 'mdi-plus'
          break
        case 'multipleAdd':
          iconString = 'mdi-plus-box-multiple'
          break
        case 'submit':
          iconString = ''
          break
        case 'download':
          iconString = 'mdi-cloud-download'
          break
        case 'copy':
          iconString = 'mdi-content-duplicate'
          break
        case 'home':
          iconString = 'mdi-home'
          break
        case 'close':
          iconString = 'mdi-close'
          break
        case 'cancel':
          iconString = 'mdi-cancel'
          break
        case 'reset':
          iconString = 'mdi-refresh'
          break
        default:
          iconString = ''
          break
      }
      return iconString
    },
    btnTextComputed() {
      if (this.btnText) {
        return this.btnText
      }
      let btnText = ''
      if (this.btnType === 'submit') {
        btnText = 'Save'
      } else if (this.btnType === 'close') {
        btnText = 'Close'
      } else if (this.btnType === 'cancel') {
        btnText = 'Cancel'
      }
      return btnText
    },
    isFab() {
      // FAB = icon-only button (circular and elevated)
      return !this.btnTextComputed
    },
    variantComputed() {
      if (this.inDialog) return 'text'
      // FAB buttons and regular buttons should be elevated
      return 'elevated'
    },
    dataCyString() {
      return `${this.btnType}-btn`
    },
  },
  methods: {
    clickHandler() {
      this.$emit('action')
    },
  },
}
</script>

<template>
  <v-btn
    :icon="isFab"
    :disabled="disabled"
    :size="sizeComputed"
    :color="btnColorComputed"
    @click.prevent="clickHandler"
    :data-cy="dataCyString"
    :variant="variantComputed"
    :aria-label="btnTextComputed ? btnTextComputed : btnType"
  >
    <v-icon v-if="iconStringComputed" :color="iconColor" :class="{ 'mr-2': btnTextComputed }">
      {{ iconStringComputed }}
    </v-icon>
    <span v-if="btnTextComputed">{{ btnTextComputed }}</span>
  </v-btn>
</template>