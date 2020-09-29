<script>
export default {
  name: 'IFXButton',
  props: {
    // The type of button, determines default icon and color
    // Options: add, edit, delete, close
    btnType: {
      type: String,
      required: true
    },
    // Color of the button, overrides default color determined by btnType
    btnColor: {
      type: String,
      required: false
    },
    // Size of the button
    xSmall: {
      type: Boolean,
      default: false,
      required: false
    },
    // Size of the button
    small: {
      type: Boolean,
      default: false,
      required: false
    },
    // Size of the button
    large: {
      type: Boolean,
      default: false,
      required: false
    },
    // The color of the icon
    iconColor: {
      type: String,
      default: 'white',
      required: false
    },
    // String for icon, overrides default determined buy btnType
    iconString: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    // Button text, determines if icon is FAB or not
    btnText: {
      type: String,
      required: false
    }
  },
  computed: {
    /**
     * Computes button color based on btnType. Priority is given to btnColor, if provided by user.
     * @returns {string}
     */
    btnColorComputed() {
      if (this.btnColor) {
        return this.btnColor
      }
      let btnColor = ''
      switch (this.btnType) {
        case 'edit':
          btnColor = 'primary'
          break;
        case 'add':
          btnColor = 'primary'
          break;
        case 'remove':
          btnColor = 'red'
          break;
        case 'submit':
          btnColor = 'secondary'
          break;
        case 'close':
          btnColor = 'secondary'
          break;
        case 'home':
          btnColor = 'primary'
          break;
        default:
          btnColor = 'secondary'
          break;
      }
      return btnColor
    },
    /**
     * Computes if button is xSmall, based on breakpoint or boolean provided by user
     * @returns {string}
     */
    xSmallComputed() {
      return this.$vuetify.breakpoint.xs || this.xSmall
    },
    /**
     * Computes if button is small, based on breakpoint or boolean provided by user
     * @returns {string}
     */
    smallComputed() {
      return this.$vuetify.breakpoint.small || this.small
    },
    /**
     * Computes if button is large, based on breakpoint or boolean provided by user
     * @returns {string}
     */
    largeComputed() {
      return this.$vuetify.breakpoint.large || this.large
    },
    /**
     * Computes string for icon
     * @returns {string}
     */
    iconStringComputed() {
      if (this.iconString) {
        return this.iconString
      }
      let iconString = ''
      switch (this.btnType) {
        case 'edit':
          iconString = 'mdi-pencil'
          break;
        case 'remove':
          iconString = 'delete'
          break;
        case 'add':
          iconString = 'add'
          break;
        case 'submit':
          iconString = ''
          break;
        default:
          iconString = ''
          break;
      }
      return iconString
    },
    btnTextComputed() {
      if (this.btnText) {
        return this.btnText
      }
      let btnText = ''
      if (this.btnType === 'submit') {
        btnText = 'Submit'
      } else if (this.btnType === 'close') {
        btnText = 'Close'
      }
      return btnText
    }
  },
  methods: {
    /**
     * Emits event, triggering the action defined by the user.
     */
    clickHandler() {
      this.$emit('action')
    }
  }
}
</script>

<template>
  <v-btn
    :fab="!btnTextComputed"
    :disabled="disabled"
    :x-small='xSmallComputed'
    :small='smallComputed'
    :large='largeComputed'
    :color="btnColorComputed"
    @click.prevent="clickHandler"
    rounded
  >
    <v-icon v-if="iconStringComputed" :color="iconColor">{{iconStringComputed}}</v-icon>
    <span v-if="btnTextComputed">{{btnTextComputed}}</span>
  </v-btn>
</template>
