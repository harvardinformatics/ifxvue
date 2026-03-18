<script>
export default {
  name: 'IFXDisplayMOU',
  props: ['data'],
}
</script>
<template>
  <v-row class="flex-column" v-if="data">
    <v-col>
      <v-row v-for="requestFileData in data" :key="requestFileData.request">
        <v-col v-if="requestFileData.step_name == 'mou'">
          <v-row class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="4">
                  MOU
                </v-col>
                <v-col>
                  {{ requestFileData.file }}
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
