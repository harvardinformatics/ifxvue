<script>
export default {
  name: 'IFXDisplayDemographicData',
  props: ['data'],
}
</script>
<template>
  <v-row class="pt-1" density="compact">
    <v-col class="ar-field-label">
      Scholar Type
    </v-col>
    <v-col class="ar-field-value">
      {{ data.scholar_type }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Race</v-col>
    <v-col class="ar-field-value">
      {{ data.race }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Ethnicity</v-col>
    <v-col class="ar-field-value">
      {{ data.ethnicity }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Gender</v-col>
    <v-col class="ar-field-value">
      {{ data.gender }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Disability</v-col>
    <v-col class="ar-field-value">
      {{ data.disability }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">Citizenship</v-col>
    <v-col class="ar-field-value">
      {{ data.citizenship }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
