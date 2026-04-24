<script>
export default {
  name: 'IFXDisplayAddressList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row v-for="address in data" :key="address.type" density="compact" class="pt-2">
    <v-col>
      <v-row density="compact">
        <v-col cols="4" class="ar-field-label">
          Street address
        </v-col>
        <v-col class="ar-field-value">
          {{address.street1}}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="4" class="ar-field-label">
          City
        </v-col>
        <v-col class="ar-field-value">
          {{address.city}}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="4" class="ar-field-label">
          State
        </v-col>
        <v-col class="ar-field-value">
          {{address.state}}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="4" class="ar-field-label">
          Country
        </v-col>
        <v-col class="ar-field-value">
          {{address.country}}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col cols="4" class="ar-field-label">
          Postal code
        </v-col>
        <v-col class="ar-field-value">
          {{address.postal_code}}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
