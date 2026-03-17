<script>
export default {
  name: 'IFXDisplayDemographicData',
  props: ['data'],
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row class="flex-column">
        <v-col>
          <v-row>
            <v-col cols="4">
              Scholar Type
            </v-col>
            <v-col>
              {{ data.scholar_type }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              Race
            </v-col>
            <v-col>
              {{ data.race }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              Ethnicity
            </v-col>
            <v-col>
              {{ data.ethnicity }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              Gender
            </v-col>
            <v-col>
              {{ data.gender }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              Disability
            </v-col>
            <v-col>
              {{ data.disability }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="4">
              Citizenship
            </v-col>
            <v-col>
              {{ data.citizenship }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
