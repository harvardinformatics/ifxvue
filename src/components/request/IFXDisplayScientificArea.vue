<script>
export default {
  name: 'IFXDisplayScientificArea',
  props: ['data'],
}
</script>
<template>
  <v-row density="compact">
    <v-col class="ar-field-label">
      Application Type
    </v-col>
    <v-col class="ar-field-value">
      {{ data.application_type }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">
      Technical Field
    </v-col>
    <v-col class="ar-field-value">
      {{ data.technical_field }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">
      Technical Category
    </v-col>
    <v-col class="ar-field-value">
      {{ data.technical_category }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">
      Funding Source
    </v-col>
    <v-col class="ar-field-value">
      {{ data.funding_source }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col class="ar-field-label">
      Use Type
    </v-col>
    <v-col class="ar-field-value">
      {{ data.use_type }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
