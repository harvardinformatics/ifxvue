<script>
export default {
  name: 'IFXDisplayHarvardKey',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row  class="pt-1">
    <v-col v-if="data">
      Got it
    </v-col>
    <v-col v-else>
      Don't got it
    </v-col>
  </v-row>
</template>
