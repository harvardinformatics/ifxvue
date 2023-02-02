<script>
import IFXItemEditableDetailMixin from '@/components/item/IFXItemEditableDetailMixin'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'

import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXAddUsers from '@/components/organization/IFXAddUsers'
import IFXActivateDeactivateUsers from '@/components/organization/IFXActivateDeactivateUsers'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXOrganizationDetail',
  mixins: [IFXOrganizationMixin, IFXItemEditableDetailMixin],
  components: {
    IFXDeleteItemButton,
    IFXItemDataTable,
    IFXSelectCreateContact,
    IFXContactRoleDisplayEdit,
    IFXPageActionBar,
    IFXAddUsers,
    IFXActivateDeactivateUsers,
  },
  data() {
    return {
      allContacts: [],
      currentContact: {},
      contactDialogOpen: false,
      addContactFormIsValid: false,
      showAddUserModal: false,
      showRevokeUserModal: false,
      showReactivateUserModal: false,
      selected: [],
      selectedUsers: [],
      usersToBeUpdated: [],
      showInactive: false,
      allRoles: [
        { name: 'PI', editable: false },
        { name: 'Lab Manager', editable: false },
        { name: 'Facility Invoice', editable: true },
        { name: 'Facility Invoice CC', editable: true },
      ],
    }
  },
  mounted() {},
  methods: {
    async init() {
      this.item = await this.apiRef.getByID(this.id, true)
      this.cacheItem()
      this.allContacts = await this.$api.contact.getList({ has_name: 'both' })
      const allFacilities = await this.$api.facility.getList()
      allFacilities.forEach((facility) => {
        this.allRoles.push({ name: `Billing Record Review for ${facility.name}`, editable: true })
      })
    },
    showChangeUsers(deactivate = true) {
      this.selectedUsers = this.selected.map((item) => item.user)
      if (deactivate) {
        this.showRevokeUserModal = true
      } else {
        this.showReactivateUserModal = true
      }
    },
    addContact() {
      this.contactDialogOpen = false
      this.currentContact.active = true
      this.item.contacts.push(this.currentContact)
    },
    openContactDialog() {
      this.currentContact = this.$api.organizationContact.create()
      this.currentContact.active = false
      this.currentContact.role = null
      this.currentContact.type = 'Email'
      this.contactDialogOpen = true
    },
    updateContact(contact, index) {
      this.item.contacts.splice(index, 1, contact)
    },
    cancelContact() {
      this.currentContact = this.$api.organizationContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
      this.currentContact.type = 'Email'
    },
    closeMemberDialog() {
      this.showAddUserModal = false
      this.showRevokeUserModal = false
      this.showReactivateUserModal = false
      this.selected = []
    },
    getContactIndicesByRole(role) {
      const indices = []
      this.item.contacts.forEach((contact, index) => {
        if (contact.role === role) {
          indices.push(index)
        }
      })
      return indices
    },
    updateOrg(org) {
      this.item = org
    },
    async addUser(person) {
      // Add this person to the list of users to be updated
      // If they are already there, replace them with the new version
      const foundIndex = this.usersToBeUpdated.findIndex((user) => user.id === person.id)
      if (foundIndex === -1) {
        this.usersToBeUpdated.push(person)
      } else {
        this.usersToBeUpdated.splice(foundIndex, 1)
      }
    },
    async updateUsersAndSubmit() {
      // Only update users if this is not a local organization.
      if (this.item.ifxOrg) {
        // First update all the users to make sure this syncs to Nanites
        const allPromises = []
        for (let i = 0; i < this.usersToBeUpdated.length; i++) {
          const person = this.usersToBeUpdated[i]
          const orgIndex = person.affiliations.findIndex((affiliation) => this.item.slug === affiliation.organization)
          if (orgIndex !== -1) {
            person.affiliations[orgIndex].active = true
            person.changeComment = `Reactivating membership of ${person.fullName} in ${this.item.slug}`
          } else {
            // We need to get the role out of the org's list of users.
            // Since we added the user in IFXAddUsers, they should always be here
            const thisUser = this.item.users.find((user) => user.id === person.id)
            if (thisUser) {
              const params = { active: true, id: this.item.id, organization: this.item.slug, role: thisUser.role }
              person.affiliations.push(params)
              person.changeComment = `Adding ${person.fullName} to ${this.item.slug}`
            }
          }
          const newPromise = this.$api.user.update(person).catch((error) => {
            this.showMessage(error.message)
          })
          allPromises.push(newPromise)
        }
        // Wait for all the promises to resolve
        await Promise.allSettled(allPromises).catch((errors) => {
          errors.forEach((error) => {
            if (error.status === 'rejected') {
              this.showMessage(error.reason)
            }
          })
        })
      }
      this.submitUpdate()
    },
  },
  computed: {
    filteredContacts() {
      return this.allContacts.filter((c) => !this.item.contacts?.some((item) => item.contact.id === c.id))
    },
    userListHeaders() {
      const headers = [
        { text: 'Full Name', value: 'fullName', sortable: true, namedSlot: true, click: true },
        { text: 'Status', value: 'status', sortable: false, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    contactRolesGroups() {
      const groups = []
      if (this.item?.contacts?.length) {
        this.item.contacts.forEach((contact) => {
          if (groups.indexOf(contact.role) === -1) {
            groups.push(contact.role)
          }
        })
      }
      return groups
    },
    filteredUsers() {
      return this.item?.users?.filter((user) => this.showInactive || user.active)
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.slug }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <div class="d-flex flex-row show-inactive">
          <v-checkbox label="Show inactive" v-model="showInactive" class="mr-3 mt-0" dense></v-checkbox>
          <!-- TODO: check why this cannot be edited -->
          <IFXDeleteItemButton v-if="!item.ifxOrg" xSmall :item="item" :apiRef="apiRef" :itemType="itemType" />
        </div>
      </template>
    </IFXPageHeader>
    <v-row dense class="ml-2">
      <v-col>
        <v-row>
          <v-col>
            <h2>Users</h2>
          </v-col>
          <v-col sm="2" align="end">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  fab
                  x-small
                  color="primary"
                  data-cy="add-member-modal"
                  @click.stop="showAddUserModal = true"
                >
                  <v-icon>person_add</v-icon>
                </v-btn>
              </template>
              <span>Add organization users</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2"
                  v-on="on"
                  fab
                  x-small
                  color="error"
                  :disabled="!selected || !selected.length"
                  data-cy="revoke-member-modal"
                  @click="showChangeUsers(true)"
                >
                  <v-icon>mdi-account-multiple-remove</v-icon>
                </v-btn>
              </template>
              <span>{{ `Deactivate organization user${selected.length === 1 ? '' : 's'}` }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2"
                  v-on="on"
                  fab
                  x-small
                  color="green"
                  :disabled="!selected || !selected.length"
                  data-cy="reactivate-member-modal"
                  @click="showChangeUsers(false)"
                >
                  <v-icon>mdi-account-multiple-check</v-icon>
                </v-btn>
              </template>
              <span>{{ `Activate existing organization user${selected.length === 1 ? '' : 's'}` }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col v-if="item && item.users && item.users.length">
            <IFXItemDataTable
              :headers="userListHeaders"
              :items="filteredUsers"
              :showSelect="true"
              itemType="OrganizationUser"
              :hideDefaultFooter="filteredUsers.length < 20"
              :selected.sync="selected"
            >
              <template v-slot:fullName="{ item }">
                <router-link :to="{ name: 'UserDetail', params: { id: item.user.id } }">
                  {{ item.fullName }}
                </router-link>
              </template>
              <template v-slot:status="{ item }">
                <v-tooltip v-if="item.active" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" color="#fcbd01">lightbulb</v-icon>
                  </template>
                  <span>Active member</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" color="#ccc">lightbulb</v-icon>
                  </template>
                  <span>Former member</span>
                </v-tooltip>
                <v-tooltip top v-if="item.role == 'pi'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="green" v-on="on" v-bind="attrs">school</v-icon>
                  </template>
                  <span>PI</span>
                </v-tooltip>
                <v-tooltip top v-if="item.role == 'lab_manager'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="green" v-on="on" v-bind="attrs">mdi-clipboard-account</v-icon>
                  </template>
                  <span>Lab Admin</span>
                </v-tooltip>
                <v-tooltip top v-if="item.role == 'approver'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="green" v-on="on" v-bind="attrs">mdi-account-check</v-icon>
                  </template>
                  <span>Approver</span>
                </v-tooltip>
              </template>
            </IFXItemDataTable>
          </v-col>
          <v-col v-else>No users</v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <h2>Contacts</h2>
          </v-col>
          <v-col sm="1" align="end">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <IFXButton v-on="on" v-bind="attrs" btnType="add" xSmall @action="openContactDialog()" />
              </template>
              <span>Add new contact</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row v-for="(contactGroupName, index) in contactRolesGroups" :key="index" dense>
          <v-col>
            <div
              v-for="contactIndex in getContactIndicesByRole(contactGroupName)"
              :key="`${contactGroupName}-${contactIndex}`"
            >
              <IFXContactRoleDisplayEdit
                v-if="item.contacts[contactIndex].active || showInactive"
                :allRoles="allRoles"
                :filterRoles="false"
                :contact="item.contacts[contactIndex]"
                @change="updateContact(item.contacts[contactIndex], contactIndex)"
              />
            </div>
          </v-col>
          <div class="w-full">
            <v-divider></v-divider>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <IFXPageActionBar
      class="mt-0"
      btnType="submit"
      :disabled="!isSubmittable"
      @action="updateUsersAndSubmit"
    ></IFXPageActionBar>
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
            :allRoles="allRoles"
            :filterRoles="false"
            :item.sync="currentContact"
            :errors="errors"
            :valid.sync="addContactFormIsValid"
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-start pb-3">
          <v-btn small text class="ml-2" color="secondary" @click="contactDialogOpen = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn small text class="mr-2" color="secondary" @click="cancelContact">Clear</v-btn>
          <v-btn small text class="mr-2" :disabled="!addContactFormIsValid" color="primary" @click="addContact()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <IFXAddUsers
      v-if="showAddUserModal"
      v-model="item"
      :showModal.sync="showAddUserModal"
      :itemType="user"
      :allowSetPrimaryAffiliation="false"
      @close="closeMemberDialog()"
      @update="updateOrg"
      @user="addUser"
    ></IFXAddUsers>
    <IFXActivateDeactivateUsers
      v-if="showRevokeUserModal"
      v-model="selectedUsers"
      :activate="false"
      :organization="item"
      :showModal="showRevokeUserModal"
      @close="closeMemberDialog()"
      @update="updateOrg"
    ></IFXActivateDeactivateUsers>
    <IFXActivateDeactivateUsers
      v-if="showReactivateUserModal"
      v-model="selectedUsers"
      :activate="true"
      :organization="item"
      :showModal="showReactivateUserModal"
      @close="closeMemberDialog()"
      @update="updateOrg"
    ></IFXActivateDeactivateUsers>
  </v-container>
</template>
<style scoped>
.w-full {
  width: 100%;
}
.show-inactive .v-messages theme--light {
  display: none;
}
</style>
