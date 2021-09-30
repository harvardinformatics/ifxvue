<script>
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'

import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXUserEditWarning from '@/components/user/IFXUserEditWarning'
import IFXUserInfoDialog from '@/components/user/IFXUserInfoDialog'
import { mapActions } from 'vuex'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXSelectableAffiliation from '@/components/affiliation/IFXSelectableAffiliation'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import clone from 'lodash/clone'

export default {
  name: 'IFXUserEdit',
  mixins: [IFXUserMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
    IFXSelectableContact,
    IFXUserEditWarning,
    IFXUserInfoDialog,
    IFXLoginIcon,
    IFXItemHistoryDisplay,
    IFXSelectableAffiliation,
    IFXPageActionBar,
  },
  data() {
    return {
      isDialogActive: false,
      allGroupNames: [],
      allOrganizationSlugs: [],
      allContacts: [],
      allCountries: [],
      formName: 'userForm',
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      try {
        this.item = await this.getItem()
        const filteredContacts = this.item.contacts.filter((c) => c.contact.detail !== this.item.email)
        // TODO: find a better way to update for reactivity
        this.item.contacts = []
        filteredContacts.forEach((fc) => this.item.contacts.push(fc))
      } catch (error) {
        this.showMessage(error)
        this.rtr.push({ name: 'Home' })
      }
      // Cache item for comparison before submitting
      this.cacheItem()
      // await this.getSetNanitesData()
      this.allContacts = await this.$api.contact.getList()
      this.allGroupNames = await this.$api.group.getNames()
      const organizations = await this.$api.organization.getNames()
      this.allOrganizationSlugs = organizations.map((o) => o.slug)
    },
    async getItem() {
      const params = {
        include_disabled: true,
        exclude_application_users: false,
      }
      return this.apiRef.getByID(this.id, params)
    },
    openDialog() {
      // If form is not valid, do not activate dialog
      const isFormValid = this.$refs[this.formName].validate()
      if (isFormValid) {
        this.isDialogActive = true
      }
    },
    closeDialog() {
      this.isDialogActive = false
    },
    submitSave() {
      // TODO: fix what happens when the user changes their own name
      this.apiRef
        .update(this.item)
        .then(() => {
          const message = 'User information has been updated successfully.'
          this.showMessage(message)

          // TODO: check if any data changed that might be cached in local/session storage
          // This should only happen if an admin changes her own groups
          // if (this.item.username === this.cachedItem.username) {
          //   // sessionStorage.setItem('groups', res.data.groups)
          //   this.$api.storage.setItem('groups', res.data.groups, 'session')
          //   if (this.$api.auth.isAdmin) {
          //     // sessionStorage.setItem('is-admin', true)
          //     this.$api.storage.setItem('is-admin', true, 'session')
          //   } else {
          //     // sessionStorage.setItem('is-admin', false)
          //     this.$api.storage.setItem('is-admin', false, 'session')
          //   }
          // }

          this.cacheItem()
        })
        .catch((error) => {
          let message = error
          if (error.hasOwnProperty('response') && error.response) {
            if (error.response.data) {
              if (error.response.data.error) {
                // Hand written error
                message = error.response.data.error
              } else {
                // REST framework validation errors
                this.errors = error.response.data
                message = null
              }
            }
          }
          if (message) {
            this.showMessage({ message })
          }
        })
        .finally(() => {
          this.item.changeComment = ''
          // If I've changed my own name
          // TODO: put in check if own name has changed
          // if (this.item.username === this.$api.user.username) {
          //   this.item.userData = JSON.parse(JSON.stringify(this.item.userData))
          // }
        })
    },
    completeAction() {
      this.submit()
      this.closeDialog()
    },
    restore() {
      // cachedItem isn't a User object so can't use .data
      this.item.data = clone(this.cachedItem._data)
      this.clearAllErrors()
    },
    canEdit(field) {
      return this.apiRef.canEditField(field)
    },
    removeGroup(group) {
      const index = this.item.groups.indexOf(group)
      if (index >= 0) this.item.groups.splice(index, 1)
      // remove(this.item.groups, (val) => val === group)
    },
    getChipColorForGroup(group) {
      return this.$api.group.colorForGroup(group)
    },
  },
  computed: {
    hasIFXID() {
      if (!this.item) {
        return false
      }
      return !!this.item.ifxid
    },
  },
}
</script>
<template>
  <v-container v-if="!isLoading && !!item">
    <!-- TODO: this dialog is not appearing properly -->
    <v-container>
      <IFXUserInfoDialog
        :isActive.sync="isDialogActive"
        :changeComment.sync="item.changeComment"
        @complete-action="completeAction"
      ></IFXUserInfoDialog>
      <IFXPageHeader>
        <template #title>{{ item.fullName }}</template>
        <template #actions>
          <IFXLoginIcon v-if="item.isActive !== undefined" :isActive.sync="item.isActive" />
        </template>
        <template #content>
          <IFXItemHistoryDisplay :item="item" />
        </template>
      </IFXPageHeader>
      <v-container v-if="hasIFXID">
        <v-row no-gutters>
          <v-col>
            <p>
              Use this form to view and edit user information. Changes to most fields (except for application Groups)
              will update
              <em><strong>all related accounts</strong></em>
              associated with this user.
            </p>
          </v-col>
        </v-row>
        <v-form @submit.prevent v-model="isValid" autocomplete="off" :ref="formName">
          <v-row>
            <v-col sm="6">
              <v-text-field
                v-model.trim="item.firstName"
                label="First name"
                autocomplete="new-password"
                :error-messages="errors.firstName"
                @focus="clearError('first_name')"
                :disabled="!canEdit('User.firstName')"
                :rules="formRules.generic"
                required
              ></v-text-field>
              <v-text-field
                v-model.trim="item.lastName"
                label="Last name"
                autocomplete="new-password"
                :error-messages="errors.lastName"
                @focus="clearError('last_name')"
                :disabled="!canEdit('User.lastName')"
                :rules="formRules.generic"
                required
              ></v-text-field>
              <v-text-field
                v-model.trim="item.fullName"
                label="Full name"
                autocomplete="new-password"
                :error-messages="errors.fullName"
                @focus="clearError('full_name')"
                :disabled="!canEdit('User.fullName')"
                :rules="formRules.generic"
                required
              ></v-text-field>
            </v-col>
            <v-col sm="6">
              <v-combobox
                v-if="canEdit('User.groups')"
                v-model="item.groups"
                :items="allGroupNames"
                clearable
                multiple
                solo
                label="Groups"
                hint="Groups to which this user belongs."
                persistent-hint
                :error-messages="errors.groups"
              >
                <template #selection="{item}">
                  <v-chip :color="getChipColorForGroup(item)" close @click:close="removeGroup(item)">
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
              <!-- TODO: why v-else? -->
              <div class="items-warning" v-else>{{ data.item.groups.join(', ') || 'No groups' }}</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6">
              <v-text-field
                v-model.trim="item.primaryEmail"
                label="Primary Email"
                autocomplete="new-password"
                :error-messages="errors.primary_email"
                @focus="clearError('primary_email')"
                :disabled="!canEdit('User.primaryEmail')"
                :rules="formRules.email"
                required
              ></v-text-field>
            </v-col>
            <v-col sm="6">
              <v-text-field label="Primary Affiliation" :value="item.primaryAffiliation" disabled></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <IFXItemSelectList
                title="Contacts"
                :items.sync="item.contacts"
                :getEmptyItem="$api.organizationContact.create"
              >
                <template v-slot="{ item }">
                  <IFXSelectableContact :allItems="allContacts" :item="item" :errors="errors" />
                </template>
              </IFXItemSelectList>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <IFXItemSelectList
                title="Affiliations"
                :items.sync="item.affiliations"
                :getEmptyItem="$api.affiliation.create"
              >
                <template v-slot="{ item }">
                  <IFXSelectableAffiliation :allItems="allOrganizationSlugs" :item="item" :errors="errors" />
                </template>
              </IFXItemSelectList>
            </v-col>
          </v-row>
          <IFXPageActionBar btnType="submit" @action="openDialog" :disabled="!isSubmittable"></IFXPageActionBar>
        </v-form>
      </v-container>
      <IFXUserEditWarning v-else :user="item" />
    </v-container>
  </v-container>
</template>

<style scoped>
.items-warning {
  font-style: italic;
  color: grey;
}
</style>
