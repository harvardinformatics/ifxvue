<script>
export default {
  name: 'DisplayContactList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout row v-for="contact in data" :key="contact.contact.detail">
        <v-flex xs4>
          {{contact.role}}
        </v-flex>
        <v-flex>
          {{contact.contact.detail}}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped>

</style>
