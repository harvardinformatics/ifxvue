<script>
export default {
  name: 'IFXDisplayContactList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row v-for="contact in data" :key="contact.contact.detail" density="compact" class="pt-1">
    <v-col cols="4">
      {{contact.role}}
    </v-col>
    <v-col cols="8">
      {{contact.contact.detail}}
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
