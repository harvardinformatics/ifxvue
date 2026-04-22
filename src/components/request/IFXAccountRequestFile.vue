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
    <v-col>
      <v-row>
        <v-col cols="3">
          {{ accountRequestFileData.category }}
        </v-col>
        <v-col>
          <a :href="accountRequestFileData.file" target="_blank">{{ fileName(accountRequestFileData.file) }}</a>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
