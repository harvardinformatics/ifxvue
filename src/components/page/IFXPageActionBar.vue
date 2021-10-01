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
  },
  data() {
    return {
      show: true,
    }
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
        <IFXButton :btnType="btnType" :disabled="disabled" @action="handleAction" />
      </slot>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
