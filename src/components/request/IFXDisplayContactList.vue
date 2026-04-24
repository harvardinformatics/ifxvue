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
    <v-col class="ar-field-label">
      {{contact.role}}
    </v-col>
    <v-col class="ar-field-value">
      {{contact.contact.detail}}
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
