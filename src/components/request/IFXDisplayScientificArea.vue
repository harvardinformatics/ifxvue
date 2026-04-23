<script>
export default {
  name: 'IFXDisplayScientificArea',
  props: ['data'],
}
</script>
<template>
  <v-row density="compact">
    <v-col cols="4">
      Application Type
    </v-col>
    <v-col>
      {{ data.application_type }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col cols="4">
      Technical Field
    </v-col>
    <v-col>
      {{ data.technical_field }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col cols="4">
      Technical Category
    </v-col>
    <v-col>
      {{ data.technical_category }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col cols="4">
      Funding Source
    </v-col>
    <v-col>
      {{ data.funding_source }}
    </v-col>
  </v-row>
  <v-row density="compact">
    <v-col cols="4">
      Use Type
    </v-col>
    <v-col>
      {{ data.use_type }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
