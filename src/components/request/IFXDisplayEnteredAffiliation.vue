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
  <v-row>
    <v-col>
      <v-row>
        <v-col v-if="data && data.entered_affiliation">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  Entered Affiliation
                </v-col>
                <v-col>
                  {{ data.entered_affiliation }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row align="center">
                <v-col cols="4">
                  Selected Organization
                </v-col>
                <v-col>
                  <v-autocomplete v-if="organizations"
                    v-model.trim="data.person.primary_affiliation"
                    :items="organizations"
                    item-text="name"
                    item-value="slug"
                    @change="updateData()"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped></style>
