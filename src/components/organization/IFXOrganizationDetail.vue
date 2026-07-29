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
      allOrganizations: [],
      currentContact: {},
      contactDialogOpen: false,
      addContactFormIsValid: false,
      organizationDetailsFormIsValid: false,
      showAddUserModal: false,
      showRevokeUserModal: false,
      showReactivateUserModal: false,
      showEditDetailModal: false,
      name: null,
      rank: null,
      customerId: null,
      addressId: null,
      parentSlugs: [],
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
      this.$api.contact.getList({ has_name: 'both' }).then((res) => {
        this.allContacts = res
      })
      this.$api.facility.getList().then((allFacilities) => {
        allFacilities.forEach((facility) => {
          this.allRoles.push({ name: `Billing Record Review for ${facility.name}`, editable: true })
        })
      })
      this.$api.organization.getSkinnyList().then((res) => {
        this.allOrganizations = res
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
        // Respect the showInactive setting
        if (contact.role === role && (this.showInactive ? true : contact.active)) {
          indices.push(index)
        }
      })
      return indices
    },
    openDetails() {
      this.customerId = this.item.customerId
      this.addressId = this.item.addressId
      this.name = this.item.name
      this.rank = this.item.rank
      this.parentSlugs = this.item.parents || []
      this.showEditDetailModal = true
    },
    updateDetails() {
      // We only have two fields, so we can just update them directly on the item and submit the whole org
      // instead of making a separate API call just for these details.
      this.item.customerId = this.customerId || null
      this.item.addressId = this.addressId || null
      this.item.name = this.name || null
      this.item.rank = this.rank || null
      this.item.parents = this.parentSlugs || []
      this.showEditDetailModal = false
    },
    cancelDetails() {
      this.customerId = null
      this.addressId = null
      this.name = null
      this.rank = null
      this.parentSlugs = []
      this.showEditDetailModal = false
    },
    updateOrg(org) {
      this.item = org
    },
    parentNames(item) {
      if (item.parents && item.parents.length) {
        return item.parents.map((parent) => this.$options.filters.orgNameFromSlug(parent)).join('<br/>')
      }
      return ''
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
    <v-row dense v-if="isSubmittable">
      <v-col>
        <v-alert elevation="2" dense border="left" light color="warning" icon="mdi-alert-circle-outline">
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
            <h2>Details</h2>
          </v-col>
          <v-col align="end">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-2"
                  v-on="on"
                  fab
                  x-small
                  color="primary"
                  data-cy="edit-ar-details-modal"
                  @click.stop="openDetails()"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Change Organization Details</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row dense justify="start" v-if="item.name">
          <v-col class="ml-4 font-weight-bold" cols="2">Name</v-col>
          <v-col>
            {{ item.name }}
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row dense justify="start" v-if="item.rank">
          <v-col class="ml-4 font-weight-bold" cols="2">Rank</v-col>
          <v-col>
            {{ item.rank }}
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row dense justify="start" v-if="item.parents && item.parents.length">
          <v-col class="ml-4 font-weight-bold" cols="2">Parents</v-col>
          <v-col>
            <span v-html="parentNames(item)"></span>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row dense justify="start" v-if="item.customerId">
          <v-col class="ml-4 font-weight-bold" cols="2">A/R Customer ID</v-col>
          <v-col>
            {{ item.customerId }}
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row dense justify="start" v-if="item.addressId">
          <v-col class="ml-4 font-weight-bold" cols="2">A/R Address ID</v-col>
          <v-col>
            {{ item.addressId }}
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-3 ml-2"></v-divider>
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
          <v-col v-else><div class="ml-4">No users</div></v-col>
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
          <v-col class="ml-4">
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
            <v-divider></v-divider>
          </div>
        </v-row>
        <slot name="extra-content" :item="item"></slot>
      </v-col>
    </v-row>
    <IFXPageActionBar
      class="mt-0"
      btnType="submit"
      :disabled="!isSubmittable"
      @action="updateUsersAndSubmit"
      :submitting="submitting"
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
            :allItems="allContacts"
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
    <v-dialog v-model="showEditDetailModal" v-if="showEditDetailModal" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          Change Organization Details
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small @click="showEditDetailModal = false" data-cy="ar-dialog-close" v-on="on" v-bind="attrs">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Cancel</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form v-model="detailsFormIsValid">
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="name"
                  label="Name"
                  data-cy="update-org-name"
                  :error-messages="errors.name"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="rank"
                  label="Rank"
                  data-cy="rank"
                  :rules="formRules.generic"
                  :error-messages="errors.rank"
                  :items="apiRef.validRanks"
                  item-text="text"
                  item-value="value"
                  required
                  class="required"
                ></v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-autocomplete
                  v-model="parentSlugs"
                  label="Parents"
                  data-cy="update-org-parents"
                  :items="allOrganizations"
                  item-text="name"
                  item-value="slug"
                  multiple
                  chips
                  deletable-chips
                  :error-messages="errors.parents"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="customerId"
                  label="Accounts Receivable Customer ID"
                  data-cy="update-customer-id"
                  :error-messages="errors.application_key"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="addressId"
                  label="Accounts Receivable Address ID"
                  data-cy="update-address-id"
                  :error-messages="errors.application_key"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-start pb-3">
          <v-btn small text class="ml-2" color="secondary" @click="cancelDetails">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn small text class="mr-2" color="secondary" @click="openDetails">Reset</v-btn>
          <v-btn small text class="mr-2" :disabled="!detailsFormIsValid" color="primary" @click="updateDetails()">
            Update
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
