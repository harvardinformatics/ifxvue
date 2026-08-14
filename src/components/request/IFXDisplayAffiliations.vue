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
  <v-layout column>
    <v-flex>
      <v-layout column>
        <v-flex>
          <v-layout row>
            <v-flex xs4>Primary</v-flex>
            <v-flex>
              {{ data.person.primary_affiliation | orgNameFromSlug }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="data.person.affiliations.length && data.person.affiliations.length > 1">
          <v-layout row>
            <v-flex xs4>Others</v-flex>
            <v-flex xs7>
              {{ affiliationNames() }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>Approvers</v-flex>
                <v-flex v-if="data.approver_contacts && data.approver_contacts.length > 0" xs7>
                  <span v-for="(approver, index) in data.approver_contacts" :key="index">
                    <a :href="`mailto:${approver}`">{{ approver }}</a>
                    <span v-if="index < data.approver_contacts.length - 1">,&nbsp;</span>
                  </span>
                </v-flex>
                <v-flex v-else>No approvers specified</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
