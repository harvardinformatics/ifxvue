<script>
// Used in conjunction with the message vuex module
// Can be used at the top level of the application or added to a component to override any top-level instances
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'IFXMessageDisplay',
  props: {
    vertical: {
      default: true,
      type: Boolean
    },
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
      default: 'grey darken-4',
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
    :value="isMessageActive"
    :vertical="vertical"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :color="color"
    :multi-line="multiline"
    :timeout="messageTimeout"
    @input="deactivate"
    data-cy='ifx-message'
  >
    {{message}}
    <template #action>
      <IFXButton btnType='close' small @action="deactivateMessage"/>
    </template>
  </v-snackbar>
</template>
