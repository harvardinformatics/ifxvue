<script>
import { mapActions } from 'vuex'

import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXItemEditableDetailMixin from '@/components/item/IFXItemEditableDetailMixin'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXUserInfoEdit from '@/components/user/IFXUserInfoEdit'

import IFXUserInfoDialog from '@/components/user/IFXUserInfoDialog'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXSelectAffiliation from '@/components/affiliation/IFXSelectAffiliation'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'
import IFXAffiliationRoleDisplayEdit from '@/components/contact/IFXAffiliationRoleDisplayEdit'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'IFXUserDetail',
  mixins: [IFXUserMixin, IFXItemEditableDetailMixin],
  components: {
    IFXLoginIcon,
    IFXUserInfoEdit,
    IFXUserInfoDialog,
    IFXSelectCreateContact,
    IFXSelectAffiliation,
    IFXPageActionBar,
    IFXContactRoleDisplayEdit,
    IFXAffiliationRoleDisplayEdit,
  },
  props: {
    djangoEditOnly: {
      type: Boolean,
      default: false,
      required: false,
    },
    additionalSaveFunction: {
      type: Function,
      default: null,
      required: false,
    },
    showUserFiles: {
      type: Boolean,
      default: false,
      required: false,
    },
    onlyOneFilePerCategory: {
      type: Boolean,
      default: false,
      required: false,
    },
    showPhotoInUserFiles: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      allGroupNames: [],
      allContacts: [],
      allOrganizationSlugs: [],
      allRoles: [
        { name: 'Additional Email', editable: true },
        { name: 'Work Phone', editable: true },
        { name: 'Additional Phone', editable: true },
        { name: 'Additional Contact', editable: true },
      ],
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
      userFilesCategories: {},
      userFilesDialogOpen: false,
      userFilesFormIsValid: false,
      confirmationDialogOpen: false,
      newUserFile: {},
      fileToDelete: {},
      showInactiveAffiliations: false,
      showInactiveAccounts: false,
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['showMessage']),
    async getAdditionalData() {
      const contacts = await this.$api.contact.getList({ has_name: false })
      // Dedupe contacts by id to prevent duplicate entries in dropdown
      this.allContacts = [...new Map(contacts.map(c => [c.id, c])).values()]
      this.allGroupNames = await this.$api.group.getNames()
      const organizations = await this.$api.organization.getNames()
      this.allOrganizationSlugs = organizations.map((o) => o.slug)
      this.userFilesCategories = await this.$api.userFile.getUserCategoriesList()
    },
    openCommentDialog() {
      this.changeDialogActive = true
    },
    completeAction() {
      this.submitUpdate()
      if (this.additionalSaveFunction) {
        this.additionalSaveFunction(this.item)
      }
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
    updateUserFile(userFile, index) {
      this.item.userFiles.splice(index, 1, userFile)
    },
    openUserFileDialog() {
      this.newUserFile = this.$api.userFile.create()
      this.newUserFile.id = null
      this.newUserFile.category = null
      this.newUserFile.file = null
      this.newUserFile.user = this.item.id || null
      this.userFilesDialogOpen = true
    },
    cancelUserFile() {
      this.openUserFileDialog()
    },
    async addUserFile() {
      try {
        await this.$api.userFile.uploadUserFile(this.newUserFile)
        this.userFilesDialogOpen = false
        this.showMessage(`${this.newUserFile.file.name} uploaded successfully`)
        this.newUserFile = {}
        this.init()
      } catch (error) {
        this.showMessage(error)
      }
    },
    async removeUserFile() {
      // Remove the file
      try {
        await this.$api.userFile.delete(this.fileToDelete)
        const fileName = this.fileToDelete.file.split('/').pop()
        this.showMessage(`${fileName} successfully removed`)
        this.confirmationDialogOpen = false
        this.fileToDelete = {}
        this.init()
      } catch (error) {
        this.showMessage(error)
      }
    },
    verifyRemoveUserFile(file) {
      this.fileToDelete = cloneDeep(file)
      this.confirmationDialogOpen = true
    },
    cancelRemoveUserFile() {
      this.fileToDelete = null
      this.confirmationDialogOpen = false
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
    isDjangoStaff() {
      return this.$api.auth.isStaff
    },
    hasUserFiles() {
      const userFiles = this.showPhotoInUserFiles
        ? this.item.userFiles
        : this.item.userFiles?.filter((file) => file.category !== 'User Photo')
      return userFiles && userFiles.length
    },
  },
  computed: {
    django_admin_url() {
      return `${this.$api.urls.DJANGO_ADMIN_ROOT}ifxuser/ifxuser/${this.item.id}/change/`
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
    areGroupsPresent() {
      return this.item.groups?.length
    },
    filteredContacts() {
      return this.allContacts.filter((c) => !this.item.contacts?.some((item) => item.contact?.id === c.id))
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
      return this.item && this.item.username && !!this.item.ifxid && !this.djangoEditOnly
    },
    userCategories() {
      return this.item.userFiles?.reduce((acc, file) => {
        if (file.category === 'User Photo' && !this.showPhotoInUserFiles) {
          return acc
        }
        if (!acc[file.category]) {
          acc[file.category] = []
        }
        acc[file.category].push(file)
        return acc
      }, {})
    },
    userCategoriesToDisplay() {
      // Assume all categories are allowed
      let categories = this.userFilesCategories.map((c) => c.name)
      // If we're only allowed one file per category, filter out categories that already have files
      if (categories.length && this.onlyOneFilePerCategory) {
        // Get all the existing categories in a set so they will be unique
        const existingCategories = new Set(Object.keys(this.userCategories))
        // Filter out any categories that already exist
        categories = categories.filter((category) => !existingCategories.has(category))
      }
      return this.showPhotoInUserFiles ? categories : categories.filter((category) => category !== 'User Photo')
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXUserInfoDialog
      v-model:isActive="changeDialogActive"
      v-model:changeComment="item.changeComment"
      @complete-action="completeAction"
    />
    <IFXPageHeader>
      <template #title>{{ item.fullName || id }}</template>
      <template #actions>
        <v-row dense align="center">
          <v-col>
            <span class="text-no-wrap">
              <IFXLoginIcon :disabled="true" v-if="item.isActive !== undefined" v-model:isActive="item.isActive" />
            </span>
          </v-col>
          <v-col v-if="isDjangoStaff()">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  color="info"
                  :href="django_admin_url"
                  icon
                  elevation="6"
                >
                  <v-icon color="yellow">mdi-key</v-icon>
                </v-btn>
              </template>
              <span>View user Django admin form</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <v-container>
      <v-row dense v-if="Object.keys(this.errors).length">
        <v-col>
          <v-alert
            elevation="2"
            density="compact"
            border="start"
            color="error"
            icon="mdi-alert-circle-outline"
          >
            <v-row dense>
              <v-col>
                <h3 class="font-weight-medium">Please correct the following errors</h3>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <ul>
                  <li v-for="(error, key) in errors" :key="key">
                    {{ key }}:
                    <span v-for="errorText in error" :key="errorText">
                      {{ errorText }}
                    </span>
                  </li>
                </ul>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
      </v-row>
      <v-row dense v-if="isSubmittable">
        <v-col>
          <v-alert
            elevation="2"
            density="compact"
            border="start"
            color="warning"
            icon="mdi-alert-circle-outline"
          >
            <v-row dense>
              <v-col>
                <h3 class="font-weight-medium">You have unsaved changes!</h3>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col sm="12" md="11">
          <v-row>
            <v-col>
              <v-row dense wrap>
                <v-col sm="4" md="3">
                  <h3>First Name</h3>
                </v-col>
                <v-col>
                  {{ item.firstName }}
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
                  {{ $orgNameFromSlug(item.primaryAffiliation) }}
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
              <v-row align="start" dense>
                <v-col sm="4" md="3">
                  <h3>Created</h3>
                </v-col>
                <v-col>
                  {{ $humanDatetime(item.dateJoined) }}
                </v-col>
              </v-row>
              <v-row align="start" dense>
                <v-col sm="4" md="3">
                  <h3>Last Update</h3>
                </v-col>
                <v-col>
                  {{ $humanDatetime(item.lastUpdate) }}
                </v-col>
              </v-row>
              <slot name="additionalUserInfoCol1" :item="item"></slot>
            </v-col>
            <slot name="additionalUserInfoCol2" :item="item"></slot>
          </v-row>
        </v-col>
        <v-col sm="1" align="end">
          <IFXButton btnType="edit" xSmall @action="openUserInfoDialog" v-if="isUserInfoEdittable" />
        </v-col>
      </v-row>
      <span>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Contacts</h3>
          </v-col>
          <v-col>
            <div v-for="(contact, index) in item.contacts" :key="contact.id ?? index">
              <IFXContactRoleDisplayEdit
                :contact="contact"
                @update="updateContact(contact, index)"
                v-if="contact.role !== 'Primary Email'"
              />
            </div>
          </v-col>
          <v-col sm="1" align="end">
            <v-tooltip location="top" v-if="isUserInfoEdittable">
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <IFXButton btnType="add" xSmall @action="openContactDialog()" />
                </span>
              </template>
              <span>Add new contact</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </span>
      <span>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col sm="3" md="3">
            <h3>Other Affiliations</h3>
            <div>
              <v-switch v-model="showInactiveAffiliations" label="Show Inactive" class="small-checkbox mt-0" color="primary"></v-switch>
            </div>
          </v-col>
          <v-col>
            <span class="d-flex flex-column">
              <div v-for="(affiliation, index) in item.affiliations" :key="affiliation.id ?? index" class="d-flex align-center mt-1">
                <IFXAffiliationRoleDisplayEdit
                  :affiliation="affiliation"
                  :showInactive="showInactiveAffiliations"
                  @update="updateAffiliation(affiliation, index)"
                />
              </div>
            </span>
          </v-col>
          <v-col sm="1" align="end">
            <v-tooltip location="top" v-if="isUserInfoEdittable">
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <IFXButton btnType="add" xSmall @action="openAffiliationDialog()" />
                </span>
              </template>
              <span>Add affiliation</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </span>
      <v-divider class="my-2" />
      <span v-if="showUserFilesSection(item)">
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>User Files</h3>
          </v-col>
          <v-col v-if="hasUserFiles()">
            <div v-for="category in Object.keys(userCategories)" :key="category">
              <span v-if="onlyOneFilePerCategory">
                <v-row dense v-for="file in userCategories[category]" :key="`${category}${file.id}`">
                  <v-col sm="12">
                    <div>
                      <span class="font-weight-medium">{{ category }}:&nbsp;</span>
                      <a :href="file.file" target="_blank">{{ file.file | fileNameFromUrl }}</a>
                      <v-tooltip v-if="canEdit('userFiles')" top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-on="on"
                            v-bind="attrs"
                            class="ml-2"
                            size="small"
                            color="red"
                            @click.stop.prevent="verifyRemoveUserFile(file)"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                        <span>Remove this file</span>
                      </v-tooltip>
                    </div>
                  </v-col>
                </v-row>
              </span>
              <details class="font-weight-medium" v-else>
                <summary>
                  <span class="ml-1">{{ category }}s</span>
                </summary>
                <span>
                  <v-row dense v-for="file in userCategories[category]" :key="`${category}${file.id}`">
                    <v-col sm="11">
                      <div class="ml-4">
                        <a :href="file.file" target="_blank">{{ $fileNameFromUrl(file.file) }}</a>
                        <v-tooltip v-if="canEdit('userFiles')" top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-on="on"
                              v-bind="attrs"
                              class="ml-2"
                              size="small"
                              color="red"
                              @click.stop.prevent="verifyRemoveUserFile(file)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                          <span>Remove this file</span>
                        </v-tooltip>
                      </div>
                    </v-col>
                  </v-row>
                </span>
              </details>
            </div>
          </v-col>
          <v-col v-else>
            <span class="text-grey text-darken-1">No User Files uploaded.</span>
          </v-col>
          <v-col sm="1" align="end">
            <v-tooltip top v-if="isUserInfoEdittable">
              <template v-slot:activator="{ on, attrs }">
                <IFXButton v-on="on" v-bind="attrs" btnType="add" xSmall @action="openUserFileDialog()" />
              </template>
              <span>Add A File</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
      </span>
      <v-row dense v-if="areAnyAccountsPresent">
        <v-col sm="4" md="3">
          <h3>Expense code / PO Authorizations</h3>
          <div>
            <v-switch v-model="showInactiveAccounts" label="Show Inactive" class="small-checkbox mt-0" color="primary"></v-switch>
          </div>
        </v-col>
        <v-col>
          <span v-if="areAccountsPresent" class="d-flex flex-column">
            <div v-for="account in item.accounts" :key="account.id" class="d-flex align-center mt-1">
              <span
                v-if="showInactiveAccounts || (account.data.is_valid && account.account.active)"
                :class="{
                  'text-decoration-line-through':
                    $api.auth.can('see-inactive-accounts') && !(account.data.is_valid && account.account.active),
                }"
              >
                {{ account.account.slug }} for any facility product
              </span>
            </div>
          </span>
          <span v-if="areProductAccountsPresent" class="d-flex flex-column">
            <div v-for="account in item.productAccounts" :key="account.id" class="d-flex align-center mt-1">
              <span
                v-if="showInactiveAccounts || (account.data.is_valid && account.account.active)"
                :class="{
                  'text-decoration-line-through':
                    $api.auth.can('see-inactive-accounts') && !(account.data.is_valid && account.account.active),
                }"
              >
                {{ account.account.slug }} for
                <span class="font-weight-medium">{{ account.product.name }}</span>
                at
                <span class="font-weight-medium">{{ account.percent }}%</span>
              </span>
            </div>
          </span>
        </v-col>
      </v-row>
      <slot name="additionalItems" :item="item"></slot>
      <IFXPageActionBar
        class="mt-0"
        btnType="submit"
        @action="openCommentDialog"
        :disabled="!isSubmittable"
        :submitting="submitting"
      />

      <!-- Edit User Info Dialog -->
      <v-dialog v-model="userInfoDialogOpen" v-if="userInfoDialogOpen" max-width="80vw" persistent>
        <v-card>
          <v-card-title class="d-flex align-center pa-4">
            <span class="text-h6">Edit User Info</span>
            <v-spacer />
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  @click="cancelUserInfoDialog"
                  data-cy="user-info-dialog-close"
                  v-bind="props"
                />
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <IFXUserInfoEdit
              v-model:item="itemCopy"
              :errors="errors"
              :allGroupNames="allGroupNames"
              :orgSlugs="allOrganizationSlugs"
              v-model:valid="userInfoDialogValid"
            />
            <slot name="additionalUserInfoEdit" :item="itemCopy" :errors="errors"></slot>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="text" color="secondary" @click="cancelUserInfoDialog">Close</v-btn>
            <v-btn
              variant="text"
              :disabled="!userInfoDialogValid"
              color="primary"
              @click="closeUserInfoDialog"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
              :allItems="filteredContacts"
              :allRoles="allRoles"
              :filterRoles="true"
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

      <!-- Add Affiliation Dialog -->
      <v-dialog v-model="affiliationDialogOpen" v-if="affiliationDialogOpen" max-width="800px" persistent>
        <v-card>
          <v-card-title class="d-flex align-center pa-4">
            <span class="text-h6">Add Affiliation</span>
            <v-spacer />
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  @click="affiliationDialogOpen = false"
                  data-cy="affiliation-dialog-close"
                  v-bind="props"
                />
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <IFXSelectAffiliation
              :allItems="filteredOrgSlugs"
              v-model:item="newAffiliation"
              :errors="errors"
              v-model:valid="addAffiliationFormIsValid"
            />
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-4">
            <v-btn variant="text" color="secondary" @click="affiliationDialogOpen = false">Close</v-btn>
            <v-spacer />
            <v-btn variant="text" color="secondary" @click="cancelAffiliation">Clear</v-btn>
            <v-btn
              variant="text"
              :disabled="!addAffiliationFormIsValid"
              color="primary"
              @click="addAffiliation()"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="userFilesDialogOpen" v-if="userFilesDialogOpen" max-width="800px" persistent>
        <v-card>
          <v-card-title>
            Add Files
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  size="small"
                  @click="userFilesDialogOpen = false"
                  data-cy="userFile-dialog-close"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </v-card-title>
          <v-card-subtitle class="pl-6 my-2" v-if="onlyOneFilePerCategory">
            <span>Only one file of each category is allowed.</span>
          </v-card-subtitle>
          <v-card-text class="pb-0">
            <v-form ref="userFileForm" v-model="userFilesFormIsValid" lazy-validation>
              <v-row>
                <v-col>
                  <v-file-input
                    v-model="newUserFile.file"
                    label="Select File"
                    :rules="[(v) => !!v || 'File is required']"
                    required
                  ></v-file-input>
                </v-col>
                <v-col md="4">
                  <v-select
                    v-model="newUserFile.category"
                    :items="userCategoriesToDisplay"
                    label="Category"
                    :rules="[(v) => !!v || 'Category is required']"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3">
            <v-btn size="small" text class="ml-2" color="secondary" @click="userFilesDialogOpen = false">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn size="small" text class="mr-2" color="secondary" @click="cancelUserFile">Clear</v-btn>
            <v-btn size="small" text class="mr-2" :disabled="!userFilesFormIsValid" color="primary" @click="addUserFile()">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmationDialogOpen" v-if="confirmationDialogOpen" max-width="800px" persistent>
        <v-card>
          <v-card-title>
            Confirm File Removal
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  size="small"
                  @click="confirmationDialogOpen = false"
                  data-cy="confirm-dialog-close"
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
            Are you
            <span class="font-weight-bold">sure</span>
            you want to remove
            <span class="font-weight-medium">{{ fileToDelete.file | fileNameFromUrl }}</span>
            ?
          </v-card-text>
          <v-card-actions class="d-flex justify-end pb-3 pt-3">
            <v-btn size="small" text color="secondary" @click="cancelRemoveUserFile()">Close</v-btn>
            <v-btn size="small" text class="mr-2" color="primary" @click="removeUserFile()">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>

<style lang="scss">
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
.small-checkbox {
  .v-messages {
    display: none;
  }
}
</style>
