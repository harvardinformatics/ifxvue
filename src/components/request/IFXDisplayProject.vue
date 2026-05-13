<script>
export default {
  name: 'IFXDisplayProject',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex v-if="data && data.title">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Title</v-flex>
                <v-flex>
                  {{ data.title }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Current State</v-flex>
                <v-flex>
                  {{ data.current_state | stateDisplay }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Estimated Start Date</v-flex>
                <v-flex>
                  {{ data.estimated_start_date }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Estimated duration</v-flex>
                <v-flex>
                  {{ data.estimated_duration }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
