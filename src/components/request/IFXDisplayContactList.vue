<script>
export default {
  name: 'IFXDisplayContactList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row class="py-4">
    <v-col cols="12">
      <v-row v-for="contact in data" :key="contact.contact.detail" density="comfortable">
        <v-col cols="3">
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
