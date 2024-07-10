<script>
export default {
  name: 'IFXDisplayPO',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout row v-for="requestFileData in data" :key="requestFileData.request">
        <v-flex v-if="requestFileData.step_name == 'po'">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  PO
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
