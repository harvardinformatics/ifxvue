<script>
export default {
  name: 'IFXDisplayPO',
  props: ['data'],
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row v-for="requestFileData in data" :key="requestFileData.request">
        <v-col v-if="requestFileData.step_name == 'po'">
          <v-row class="flex-column">
            <v-col>
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
