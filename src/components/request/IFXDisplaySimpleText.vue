<script>
export default {
  name: 'IFXDisplayHarvardKey',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex v-if="data">
      {{ data }}
    </v-flex>
    <v-flex v-else>
      ???
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
