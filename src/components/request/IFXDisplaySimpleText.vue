<script>
export default {
  name: 'IFXDisplayHarvardKey',
  props: ['data'],
}
</script>
<template>
  <v-row class="flex-column">
    <v-col v-if="data">
      {{ data }}
    </v-col>
    <v-col v-else>
      ???
    </v-col>
  </v-row>
</template>
<style scoped></style>
