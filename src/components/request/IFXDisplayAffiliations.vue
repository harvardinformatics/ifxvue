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
        <v-col style="flex-basis: 30%; max-width: 30%;">Primary</v-col>
        <v-col style="flex-basis: 60%; max-width: 60%;">
          {{ $orgNameFromSlug(data.person.primary_affiliation) }}
        </v-col>
      </v-row>
      <v-row v-if="data.person.affiliations.length && data.person.affiliations.length > 1" density="compact">
        <v-col style="flex-basis: 30%; max-width: 30%;">Others</v-col>
        <v-col style="flex-basis: 60%; max-width: 60%;">
          {{ affiliationNames() }}
        </v-col>
      </v-row>
      <v-row density="compact">
        <v-col style="flex-basis: 30%; max-width: 30%;">Approvers</v-col>
        <v-col v-if="data.approver_contacts.length > 0" style="flex-basis: 60%; max-width: 60%;">
          <span v-for="(approver, index) in data.approver_contacts" :key="index">
            <a :href="`mailto:${approver}`">{{ approver }}</a>
            <span v-if="index < data.approver_contacts.length - 1">,&nbsp;</span>
          </span>
        </v-col>
        <v-col v-else>No approvers specified</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
