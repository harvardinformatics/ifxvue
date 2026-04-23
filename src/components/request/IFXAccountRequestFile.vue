<script>
export default {
  name: 'IFXAccountRequestFile',
  props: {
    accountRequestFileData: Object,
  },
  methods: {
    fileName(path) {
      return path.split('/').pop()
    },
  },
}
</script>
<template>
  <v-row density="comfortable">
    <v-col class="field-label" style="flex-basis: 20%; max-width: 20%;">
      {{ accountRequestFileData.category }}
    </v-col>
    <v-col style="flex-basis: 70%; max-width: 70%;" class="text-truncate">
      <a :href="accountRequestFileData.file" target="_blank">{{ fileName(accountRequestFileData.file) }}</a>
    </v-col>
  </v-row>
</template>
<style scoped>
  .field-label {
    font-weight: bold;
    padding-top: 0px !important;
  }
</style>
