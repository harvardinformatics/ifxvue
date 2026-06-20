<script>
export default {
  name: 'IFXDisplayBillingContact',
  props: ['data'],
}
</script>
<template>
  <v-row v-if="data" dense>
    <v-col>
      <v-row dense>
        <v-col>
          {{ data.billing_contact.name}}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          {{ data.billing_contact.email}}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-pre-wrap">
          {{ data.billing_contact.address}}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
