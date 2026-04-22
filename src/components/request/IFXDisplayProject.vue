<script>
export default {
  name: 'IFXDisplayProject',
  props: ['data'],
}
</script>
<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col v-if="data && data.title">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Title</v-col>
                <v-col>
                  {{ data.title }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Current State</v-col>
                <v-col>
                  {{ data.current_state | stateDisplay }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Estimated Start Date</v-col>
                <v-col>
                  {{ data.estimated_start_date }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Estimated duration</v-col>
                <v-col>
                  {{ data.estimated_duration }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
