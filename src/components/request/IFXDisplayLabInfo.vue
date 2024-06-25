<script>
export default {
  name: 'IFXDisplayLabInfo',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex v-if="data && data.lab_name">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Lab / Company Name
                </v-flex>
                <v-flex>
                  {{ data.lab_name }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  PI / Manager
                </v-flex>
                <v-flex>
                  {{ data.pi_name }}, {{ data.pi_email }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Billing Contact
                </v-flex>
                <v-flex>
                  <span v-if="data.billing_contact_name">{{ data.billing_contact_name }}</span>
                  <span v-else>{{ data.pi_name }}</span>, {{ data.billing_contact_email }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
