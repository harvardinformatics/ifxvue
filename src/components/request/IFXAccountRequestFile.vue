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
  <v-row>
    <v-col class="field-label" style="flex-basis: 30%; max-width: 30%;">
      {{ accountRequestFileData.category }}
    </v-col>
    <v-col style="flex-basis: 60%; max-width: 60%;" class="text-truncate">
      <a :href="accountRequestFileData.file" target="_blank">{{ fileName(accountRequestFileData.file) }}</a>
    </v-col>
  </v-row>
</template>
