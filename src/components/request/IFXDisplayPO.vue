<script>
export default {
  name: 'IFXDisplayPO',
  props: ['data'],
}
</script>
<template>
  <v-row>
    <v-col>
      <v-row v-for="requestFileData in data" :key="requestFileData.request">
        <v-col v-if="requestFileData.step_name == 'po'">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  PO
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
