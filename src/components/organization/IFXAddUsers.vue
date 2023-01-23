<script>
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  name: 'IFXAddUsers',
  props: {
    value: { type: Object, required: true }, // The whole Organization object
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
        .getList(this.search)
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
        this.member.changeComment = `Converting primary affiliation to ${this.org.slug}`
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
  watch: {
    search(val) {
      if (val) {
        this.getPeople()
      }
    },
  },
  mounted() {
    this.org = this.value
  },
}
</script>

<template>
  <v-container>
    <v-dialog v-model="modal" width="500px" @click:outside="cancel">
      <v-card width="auto">
        <v-card-title>Add new organization member</v-card-title>
        <v-card-text>
          <v-container class="small-text-dialog">
            <v-row align="end">
              <v-col>
                <v-autocomplete
                  :loading="isLoading"
                  v-model="member"
                  :search-input.sync="search"
                  :items="people"
                  item-text="fullName"
                  label="People"
                  :rules="formRules.generic"
                  required
                  return-object
                  hint="Start typing to see a list of matches"
                  persistent-hint
                >
                  <template slot="no-data">
                    <div class="text-center px-3 text-body-2">Start typing to see a list of matches</div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col v-if="allowSetPrimaryAffiliation">
                <v-checkbox v-model="primaryAffiliation" label="Make primary affiliation"></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-radio-group v-model="role" row>
                  <v-radio label="Member" value="member"></v-radio>
                  <v-radio label="PI" value="pi"></v-radio>
                  <v-radio label="Lab Manager" value="lab_manager"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="secondary" @click="cancel()">Cancel</v-btn>
          <v-btn text :disabled="!member" color="primary" @click="updateOrg()">Add</v-btn>
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
