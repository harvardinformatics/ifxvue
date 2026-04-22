<script>
export default {
  name: 'IFXDisplayProject',
  props: ['data'],
}
</script>
<template>
  <v-row v-if="data && data.title"  class="pt-1">
    <v-col cols="12">
      {{ data.title }}
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">Current State</v-col>
    <v-col>
      {{ $stateDisplay(data.current_state) }}
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">Estimated Start Date</v-col>
    <v-col>
      {{ data.estimated_start_date }}
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4">Estimated duration</v-col>
    <v-col>
      {{ data.estimated_duration }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
