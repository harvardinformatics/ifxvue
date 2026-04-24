<script>
export default {
  name: 'IFXDisplayProject',
  props: ['data'],
}
</script>
<template>
  <v-row v-if="data && data.title"  class="pt-1" density="compact">
    <v-col cols="12">
      {{ data.title }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Current State</v-col>
    <v-col class="ar-field-value">
      {{ $stateDisplay(data.current_state) }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Estimated Start Date</v-col>
    <v-col class="ar-field-value">
      {{ data.estimated_start_date }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Estimated duration</v-col>
    <v-col class="ar-field-value">
      {{ data.estimated_duration }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
