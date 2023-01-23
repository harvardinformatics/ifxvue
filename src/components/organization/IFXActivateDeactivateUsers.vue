<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'IFXActivateDeactivateUsers.',
  props: {
    value: {
      type: Array,
      required: true,
    },
    showModal: {
      type: Boolean,
      default: true,
    },
    activate: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      selected: [],
      people: [],
      org: {},
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async modifyPeople() {
      /* eslint-disable no-plusplus, no-await-in-loop */
      for (let i = 0; i < this.selected.length; i++) {
        const personID = this.selected[i].id
        const person = await this.$api.user.getByID(personID, true).catch((error) => {
          this.showMessage(error)
        })
        console.log(person)
        if (person?.affiliations.length) {
          const orgIndex = person.affiliations.findIndex((affiliation) => this.org.slug === affiliation.organization)
          if (orgIndex !== -1) {
            person.affiliations[orgIndex].active = this.activate
            person.changeComment = `Deactivating membership of ${person.fullName} in ${this.org.slug}`
            await this.$api.user.update(person).catch((error) => {
              this.showMessage(error)
            })
          }
        }
        const userIdx = this.org.users.findIndex((user) => user.id === personID)
        if (userIdx !== -1) {
          this.org.users[userIdx].active = this.activate
        }
      }
      this.$emit('update', this.org)
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
    this.org = cloneDeep(this.organization)
  },
}
</script>

<template>
  <v-container>
    <v-dialog v-model="modal" width="unset" @click:outside="cancel">
      <v-card width="auto">
        <v-card-title>{{ `Set members ${this.activate ? '' : 'in'}active in` }} {{ org.name }}</v-card-title>
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
          <v-btn text color="primary" @click="modifyPeople()">{{ `${this.activate ? 'A' : 'Dea'}ctivate` }}</v-btn>
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
