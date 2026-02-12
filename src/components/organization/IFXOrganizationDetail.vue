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
        { name: 'Facility Primary Contact', editable: true },
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
      this.contactDialogOpen = true
    },
    updateContact(contact, index) {
      this.item.contacts.splice(index, 1, contact)
    },
    cancelContact() {
      this.currentContact = this.$api.organizationContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
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
        if (contact.role === role && (this.showInactive ? true : contact.active)) {
          indices.push(index)
        }
      })
      return indices
    },
    updateOrg(org) {
      this.item = org
    },
    async addUser(person) {
      const foundIndex = this.usersToBeUpdated.findIndex((user) => user.id === person.id)
      if (foundIndex === -1) {
        this.usersToBeUpdated.push(person)
      } else {
        this.usersToBeUpdated.splice(foundIndex, 1)
      }
    },
    async updateUsersAndSubmit() {
      if (this.item.ifxOrg) {
        const allPromises = []
        for (let i = 0; i < this.usersToBeUpdated.length; i++) {
          const person = this.usersToBeUpdated[i]
          const orgIndex = person.affiliations.findIndex((affiliation) => this.item.slug === affiliation.organization)
          if (orgIndex !== -1) {
            person.affiliations[orgIndex].active = true
            person.changeComment = `Reactivating membership of ${person.fullName} in ${this.item.slug}`
          } else {
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
    userListHeaders() {
      const headers = [
        { title: 'Full Name', key: 'fullName', sortable: true, namedSlot: true, click: true },
        { title: 'Status', key: 'status', sortable: false, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
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
          <v-checkbox
            label="Show inactive"
            v-model="showInactive"
            class="mr-3 mt-0"
            density="compact"
            hide-details
          />
          <IFXDeleteItemButton v-if="!item.ifxOrg" size="x-small" :item="item" :apiRef="apiRef" :itemType="itemType" />
        </div>
      </template>
    </IFXPageHeader>
    <v-row dense v-if="isSubmittable">
      <v-col>
        <v-alert elevation="2" density="compact" border="start" color="warning" icon="mdi-alert-circle-outline">
          <v-row dense>
            <v-col>
              <h3 class="font-weight-medium">You have unsaved changes!</h3>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>
    <v-row dense class="ml-2">
      <v-col>
        <v-row>
          <v-col>
            <h2>Users</h2>
          </v-col>
          <v-col sm="2" align="end">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="x-small"
                  color="primary"
                  data-cy="add-member-modal"
                  @click.stop="showAddUserModal = true"
                >
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
              <span>Add organization users</span>
            </v-tooltip>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="ml-2"
                  v-bind="props"
                  icon
                  size="x-small"
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
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="ml-2"
                  v-bind="props"
                  icon
                  size="x-small"
                  color="success"
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
              v-model:selected="selected"
            >
              <template #fullName="{ item }">
                <router-link :to="{ name: 'UserDetail', params: { id: item.user.id } }">
                  {{ item.fullName }}
                </router-link>
              </template>
              <template #status="{ item }">
                <v-tooltip v-if="item.active" location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" color="#fcbd01">mdi-lightbulb</v-icon>
                  </template>
                  <span>Active member</span>
                </v-tooltip>
                <v-tooltip v-else location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" color="#ccc">mdi-lightbulb-outline</v-icon>
                  </template>
                  <span>Former member</span>
                </v-tooltip>
                <v-tooltip location="top" v-if="item.role == 'pi'">
                  <template v-slot:activator="{ props }">
                    <v-icon color="green" v-bind="props">mdi-school</v-icon>
                  </template>
                  <span>PI</span>
                </v-tooltip>
                <v-tooltip location="top" v-if="item.role == 'lab_manager'">
                  <template v-slot:activator="{ props }">
                    <v-icon color="green" v-bind="props">mdi-clipboard-account</v-icon>
                  </template>
                  <span>Lab Admin</span>
                </v-tooltip>
                <v-tooltip location="top" v-if="item.role == 'approver'">
                  <template v-slot:activator="{ props }">
                    <v-icon color="green" v-bind="props">mdi-account-check</v-icon>
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
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <IFXButton v-bind="props" btnType="add" size="x-small" @action="openContactDialog()" />
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
          <div class="w-full" v-if="getContactIndicesByRole(contactGroupName).length !== 0">
            <v-divider />
          </div>
        </v-row>
      </v-col>
    </v-row>
    <IFXPageActionBar
      class="mt-0"
      btnType="submit"
      :disabled="!isSubmittable"
      @action="updateUsersAndSubmit"
      :submitting="submitting"
    />

    <!-- Add Contact Dialog -->
    <v-dialog v-model="contactDialogOpen" v-if="contactDialogOpen" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h6">Add Contact</span>
          <v-spacer />
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="contactDialogOpen = false"
                data-cy="contact-dialog-close"
                v-bind="props"
              />
            </template>
            <span>Cancel</span>
          </v-tooltip>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <IFXSelectCreateContact
            :allItems="allContacts"
            :allRoles="allRoles"
            :filterRoles="false"
            v-model:item="currentContact"
            :errors="errors"
            v-model:valid="addContactFormIsValid"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn variant="text" color="secondary" @click="contactDialogOpen = false">Close</v-btn>
          <v-spacer />
          <v-btn variant="text" color="secondary" @click="cancelContact">Clear</v-btn>
          <v-btn variant="text" :disabled="!addContactFormIsValid" color="primary" @click="addContact()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Users Modal -->
    <IFXAddUsers
      v-if="showAddUserModal"
      v-model="item"
      v-model:showModal="showAddUserModal"
      itemType="user"
      :allowSetPrimaryAffiliation="false"
      @close="closeMemberDialog()"
      @update="updateOrg"
      @user="addUser"
    />

    <!-- Deactivate Users Modal -->
    <IFXActivateDeactivateUsers
      v-if="showRevokeUserModal"
      v-model="selectedUsers"
      :activate="false"
      :organization="item"
      :showModal="showRevokeUserModal"
      @close="closeMemberDialog()"
      @update="updateOrg"
    />

    <!-- Reactivate Users Modal -->
    <IFXActivateDeactivateUsers
      v-if="showReactivateUserModal"
      v-model="selectedUsers"
      :activate="true"
      :organization="item"
      :showModal="showReactivateUserModal"
      @close="closeMemberDialog()"
      @update="updateOrg"
    />
  </v-container>
</template>

<style scoped>
.w-full {
  width: 100%;
}
.show-inactive :deep(.v-messages) {
  display: none;
}
</style>