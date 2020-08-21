<script>
export default {
  name: 'DisplayAddressList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout row v-for="address in data" :key="address.type">
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Street address
                </v-flex>
                <v-flex>
                  {{address.street1}}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  City
                </v-flex>
                <v-flex>
                  {{address.city}}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  State
                </v-flex>
                <v-flex>
                  {{address.state}}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Country
                </v-flex>
                <v-flex>
                  {{address.country}}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Postal code
                </v-flex>
                <v-flex>
                  {{address.postal_code}}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped>

</style>
