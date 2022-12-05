<script>
import { mapActions } from 'vuex'

import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'
import IFXUserEdit from '@/components/user/IFXUserEdit'

import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
// import IFXUserEditWarning from '@/components/user/IFXUserEditWarning'
import IFXUserInfoDialog from '@/components/user/IFXUserInfoDialog'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'
import IFXAffiliationRoleDisplayEdit from '@/components/contact/IFXAffiliationRoleDisplayEdit'
// import IFXSelectableAffiliation from '@/components/affiliation/IFXSelectableAffiliation'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
// import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'IFXUserDetail',
  mixins: [IFXUserMixin, IFXItemDetailMixin, IFXItemCreateEditMixin],
  components: {
    IFXLoginIcon,
    IFXItemHistoryDisplay,
    IFXUserEdit,
    // IFXUserEditWarning,
    IFXUserInfoDialog,
    IFXSelectCreateContact,
    // IFXSelectableAffiliation,
    IFXPageActionBar,
    IFXContactRoleDisplayEdit,
    IFXAffiliationRoleDisplayEdit,
  },
  data() {
    return {
      allGroupNames: [],
      allContacts: [],
      allOrganizationSlugs: [],
      currentContact: {},
      allRoles: ['Additional Email', 'Work Phone', 'Additional Phone', 'Additional Contact'],
      dialogSection: 'all',
      changeDialogActive: false,
      userInfoDialogOpen: false,
      contactDialogOpen: false,
      addContactFormIsValid: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.apiRef.getByID(this.id, true)
      this.allContacts = await this.$api.contact.getList({ has_name: false })
      this.allGroupNames = await this.$api.group.getNames()
      const organizations = await this.$api.organization.getNames()
      this.allOrganizationSlugs = organizations.map((o) => o.slug)
    },
    completeAction() {
      this.submitUpdate()
      this.changeDialogActive = false
    },
    openUserInfoDialog(section) {
      this.dialogSection = section
      this.userInfoDialogOpen = true
    },
    closeUserInfoDialog() {
      this.dialogSection = 'all'
      this.userInfoDialogOpen = false
    },
    closeContactDialog() {
      this.contactDialogOpen = false
      if (this.currentContact.id) {
        // this is an update. Find the contact and update it
        const contactIndex = this.item.contacts.findIndex((c) => c.id === this.currentContact.id)
        if (contactIndex) {
          this.items.contacts.splice(contactIndex, 1, this.currentContact)
        }
      } else {
        // this is a new contact. Set it to active and add it to the list
        this.$set(this.currentContact, 'active', true)
        this.item.contacts.push(this.currentContact)
      }
      // this.submitUpdate()
    },
    setContactActiveState(contact, active) {
      // Find the contact and set it to inactive
      const contactIndex = this.item.contacts.findIndex((c) => c.id === contact.id)
      if (contactIndex) {
        this.item.contacts[contactIndex].active = active
        // this.submitUpdate()
      }
    },
    addContact() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
      this.contactDialogOpen = true
    },
    saveContact() {
      const contactIndex = this.item.contacts.findIndex((c) => c.id === this.currentContact.id)
      if (contactIndex) {
        // If this contact already exists, update it
        this.item.contacts[contactIndex].active = this.currentContact.active
      } else {
        // Otherwise, add it
        this.item.contacts.push(this.currentContact)
      }
      this.contactDialogOpen = false
    },
    updateContact(contact) {
      const contactIndex = this.item.contacts.findIndex((c) => c.id === contact.id)
      if (contactIndex) {
        this.item.contacts.splice(contactIndex, 1, contact)
      }
    },
    updateAffiliation(affiliation) {
      const affiliationIndex = this.item.affiliations.findIndex((c) => c.id === affiliation.id)
      if (affiliationIndex) {
        this.item.affiliations.splice(affiliationIndex, 1, affiliation)
      }
    },
    cancelContact() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
    },
    submitUpdate() {
      this.apiRef
        .update(this.item)
        .then(async () => {
          const message = `${this.itemType} updated successfully.`
          this.showMessage(message)
        })
        .catch((error) => {
          const { response } = error
          if (response) {
            this.errors = response.data
          }
          this.showMessage(error)
        })
    },
  },
  computed: {
    appName() {
      return this.$api.vars.appName
    },
    areAnyAccountsPresent() {
      return this.item.accounts?.length || this.item.productAccounts?.length
    },
    areAccountsPresent() {
      return this.item.accounts?.length
    },
    areProductAccountsPresent() {
      return this.item.productAccounts?.length
    },
    areContactsPresent() {
      return this.item.contacts?.length
    },
    areAffiliationsPresent() {
      return this.item.affiliations?.length
    },
    areGroupsPresent() {
      return this.item.groups?.length
    },
    // addContactButtonEnabled() {
    //   return this.currentContact.role && this.currentContact.contact?.detail
    // },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXUserInfoDialog
      :isActive.sync="changeDialogActive"
      :changeComment.sync="item.changeComment"
      @complete-action="completeAction"
    ></IFXUserInfoDialog>
    <IFXPageHeader>
      <template #title>{{ item.fullName || id }}</template>
      <template #actions>
        <IFXLoginIcon v-if="item.isActive !== undefined" :isActive="item.isActive" />
      </template>
      <template #content>
        <IFXItemHistoryDisplay :item="item" />
      </template>
    </IFXPageHeader>
    <v-container>
      <v-row dense wrap>
        <v-col sm="4" md="3">
          <h3>First Name</h3>
        </v-col>
        <v-col>
          {{ item.firstName }}
        </v-col>
        <v-col sm="4" md="3">
          <h3>Last Name</h3>
        </v-col>
        <v-col>
          {{ item.lastName }}
        </v-col>
        <v-col sm="1" align="end">
          <IFXButton btnType="edit" xSmall @action="openUserInfoDialog('user')" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col sm="4" md="3">
          <h3>Primary Affiliation</h3>
        </v-col>
        <v-col>
          {{ item.primaryAffiliation }}
        </v-col>
      </v-row>
      <v-row dense v-if="areGroupsPresent">
        <v-col sm="4" md="3">
          <h3>Authorization Groups</h3>
        </v-col>
        <v-col>
          {{ item.groups.join(', ') }}
        </v-col>
      </v-row>
      <v-row align="start" dense>
        <v-col sm="4" md="3">
          <h3>Primary Email</h3>
        </v-col>
        <v-col>
          <v-row dense>
            <v-col>
              <a :href="`mailto:${item.primaryEmail}`">{{ item.primaryEmail }}</a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <span v-if="areContactsPresent">
        <v-divider class="my-2"></v-divider>
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Contacts</h3>
          </v-col>
          <v-col>
            <div v-for="contact in item.contacts" :key="contact.id">
              <IFXContactRoleDisplayEdit :contact="contact" @update="updateContact"  v-if="contact.role !== 'Primary Email'"/>
            </div>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="add" xSmall @action="addContact()" />
          </v-col>
        </v-row>
      </span>
      <!-- </v-col> -->
      <span v-if="areAffiliationsPresent">
        <v-divider class="my-2"></v-divider>
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Affiliations</h3>
          </v-col>
          <v-col>
            <span class="d-flex flex-column">
              <div v-for="affiliation in item.affiliations" :key="affiliation.id" class="d-flex align-center mt-1">
              <IFXAffiliationRoleDisplayEdit :affiliation="affiliation" @update="updateAffiliation" />
                <!-- <span>{{ affiliation.role | affiliationRoleDisplay }} of {{ affiliation.organization }}</span>
                <v-col>
                  <v-icon class="ml-2" small color="red" @click.stop="deactivateAffiliation(affiliation)">
                    mdi-delete
                  </v-icon>
                </v-col> -->
              </div>
            </span>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="add" xSmall @action="openUserInfoDialog('affiliations')" />
          </v-col>
        </v-row>
      </span>
      <v-divider class="my-2"></v-divider>
      <v-row dense v-if="areAnyAccountsPresent">
        <v-col sm="4" md="3">
          <h3>Expense code / PO Authorizations</h3>
        </v-col>
        <v-col>
          <span v-if="areAccountsPresent" class="d-flex flex-column">
            <div v-for="account in item.accounts" :key="account.id" class="d-flex align-center mt-1">
              <span>{{ account.account.slug }} for any facility product</span>
            </div>
          </span>
          <span v-if="areProductAccountsPresent" class="d-flex flex-column">
            <div v-for="account in item.productAccounts" :key="account.id" class="d-flex align-center mt-1">
              <span>{{ account.account.slug }} for {{ account.product.name }}</span>
            </div>
          </span>
        </v-col>
      </v-row>
      <IFXPageActionBar btnType="submit" @action="submitUpdate" :disabled="!isSubmittable"></IFXPageActionBar>
      <v-dialog v-model="userInfoDialogOpen" v-if="userInfoDialogOpen" max-width="90vw" persistent>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  @click.stop="closeUserInfoDialog"
                  data-cy="user-info-dialog-close"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <IFXUserEdit :section="dialogSection" :id="id" :inDialog="true"></IFXUserEdit>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="contactDialogOpen" v-if="contactDialogOpen" max-width="600px" persistent>
        <v-card>
          <v-card-title>
            Add Contact
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  @click.stop="contactDialogOpen = false"
                  data-cy="contact-dialog-close"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text class="pb-0">
            <IFXSelectCreateContact :allItems="allContacts" :item.sync="currentContact" :errors="errors" :valid.sync="addContactFormIsValid"/>
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3">
            <v-btn small outlined class="mr-2" color="secondary" @click.stop="cancelContact">Clear</v-btn>
            <v-btn small class="mr-2" :disabled="!addContactFormIsValid" color="primary" @click.stop="closeContactDialog">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>

<style>
.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.data-item {
  padding-top: 1px;
  padding-bottom: 1px;
}

.key-background {
  background-color: #90a4ae;
  border-radius: 50%;
  padding: 5px;
}
</style>
