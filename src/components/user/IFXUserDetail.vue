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
import IFXRoleDisplayEdit from '@/components/contact/IFXRoleDisplayEdit'
// import IFXSelectableAffiliation from '@/components/affiliation/IFXSelectableAffiliation'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import cloneDeep from 'lodash/cloneDeep'

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
    IFXRoleDisplayEdit
  },
  data() {
    return {
      allGroupNames: [],
      allContacts: [],
      allOrganizationSlugs: [],
      currentContact: {},
      allRoles: ['Additional Email', 'Work Phone', 'Additional Phone'],
      dialogSection: 'all',
      changeDialogActive: false,
      userInfoDialogOpen: false,
      contactDialogOpen: false,
      roleEditingEnabled: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      // try {
      //   const filteredContacts = this.item.contacts.filter((c) => c.contact.detail !== this.item.email)
      //   this.$set(this.item, 'contacts', [])
      //   filteredContacts.forEach((fc) => this.item.contacts.push(fc))
      // } catch (error) {
      //   this.showMessage(error)
      //   this.rtr.push({ name: 'Home' })
      // }
      this.item = await this.apiRef.getByID(this.id, true)
      this.allContacts = await this.$api.contact.getList({ has_name: false })
      this.allGroupNames = await this.$api.group.getNames()
      const organizations = await this.$api.organization.getNames()
      this.allOrganizationSlugs = organizations.map((o) => o.slug)
    },
    // async getItem() {
    //   const params = {
    //     include_disabled: true,
    //     exclude_application_users: false,
    //   }
    //   return this.apiRef.getByID(this.id, params)
    // },
    // checkValidForm() {
    //   this.$refs[this.formName].validate()
    // },
    // additionalEmailList() {
    //   const emails = []
    //   if (this.item.contacts) {
    //     this.item.contacts.forEach((contact) => {
    //       if (contact.role !== 'Primary Email' && contact.type === 'Email') {
    //         emails.push(
    //           `<div class="row row--dense"><div class="col col-md-4">${contact.role}</div><div class="col"><a href="mailto:${contact.detail}">${contact.detail}</a></div></div>`
    //         )
    //       }
    //     })
    //   }
    //   return emails.join('')
    // },
    // additionalContactList() {
    //   const contacts = []
    //   if (this.item.contacts) {
    //     this.item.contacts.forEach((contact) => {
    //       if (contact.type !== 'Email') {
    //         contacts.push(
    //           `<div class="row row--dense"><div class="col col-md-4">${contact.role}</div><div class="col">${contact.detail}</div></div>`
    //         )
    //       }
    //     })
    //   }
    //   return contacts.join('')
    // },
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
    editContact(contact) {
      this.currentContact = cloneDeep(contact)
      this.roleEditingEnabled = !this.roleEditingEnabled
    },
    updateContact(contact) {
      const contactIndex = this.item.contacts.findIndex((c) => c.id === contact.id)
      if (contactIndex) {
        this.item.contacts.splice(contactIndex, 1, contact)
      }
      this.roleEditingEnabled = false
    },
    cancelContact() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
      // console.log(this.currentContact)
      this.roleEditingEnabled = false
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
    addContactButtonEnabled() {
      return this.currentContact.role && this.currentContact.contact?.detail
    }
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
        <!-- <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" /> -->
      </template>
      <template #content>
        <IFXItemHistoryDisplay :item="item" />
      </template>
    </IFXPageHeader>
    <v-container>
      <!-- <v-row no-gutters> -->
      <v-row dense wrap>
        <!-- <v-col>
      <v-row dense wrap> -->
        <v-col sm="4" md="3">
          <h3>First Name</h3>
        </v-col>
        <v-col>
          {{ item.firstName }}
        </v-col>
        <!-- </v-row>
      <v-row dense> -->
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
          <!-- <span class="d-flex flex-column">
            <div v-for="group in item.groups" :key="group" class="d-flex align-center mt-1">
              <span>{{ group }}</span>
            </div>
          </span> -->

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
          <!-- <span v-if="areContactsPresent">
            <v-divider class="my-2"></v-divider>
            <div v-for="contact in item.contacts" :key="contact.id">
              <v-row dense v-if="contact.role !== 'Primary Email' && contact.type === 'Email'">
                <v-col
                  :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !contact.active }"
                  md="4"
                >
                  {{ contact.role }}
                </v-col>
                <v-col
                  :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !contact.active }"
                >
                  <a :href="`mailto:${contact.detail}`">{{ contact.detail }}</a>
                </v-col>
                <v-col>
                  <v-icon
                    small
                    color="red"
                    class="ml-2"
                    v-if="contact.active"
                    @click.stop="setContactActiveState(contact, false)"
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon v-else small class="ml-2" color="green" @click.stop="setContactActiveState(contact, true)">
                    mdi-delete-restore
                  </v-icon>
                </v-col>
              </v-row>
            </div>
          </span> -->
          <!-- <span v-html="additionalEmailList()"></span> -->
        </v-col>
        <!-- <v-col sm="1" align="end">
          <IFXButton btnType="add" xSmall @action="addContact()" />
        </v-col> -->
      </v-row>
      <span v-if="areContactsPresent">
        <v-divider class="my-2"></v-divider>
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Contacts</h3>
          </v-col>
          <v-col>
            <div v-for="contact in item.contacts" :key="contact.id">
              <IFXRoleDisplayEdit :contact="contact" @update="updateContact"  v-if="contact.role !== 'Primary Email'"/>
               <!-- <v-row dense>
               <v-col md="4" v-if="roleEditingEnabled">
                  <v-select
                    v-model.trim="contact.role"
                    :items="allRoles"
                    label="Role"
                    :rules="formRules.generic"
                    required
                  ></v-select>
                  <v-btn x-small outlined class="mr-2" color="secondary" @click.stop="cancelContact">Cancel</v-btn>
                  <v-btn x-small class="mr-2" color="primary" @click.stop="updateContact(contact)">Save</v-btn>
                </v-col>
                <v-col
                  md="4"
                  v-else
                  :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !contact.active }"
                >
                  {{ contact.role }}
                </v-col>
                <v-col
                  :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !contact.active }"
                >
                  <a :href="`mailto:${contact.detail}`">{{ contact.detail }}</a>
                </v-col>
                <v-col>
                  <v-icon
                    class="ml-2"
                    small
                    color="red"
                    @click.stop="setContactActiveState(contact, false)"
                    v-if="contact.active"
                    :disabled="roleEditingEnabled"
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon class="ml-2" small color="green" @click.stop="setContactActiveState(contact, true)" v-else>
                    mdi-delete-restore
                  </v-icon>
                  <v-icon v-if="contact.active" class="ml-2" small color="primary" @click.stop="editContact(contact)">
                    mdi-pencil
                  </v-icon>
                </v-col>
              </v-row> -->
            </div>
            <!-- <span v-html="additionalContactList()"></span> -->
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
                <span>{{ affiliation.role | affiliationRoleDisplay }} of {{ affiliation.organization }}</span>
                <v-col>
                  <v-icon class="ml-2" small color="red" @click.stop="removeaffiliation(affiliation)">
                    mdi-delete
                  </v-icon>
                  <!-- <v-icon class="ml-2" small color="primary" @click.stop="editAffiliation(affiliation)">
                    mdi-pencil
                  </v-icon> -->
                </v-col>
              </div>
            </span>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="add" xSmall @action="openUserInfoDialog('affiliations')" />
          </v-col>
        </v-row>
      </span>
      <!-- </v-row> -->
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
            <IFXSelectCreateContact :allItems="allContacts" :item.sync="currentContact" :errors="errors" />
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3">
            <v-btn small outlined class="mr-2" color="secondary" @click.stop="cancelContact">Clear</v-btn>
            <v-btn small class="mr-2" :disabled="!addContactButtonEnabled" color="primary" @click.stop="closeContactDialog">Add</v-btn>
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
