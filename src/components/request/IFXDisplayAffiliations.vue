<script>
export default {
  name: 'IFXDisplayAffiliations',
  props: ['data'],
  methods: {
    affiliationNames() {
      const names = []
      this.data.person.affiliations.forEach((affiliation) => {
        if (affiliation.slug !== this.data.person.primary_affiliation) {
          names.push(this.$options.filters.orgNameFromSlug(affiliation.slug))
        }
      })
      return names.join(', ')
    },
  },
}
</script>
<template>
  <v-row class="my-2" density="compact">
    <v-col cols="12">
      <v-row class="pt-1" density="compact">
        <v-col class="ar-field-label">Primary</v-col>
        <v-col class="ar-field-value">
          {{ $orgNameFromSlug(data.person.primary_affiliation) }}
        </v-col>
      </v-row>
      <v-row v-if="data.person.affiliations.length && data.person.affiliations.length > 1" density="compact">
        <v-col class="ar-field-label">Others</v-col>
        <v-col class="ar-field-value">
          {{ affiliationNames() }}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col class="ar-field-label">Approvers</v-col>
        <v-col v-if="data.approver_contacts.length > 0" class="ar-field-value">
          <span v-for="(approver, index) in data.approver_contacts" :key="index">
            <a :href="`mailto:${approver}`">{{ approver }}</a>
            <span v-if="index < data.approver_contacts.length - 1">,&nbsp;</span>
          </span>
        </v-col>
        <v-col v-else class="ar-field-value">No approvers specified</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
