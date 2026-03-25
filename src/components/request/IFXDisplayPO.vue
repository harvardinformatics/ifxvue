<script>
export default {
  name: 'IFXDisplayPO',
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}
</script>
<template>
  <v-row class="flex-column" v-if="data">
    <v-col>
      <v-row v-for="requestFileData in data" :key="requestFileData.step_name">
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
