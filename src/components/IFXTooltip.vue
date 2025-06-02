<template>
  <v-tooltip v-bind="getAttrs">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind:aria-label="tooltip"
        :size="fab ? 'default' : 'default'"
        :color="color"
        v-bind="props"
        @click="handleClick"
        :disabled="disabled"
      >
        <v-icon :dark="dark" :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span v-if="!isHTML">{{ tooltip }}</span>
    <span v-else v-html="tooltip"></span>
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
    isHTML: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      // The button was clicked. Emit the action event.
      this.$emit('action')
    },
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
