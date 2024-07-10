<script>
export default {
  name: 'IFXDisplayMOU',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout row v-for="requestFileData in data" :key="requestFileData.request">
        <v-flex v-if="requestFileData.step_name == 'mou'">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  MOU
                </v-flex>
                <v-flex>
                  {{ requestFileData.file }}
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
