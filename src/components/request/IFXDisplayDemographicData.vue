<script>
export default {
  name: 'IFXDisplayDemographicData',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout column>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Race
            </v-flex>
            <v-flex>
              {{ data.race }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Ethnicity
            </v-flex>
            <v-flex>
              {{ data.ethnicity }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Gender
            </v-flex>
            <v-flex>
              {{ data.gender }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Disability
            </v-flex>
            <v-flex>
              {{ data.disability }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Citizenship
            </v-flex>
            <v-flex>
              {{ data.citizenship }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Visa details
            </v-flex>
            <v-flex>
              {{ data.visa_details }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              National Origin
            </v-flex>
            <v-flex>
              {{ data.origin }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
