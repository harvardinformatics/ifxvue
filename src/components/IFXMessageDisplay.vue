<script>
import { mapActions, mapGetters } from 'vuex'
import IFXButton from '@/components/IFXButton'

export default {
  name: 'IFXMessageDisplay',
  components: {
    IFXButton
  },
  props: {
    top: {
      default: true,
      type: Boolean
    },
    bottom: {
      default: false,
      type: Boolean
    },
    left: {
      default: false,
      type: Boolean
    },
    right: {
      default: false,
      type: Boolean
    },
    color: {
      default: 'grey-darken-4',
      type: String
    },
    multiline: {
      default: false,
      type: Boolean
    },
    timeout: {
      default: 3000,
      type: Number
    }
  },
  computed: {
    ...mapGetters(['message', 'isActionRequired', 'isMessageActive']),
    messageTimeout() {
      return this.isActionRequired ? 500000 : (this.message.length / 30) * 1000 + 1000
    },
    // Compute proper Vuetify 3 location based on prop combinations
    snackbarLocation() {
      const vertical = this.top ? 'top' : this.bottom ? 'bottom' : ''
      const horizontal = this.left ? 'left' : this.right ? 'right' : ''

      // Combine them for Vuetify 3 location format
      if (vertical && horizontal) {
        return `${vertical} ${horizontal}` // e.g., "top left"
      }
      if (vertical) return vertical
      if (horizontal) return `top ${horizontal}`
      return 'top'
    }
  },
  methods: {
    ...mapActions(['deactivateMessage']),
    deactivate() {
      this.deactivateMessage()
    }
  }
}
</script>

<template>
  <v-snackbar
    :model-value="isMessageActive"
    :location="snackbarLocation"
    :color="color"
    :multi-line="multiline"
    :timeout="messageTimeout"
    @update:model-value="deactivate"
    data-cy='ifx-message'
  >
    {{message}}
    <template #actions>
      <IFXButton btnType='close' small @action="deactivateMessage"/>
    </template>
  </v-snackbar>
</template>