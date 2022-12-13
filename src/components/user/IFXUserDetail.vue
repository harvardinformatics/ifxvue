<script>
import { mapActions } from 'vuex'

import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'
import IFXUserInfoEdit from '@/components/user/IFXUserInfoEdit'

import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXUserInfoDialog from '@/components/user/IFXUserInfoDialog'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXSelectAffiliation from '@/components/affiliation/IFXSelectAffiliation'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'
import IFXAffiliationRoleDisplayEdit from '@/components/contact/IFXAffiliationRoleDisplayEdit'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'IFXUserDetail',
  mixins: [IFXUserMixin, IFXItemDetailMixin, IFXItemCreateEditMixin],
  components: {
    IFXLoginIcon,
    IFXItemHistoryDisplay,
    IFXUserInfoEdit,
    IFXUserInfoDialog,
    IFXSelectCreateContact,
    IFXSelectAffiliation,
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
      newAffiliation: {},
      itemCopy: {},
      changeDialogActive: false,
      userInfoDialogOpen: false,
      userInfoDialogValid: false,
      contactDialogOpen: false,
      addContactFormIsValid: false,
      affiliationDialogOpen: false,
      addAffiliationFormIsValid: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.apiRef.getByID(this.id, true)
      this.cacheItem()
      this.allContacts = await this.$api.contact.getList({ has_name: false })
      this.allGroupNames = await this.$api.group.getNames()
      const organizations = await this.$api.organization.getNames()
      this.allOrganizationSlugs = organizations.map((o) => o.slug)
    },
    openCommentDialog() {
      this.changeDialogActive = true
    },
    completeAction() {
      this.submitUpdate()
      this.changeDialogActive = false
    },
    openUserInfoDialog() {
      this.itemCopy = cloneDeep(this.item)
      this.userInfoDialogOpen = true
    },
    closeUserInfoDialog() {
      this.item = cloneDeep(this.itemCopy)
      this.userInfoDialogOpen = false
    },
    cancelUserInfoDialog() {
      this.itemCopy = {}
      this.userInfoDialogOpen = false
    },
    addContact() {
      this.contactDialogOpen = false
      this.currentContact.active = true
      this.item.contacts.push(this.currentContact)
    },
    openContactDialog() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.active = false
      this.currentContact.role = null
      this.contactDialogOpen = true
    },
    updateContact(contact, index) {
      this.item.contacts.splice(index, 1, contact)
    },
    cancelContact() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
    },
    updateAffiliation(affiliation, index) {
      this.item.affiliations.splice(index, 1, affiliation)
    },
    openAffiliationDialog() {
      this.newAffiliation = this.$api.affiliation.create()
      this.newAffiliation.data.role = null
      this.newAffiliation.data.active = false
      this.affiliationDialogOpen = true
    },
    cancelAffiliation() {
      this.newAffiliation = this.$api.affiliation.create()
      this.newAffiliation.role = null
      this.newAffiliation.active = false
    },
    addAffiliation() {
      this.affiliationDialogOpen = false
      this.newAffiliation.active = true
      this.item.affiliations.push(this.newAffiliation)
    },
    canEdit(field) {
      return this.apiRef.canEditField(field)
    },
    removeGroup(group) {
      const index = this.item.groups.indexOf(group)
      if (index >= 0) this.item.groups.splice(index, 1)
    },
    getChipColorForGroup(group) {
      return this.$api.group.colorForGroup(group)
    },
  },
  computed: {
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
    filteredContacts() {
      return this.allContacts.filter((c) => !this.item.contacts?.some((item) => item.contact.id === c.id))
    },
    filteredOrgSlugs() {
      return this.allOrganizationSlugs.filter(
        (slug) => !this.item.affiliations?.some((item) => item.organization === slug)
      )
    },
    isSubmittable() {
      return this.hasItemChanged()
    },
    isUserInfoEdittable() {
      return this.item && this.item.username && !!this.item.ifxid
    },
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
        <IFXLoginIcon v-if="item.isActive !== undefined" :isActive.sync="item.isActive" />
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
        <v-col sm="1" align="end">
          <IFXButton btnType="edit" xSmall @action="openUserInfoDialog" v-if="isUserInfoEdittable" />
        </v-col>
      </v-row>
      <v-row dense class="mt-n2">
        <v-col sm="4" md="3">
          <h3>Last Name</h3>
        </v-col>
        <v-col>
          {{ item.lastName }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col sm="4" md="3">
          <h3>Primary Affiliation</h3>
        </v-col>
        <v-col>
          {{ item.primaryAffiliation | orgNameFromSlug }}
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
            <div v-for="(contact, index) in item.contacts" :key="index">
              <IFXContactRoleDisplayEdit
                :contact="contact"
                @update="updateContact(contact, index)"
                v-if="contact.role !== 'Primary Email'"
              />
            </div>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="add" xSmall @action="openContactDialog()" />
          </v-col>
        </v-row>
      </span>
      <span v-if="areAffiliationsPresent">
        <v-divider class="my-2"></v-divider>
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Affiliations</h3>
          </v-col>
          <v-col>
            <span class="d-flex flex-column">
              <div v-for="(affiliation, index) in item.affiliations" :key="index" class="d-flex align-center mt-1">
                <IFXAffiliationRoleDisplayEdit
                  :affiliation="affiliation"
                  @update="updateAffiliation(affiliation, index)"
                />
              </div>
            </span>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="add" xSmall @action="openAffiliationDialog()" />
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
      <IFXPageActionBar btnType="submit" @action="openCommentDialog" :disabled="!isSubmittable"></IFXPageActionBar>
      <v-dialog v-model="userInfoDialogOpen" v-if="userInfoDialogOpen" max-width="80vw" persistent>
        <v-card>
          <v-card-title>
            Edit User Info
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  @click="cancelUserInfoDialog"
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
            <IFXUserInfoEdit
              :item.sync="itemCopy"
              :errors="errors"
              :allGroupNames="allGroupNames"
              :valid.sync="userInfoDialogValid"
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3">
            <v-btn small class="mr-2" text color="secondary" @click="cancelUserInfoDialog">Close</v-btn>
            <v-btn
              small
              class="mr-2"
              text
              :disabled="!userInfoDialogValid"
              color="primary"
              @click="closeUserInfoDialog"
            >
              Update
            </v-btn>
          </v-card-actions>
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
                  @click="contactDialogOpen = false"
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
            <IFXSelectCreateContact
              :allItems="filteredContacts"
              :item.sync="currentContact"
              :errors="errors"
              :valid.sync="addContactFormIsValid"
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-start pb-3">
            <v-btn small text class="ml-2" color="secondary" @click="contactDialogOpen = false">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn small text class="mr-2" color="secondary" @click="cancelContact">Clear</v-btn>
            <v-btn small class="mr-2" :disabled="!addContactFormIsValid" color="primary" @click="addContact()">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="affiliationDialogOpen" v-if="affiliationDialogOpen" max-width="800px" persistent>
        <v-card>
          <v-card-title>
            Add Affiliation
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  @click="affiliationDialogOpen = false"
                  data-cy="affiliation-dialog-close"
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
            <IFXSelectAffiliation
              :allItems="filteredOrgSlugs"
              :item.sync="newAffiliation"
              :errors="errors"
              :valid.sync="addAffiliationFormIsValid"
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3">
            <v-btn small text class="ml-2" color="secondary" @click="affiliationDialogOpen = false">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn small text class="mr-2" color="secondary" @click="cancelAffiliation">Clear</v-btn>
            <v-btn small text class="mr-2" :disabled="!addAffiliationFormIsValid" color="primary" @click="addAffiliation()">
              Add
            </v-btn>
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
.items-warning {
  font-style: italic;
  color: grey;
}
</style>
