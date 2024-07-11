<script>

export default {
  name: 'IFXDisplayLabInfo',
  props: ['value'],
  data() {
    return {
      data: this.value,
    }
  },
  methods: {
    /**
     * Update the data property when the modelValue prop changes.
     */
    updateData() {
      console.log('updateData in DisplayLabInfo.vue', this.data.lab_info)
      this.$emit('input', this.data)
    },
  },
  mounted() {
    console.log('mounted in DisplayLabInfo.vue', this.value)
  },
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex v-if="data && data.lab_info && data.lab_info.lab_name">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Lab / Company Name
                </v-flex>
                <v-flex>
                  {{ data.lab_info.lab_name }}
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
                  {{ data.lab_info.pi_name }}, {{ data.lab_info.pi_email }}
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
                  <span v-if="data.lab_info.billing_contact_name">{{ data.lab_info.billing_contact_name }}</span>
                  <span v-else>{{ data.lab_info.pi_name }}</span>, {{ data.lab_info.billing_contact_email }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Selected Organization
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="data.lab_info.organization"
                    @change="updateData"
                  >
                  </v-text-field>
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
