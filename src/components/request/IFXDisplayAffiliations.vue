<script>
export default {
  name: 'IFXDisplayAffiliations',
  props: ['data'],
  methods: {
    affiliationNames() {
      const names = []
      this.data.affiliations.forEach((affiliation) => {
        if (affiliation.slug !== this.data.primary_affiliation) {
          names.push(this.$orgNameFromSlug(affiliation.slug))
        }
      })
      return names.join(', ')
    },
  },
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row class="flex-column">
        <v-col>
          <v-row>
            <v-col cols="4">Primary</v-col>
            <v-col>
              {{ $orgNameFromSlug(data.primary_affiliation) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="data.person.affiliations.length && data.person.affiliations.length > 1">
          <v-row>
            <v-col cols="4">Others</v-col>
            <v-col cols="7">
              {{ affiliationNames() }}
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row class="flex-column">
            <v-col>
              <v-row>
                <v-col cols="4">Approvers</v-col>
                <v-col v-if="data.approver_contacts.length > 0" cols="7">
                  <span v-for="(approver, index) in data.approver_contacts" :key="index">
                    <a :href="`mailto:${approver}`">{{ approver }}</a>
                    <span v-if="index < data.approver_contacts.length - 1">,&nbsp;</span>
                  </span>
                </v-col>
                <v-col v-else>No approvers specified</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
