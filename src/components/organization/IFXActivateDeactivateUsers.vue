<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'IFXActivateDeactivateUsers',
  props: {
    modelValue: {
      type: Array,
      required: false,
      default: () => [],
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
      required: false,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'update:showModal', 'update', 'close'],
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
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      },
    },
    actionLabel() {
      return this.activate ? 'Activate' : 'Deactivate'
    },
  },
  mounted() {
    this.people = this.modelValue
    this.selected = this.people
    this.org = cloneDeep(this.organization)
  },
}
</script>

<template>
  <v-dialog v-model="modal" width="500px" @click:outside="cancel">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6">Set members {{ activate ? '' : 'in' }}active in {{ org?.name }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="cancel"
        />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-4">
        <v-checkbox
          v-for="person in people"
          :key="person.id"
          v-model="selected"
          :value="person"
          :label="person.fullName"
          density="compact"
          hide-details
        />
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" color="secondary" @click="cancel">Cancel</v-btn>
        <v-btn variant="text" color="primary" @click="modifyPeople">{{ actionLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>