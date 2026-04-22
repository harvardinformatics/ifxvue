<script>
export default {
  name: 'IFXDisplayContactList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row v-for="contact in data" :key="contact.contact.detail" density="comfortable">
        <v-col cols="4">
          {{contact.role}}
        </v-col>
        <v-col>
          {{contact.contact.detail}}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
