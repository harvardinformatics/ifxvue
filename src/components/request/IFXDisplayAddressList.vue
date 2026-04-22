<script>
export default {
  name: 'IFXDisplayAddressList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row v-for="address in data" :key="address.type" density="comfortable">
        <v-col>
          <v-row class="flex-column" density="comfortable">
            <v-col>
              <v-row density="comfortable">
                <v-col cols="4">
                  Street address
                </v-col>
                <v-col>
                  {{address.street1}}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row density="comfortable">
                <v-col cols="4">
                  City
                </v-col>
                <v-col>
                  {{address.city}}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row density="comfortable">
                <v-col cols="4">
                  State
                </v-col>
                <v-col>
                  {{address.state}}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row density="comfortable">
                <v-col cols="4">
                  Country
                </v-col>
                <v-col>
                  {{address.country}}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row density="comfortable">
                <v-col cols="4">
                  Postal code
                </v-col>
                <v-col>
                  {{address.postal_code}}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
