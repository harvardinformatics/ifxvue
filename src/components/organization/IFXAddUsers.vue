<script>
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  name: 'IFXAddUsers',
  props: {
    modelValue: { type: Object, required: true },
    showModal: {
      type: Boolean,
      required: false,
      default: true,
    },
    itemType: {
      type: String,
      required: false,
      default: 'user',
    },
    allowSetPrimaryAffiliation: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['update:modelValue', 'update:showModal', 'user', 'update', 'close'],
  data() {
    return {
      member: null,
      search: null,
      people: [],
      primaryAffiliation: false,
      role: 'member',
      isLoading: false,
      org: null,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    getPeople: debounce(function () {
      this.isLoading = true
      this.$api[this.itemType]
        .getList({ search: this.search })
        .then((response) => {
          this.people = response
        })
        .catch((error) => {
          this.showMessage(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }, 100),
    async updateOrg() {
      if (this.allowSetPrimaryAffiliation && this.primaryAffiliation) {
        this.member.primaryAffiliation = this.org.slug
        this.member.changeComment = `Changing primary affiliation to ${this.org.slug}`
        await this.$api.user.update(this.member).catch((error) => {
          this.showMessage(error)
        })
      }
      const userIdx = this.org.users.findIndex((user) => user.id === this.member.id)
      if (userIdx !== -1) {
        this.org.users[userIdx].active = true
      } else {
        this.org.addOrgUser(this.member, this.role, true)
      }

      this.$emit('user', this.member)
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
  },
  watch: {
    search(val) {
      if (val) {
        this.getPeople()
      }
    },
  },
  mounted() {
    this.org = this.modelValue
  },
}
</script>

<template>
  <v-dialog v-model="modal" width="500px" @click:outside="cancel">
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6">Add new organization member</span>
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
        <v-row align="end">
          <v-col>
            <v-autocomplete
              :loading="isLoading"
              v-model="member"
              v-model:search="search"
              :items="people"
              item-title="fullName"
              item-value="id"
              label="People"
              :rules="formRules.generic"
              required
              return-object
              hint="Start typing to see a list of matches"
              persistent-hint
              density="comfortable"
              no-data-text="Start typing to see a list of matches"
            />
          </v-col>
          <v-col v-if="allowSetPrimaryAffiliation">
            <v-checkbox
              v-model="primaryAffiliation"
              label="Make primary affiliation"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group v-model="role" inline hide-details>
              <v-radio label="Member" value="member" />
              <v-radio label="PI" value="pi" />
              <v-radio label="Lab Manager" value="lab_manager" />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" color="secondary" @click="cancel">Cancel</v-btn>
        <v-btn variant="text" :disabled="!member" color="primary" @click="updateOrg">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>