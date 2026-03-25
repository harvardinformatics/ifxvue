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
      // Need to "decompose"
      if (this.data.organization.data) {
        this.data.organization = this.data.organization.data
      }
      this.$emit('change', this.data)
      return true // This is needed to make the v-text-field work.  Don't know why
    },
  },
  computed: {
    hasLabInfo() {
      return this.data && this.data && this.data.lab_name
    },
    hasLabApprovers() {
      return this.data && this.data && this.data.approvers?.length
    },
  },
  mounted: function () {
    if (this.data?.organization?.contacts) {
      const piOrgContact = this.data.organization.contacts.find((orgContact) => orgContact.role === 'PI')
      if (piOrgContact) {
        this.piContact = piOrgContact.contact
      }
      const billingOrgContact = this.data.organization.contacts.find(
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
  <v-row class="flex-column">
    <v-col>
      <v-row>
        <v-col v-if="data && data">
          <v-row class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">Lab / Company Name</v-col>
                <v-col cols="9">
                  {{ data.lab_name }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="flex-column">
            <v-col>
              <v-row class="align-center">
                <v-col cols="3">Selected Organization</v-col>
                <v-col cols="9">
                  <v-autocomplete
                    v-if="organizations"
                    v-model="data.organization"
                    :items="organizations"
                    item-title="name"
                    return-object
                    @update:model-value="updateData()"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">Lab Approvers</v-col>
                <v-col cols="9" v-if="hasLabApprovers">
                  <span v-for="(approver, index) in data.approvers" :key="index">
                    <a :href="`mailto:${approver}`">{{ approver }}</a>
                    <span v-if="index < data.approvers.length - 1">,</span>
                  </span>
                </v-col>
                <v-col cols="9" v-else>No approvers specified</v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="Object.keys(piContact).length === 0" class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">PI / Manager</v-col>
                <v-col>{{ data.pi_name }}, {{ data.pi_email }}</v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.pi_street1 }}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.pi_city }}, {{ data.pi_state }} {{ data.pi_postal_code }}
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="data.pi_contact_country != 'United States'">
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.pi_contact_country }}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.pi_phone }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">PI / Manager</v-col>
                <v-col>{{ piContact.name }}, {{ piContact.detail }}</v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col class="address">
                  {{ piContact.address }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="Object.keys(billingContact).length === 0" class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">Billing Contact</v-col>
                <v-col>
                  <span v-if="data.billing_contact_name">{{ data.billing_contact_name }}</span>
                  <span v-else>{{ data.pi_name }}</span>
                  , {{ data.billing_contact_email }}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.billing_contact_street1 }}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.billing_contact_city }}, {{ data.billing_contact_state }}
                  {{ data.billing_contact_postal_code }}
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="data.billing_contact_country != 'United States'">
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.billing_contact_country }}
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col>
                  {{ data.billing_contact_phone }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="3">Billing Contact</v-col>
                <v-col>{{ billingContact.name }}, {{ billingContact.detail }}</v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="3">&nbsp;</v-col>
                <v-col class="address">
                  {{ billingContact.address }}
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
.address {
  white-space: pre-line;
}
</style>
