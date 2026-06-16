<script>
export default {
  name: 'IFXDisplayLabInfo',
  props: {
    value: {
      type: Object,
      required: true,
    },
    organizations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      data: this.value,
      piContact: {},
      billingContact: {},
    }
  },
  methods: {
    updateData() {
      this.piContact = {}
      this.billingContact = {}
      this.$emit('change', this.data)
      return true // This is needed to make the v-text-field work.  Don't know why
    },
  },
  computed: {
    hasLabInfo() {
      return this.data && this.data.lab_info && this.data.lab_info.lab_name
    },
    hasLabApprovers() {
      return this.data && this.data.lab_info && this.data.lab_info.approvers?.length
    },
  },
  mounted: function () {
    if (this.data?.lab_info?.organization?.contacts) {
      const piOrgContact = this.data.lab_info.organization.contacts.find((orgContact) => orgContact.role === 'PI')
      if (piOrgContact) {
        this.piContact = piOrgContact.contact
      }
      const billingOrgContact = this.data.lab_info.organization.contacts.find(
        (orgContact) => orgContact.role === 'Billing'
      )
      if (billingOrgContact) {
        this.billingContact = billingOrgContact.contact
      }
    }
  },
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex v-if="hasLabInfo">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Lab / Company Name</v-flex>
                <v-flex>
                  {{ data.lab_info.lab_name }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row align-center>
                <v-flex xs4>Selected Organization</v-flex>
                <v-flex>
                  <v-autocomplete
                    v-if="organizations"
                    v-model.trim="data.lab_info.organization"
                    :items="organizations"
                    item-text="name"
                    return-object
                    @change="updateData()"
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Lab Approvers</v-flex>
                <v-flex v-if="hasLabApprovers">
                  <span v-for="(approver, index) in data.lab_info.approvers" :key="index">
                    <a :href="`mailto:${approver}`">{{ approver }}</a>
                    <span v-if="index < data.lab_info.approvers.length - 1">,</span>
                  </span>
                </v-flex>
                <v-flex v-else>No approvers specified</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-if="Object.keys(piContact).length === 0" column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>PI / Manager</v-flex>
                <v-flex>{{ data.lab_info.pi_name }}, {{ data.lab_info.pi_email }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.pi_street1 }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.pi_city }}, {{ data.lab_info.pi_state }} {{ data.lab_info.pi_postal_code }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="data.lab_info.pi_contact_country != 'United States'">
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.pi_contact_country }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.pi_phone }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-else column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>PI / Manager</v-flex>
                <v-flex>{{ piContact.name }}, {{ piContact.detail }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex class="address">
                  {{ piContact.address }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-if="Object.keys(billingContact).length === 0" column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Billing Contact</v-flex>
                <v-flex>
                  <span v-if="data.lab_info.billing_contact_name">{{ data.lab_info.billing_contact_name }}</span>
                  <span v-else>{{ data.lab_info.pi_name }}</span>
                  , {{ data.lab_info.billing_contact_email }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.billing_contact_street1 }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.billing_contact_city }}, {{ data.lab_info.billing_contact_state }}
                  {{ data.lab_info.billing_contact_postal_code }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="data.lab_info.billing_contact_country != 'United States'">
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.billing_contact_country }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex>
                  {{ data.lab_info.billing_contact_phone }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout v-else column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Billing Contact</v-flex>
                <v-flex>{{ billingContact.name }}, {{ billingContact.detail }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row>
                <v-flex xs4>&nbsp;</v-flex>
                <v-flex class="address">
                  {{ billingContact.address }}
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
.address {
  white-space: pre-line;
}
</style>
