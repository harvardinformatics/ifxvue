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
                <v-flex xs4>
                  Title
                </v-flex>
                <v-flex>
                  {{ data.title }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Status
                </v-flex>
                <v-flex>
                  {{ data.status }}
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
