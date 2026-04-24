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
            <v-col class="ar-field-label">
              PO
            </v-col>
            <v-col class="ar-field-value">
              {{ requestFileData.file }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
