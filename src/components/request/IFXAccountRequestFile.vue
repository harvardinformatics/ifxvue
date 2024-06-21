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
  <v-layout column>
    <v-flex>
      <v-layout row>
        <v-flex xs3>
          {{ accountRequestFileData.category }}
        </v-flex>
        <v-flex>
          <a :href="accountRequestFileData.file" target="_blank">{{ fileName(accountRequestFileData.file) }}</a>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
