<template>
  <v-tooltip v-bind="getAttrs">
    <template v-slot:activator="{ on }">
      <v-btn
        v-bind:aria-label="tooltip"
        :fab="fab"
        :color="color"
        v-on="on"
        v-bind="getAttrs"
        @click="action"
        :disabled="disabled"
      >
        <v-icon :dark="dark" :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
// Wraps Vuetify's tooltip to provide accessibility info
export default {
  name: 'IFXTooltip',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    iconColor: {
      type: String,
      required: false,
      default: 'white',
    },
    tooltip: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    dark: {
      type: Boolean,
      required: false,
      default: false,
    },
    fab: {
      type: Boolean,
      required: false,
      default: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    getAttrs() {
      const result = { ...this.$attrs }
      return result
    },
  },
}
</script>

<style scoped></style>
