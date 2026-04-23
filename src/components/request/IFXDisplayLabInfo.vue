<script>
export default {
  name: 'IFXDisplayLabInfo',
  props: {
    modelValue: {
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
      data: this.modelValue,
      piContact: {},
      billingContact: {},
    }
  },
  methods: {
    updateData() {
      this.piContact = {}
      this.billingContact = {}
      this.$emit('update:modelValue', this.data)
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
  <v-row v-if="hasLabInfo">
    <v-col>
      <v-row>
        <v-col cols="4">Lab / Company Name</v-col>
        <v-col>
          {{ data.lab_info.lab_name }}
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="4">Selected Organization</v-col>
        <v-col>
          <v-autocomplete
            v-if="organizations"
            v-model.trim="data.lab_info.organization"
            :items="organizations"
            item-text="name"
            return-object
            @change="updateData()"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">Lab Approvers</v-col>
        <v-col v-if="hasLabApprovers">
          <span v-for="(approver, index) in data.lab_info.approvers" :key="index">
            <a :href="`mailto:${approver}`">{{ approver }}</a>
            <span v-if="index < data.lab_info.approvers.length - 1">,</span>
          </span>
        </v-col>
        <v-col v-else>No approvers specified</v-col>
      </v-row>
      <v-row v-if="Object.keys(piContact).length === 0">
        <v-col cols="12">
          <v-row>
            <v-col cols="4">PI / Manager</v-col>
            <v-col>{{ data.lab_info.pi_name }}, {{ data.lab_info.pi_email }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.pi_street1 }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.pi_city }}, {{ data.lab_info.pi_state }} {{ data.lab_info.pi_postal_code }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" v-if="data.lab_info.pi_contact_country != 'United States'">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.pi_contact_country }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.pi_phone }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">PI / Manager</v-col>
            <v-col>{{ piContact.name }}, {{ piContact.detail }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col class="address">
              {{ piContact.address }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="Object.keys(billingContact).length === 0">
        <v-col cols="12">
          <v-row>
            <v-col cols="4">Billing Contact</v-col>
            <v-col>
              <span v-if="data.lab_info.billing_contact_name">{{ data.lab_info.billing_contact_name }}</span>
              <span v-else>{{ data.lab_info.pi_name }}</span>
              , {{ data.lab_info.billing_contact_email }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.billing_contact_street1 }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.billing_contact_city }}, {{ data.lab_info.billing_contact_state }}
              {{ data.lab_info.billing_contact_postal_code }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" v-if="data.lab_info.billing_contact_country != 'United States'">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.billing_contact_country }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col>
              {{ data.lab_info.billing_contact_phone }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">Billing Contact</v-col>
            <v-col>{{ billingContact.name }}, {{ billingContact.detail }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="4">&nbsp;</v-col>
            <v-col class="address">
              {{ billingContact.address }}
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
