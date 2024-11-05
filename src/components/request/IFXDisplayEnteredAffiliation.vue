<script>
// Show the "Entered" text and allow primary affiliation to be selected
export default {
  name: 'IFXDisplayEnteredAffiliation',
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
    }
  },
  methods: {
    updateData() {
      this.$emit('change', this.data)
      return true // This is needed to make the v-text-field work.  Don't know why
    },
  },
}
</script>
<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex v-if="data && data.entered_affiliation">
          <v-layout column>
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  Entered Affiliation
                </v-flex>
                <v-flex>
                  {{ data.entered_affiliation }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-layout row align-center>
                <v-flex xs4>
                  Selected Organization
                </v-flex>
                <v-flex>
                  <v-autocomplete v-if="organizations"
                    v-model.trim="data.person.primary_affiliation"
                    :items="organizations"
                    item-text="name"
                    item-value="slug"
                    @change="updateData()"
                  ></v-autocomplete>
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
