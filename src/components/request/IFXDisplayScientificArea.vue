<script>
export default {
  name: 'IFXDisplayScientificArea',
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
              Application Type
            </v-flex>
            <v-flex>
              {{ data.application_type }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Technical Field
            </v-flex>
            <v-flex>
              {{ data.technical_field }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Technical Category
            </v-flex>
            <v-flex>
              {{ data.technical_category }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Funding Source
            </v-flex>
            <v-flex>
              {{ data.funding_source }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Use Type
            </v-flex>
            <v-flex>
              {{ data.use_type }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
