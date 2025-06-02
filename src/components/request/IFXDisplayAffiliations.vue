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
  }
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout column>
        <v-flex>
          <v-layout row>
            <v-flex xs4>
              Primary
            </v-flex>
            <v-flex>
              {{ $orgNameFromSlug(data.primary_affiliation) }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="data.affiliations.length && data.affiliations.length > 1">
          <v-layout row>
            <v-flex xs4>
              Others
            </v-flex>
            <v-flex>
              {{ affiliationNames() }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
