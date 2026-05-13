<script>
import IFXButton from '@/components/IFXButton'

export default {
  name: 'IFXPageActionBar',
  components: { IFXButton },
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    btnType: {
      type: String,
      required: false,
      default: 'submit',
    },
    btnText: {
      type: String,
      required: false,
    },
    submitting: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    /**
     * Emits event, triggering the action defined by the user.
     */
    handleAction() {
      this.$emit('action')
    },
  },
}
</script>

<template>
  <v-row>
    <v-col class="d-flex justify-end">
      <slot>
        <IFXButton :btnType="btnType" :disabled="disabled" :btnText="btnText" @action="handleAction" />
      </slot>
    </v-col>
    <v-overlay :value="submitting">
      <span class="d-flex align-center elevation-2 pa-4 rounded-lg grey darken-1">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <em class="ml-4 text-body-1">Updating...</em>
      </span>
    </v-overlay>
  </v-row>
</template>

<style scoped lang="scss"></style>
