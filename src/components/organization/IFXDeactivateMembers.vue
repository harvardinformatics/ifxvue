<script>
import { mapActions } from 'vuex'

export default {
  name: 'IFXDeactivateMembers.',
  props: {
    value: {
      type: Array,
      required: true,
    },
    showModal: {
      type: Boolean,
      default: true,
    },
    org: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      selected: [],
      people: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async revokePeople() {
      /* eslint-disable no-plusplus, no-await-in-loop */
      for (let i = 0; i < this.selected.length; i++) {
        const person = this.selected[i]
        const nanite = await this.$api.nanite.get(person.ifxid).catch((error) => {
          this.showMessage(error)
        })
        const orgIndex = nanite.affiliations.findIndex((org) => this.org.slug === org.slug)
        if (orgIndex !== -1) {
          nanite.affiliations[orgIndex].active = false
          nanite.changeComment = `Deactivating membership of ${person.fullName} in ${this.org.slug}`
          await this.$api.nanite.update(nanite).catch((error) => {
            this.showMessage(error)
          })
        }
      }
      // Since the parent will reload the org info, we don't actually send anything new here.
      this.updatePeople(this.selected)
    },
    updatePeople(people) {
      this.$emit('input', people)
      this.$emit('close')
    },
    cancel() {
      this.$emit('close')
    },
  },
  computed: {
    modal: {
      set(val) {
        this.$emit('input', val)
      },
      get() {
        return this.showModal
      },
    },
  },

  mounted() {
    this.people = this.value
    this.selected = this.people
  },
}
</script>

<template>
  <v-container>
    <v-dialog v-model="modal" width="unset" @click:outside="cancel">
      <v-card width="auto">
        <v-card-title>Set members inactive in {{ org.name }}</v-card-title>
        <v-card-text>
          <v-container class="small-text-dialog">
            <v-row v-for="person in people" :key="person.id" dense>
              <v-col>
                <v-checkbox v-model="selected" :value="person" :label="person.fullName"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="secondary" @click="cancel()">Cancel</v-btn>
          <v-btn text color="primary" @click="revokePeople()">Deactivate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style>
.small-text-dialog * {
  font-size: 11px;
}
</style>
