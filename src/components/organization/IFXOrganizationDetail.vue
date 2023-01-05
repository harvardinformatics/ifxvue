<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'

import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXOrganizationDetail',
  mixins: [IFXOrganizationMixin, IFXItemDetailMixin, IFXItemCreateEditMixin],
  components: {
    IFXDeleteItemButton,
    IFXItemDataTable,
    IFXContactCard,
    IFXSelectCreateContact,
    IFXContactRoleDisplayEdit,
    IFXPageActionBar,
  },
  data() {
    return {
      allRegularContacts: [],
      currentContact: {},
      contactDialogOpen: false,
      addContactFormIsValid: false,
    }
  },
  mounted() {
    this.isLoading = true
    this.init()
      .then(() => (this.isLoading = false))
      .catch((err) => {
        this.showMessage(err)
        this.rtr.replace({ name: `${this.itemType}List` })
      })
  },
  methods: {
    async init() {
      this.item = await this.apiRef.getByID(this.id, true)
      this.cacheItem()
      this.isValid = true
      this.allRegularContacts = await this.$api.contact.getList({ has_name: false })
    },
    displayRank() {
      const value = this.apiRef.getValidRankByValue(this.item.rank)
      if (value && value.text) {
        return value.text
      }
      return ''
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
      this.currentContact.type = 'Email'
      this.contactDialogOpen = true
    },
    updateContact(contact, index) {
      this.item.contacts.splice(index, 1, contact)
    },
    cancelContact() {
      this.currentContact = this.$api.userContact.create()
      this.currentContact.role = null
      this.currentContact.active = false
      this.currentContact.type = 'Email'
    },
  },
  computed: {
    mainContacts() {
      // Returns contacts with name and phone or address
      if (this.item && this.item.contacts) {
        const result = this.item.contacts.filter((contact) => contact.name && (contact.phone || contact.address))
        return result
      }
      return []
    },
    otherContacts() {
      // Not mainContacts
      if (this.item && this.item.contacts) {
        const result = this.item.contacts.filter((contact) => !contact.name && !contact.address)
        return result
      }
      return []
    },
    filteredContacts() {
      return this.allRegularContacts.filter((c) => !this.item.contacts?.some((item) => item.contact.id === c.id))
    },
    isSubmittable() {
      return this.hasItemChanged()
    },
    userListHeaders() {
      const headers = [
        { text: 'Full Name', value: 'fullName', sortable: true, namedSlot: true, click: true },
        { text: 'Status', value: 'status', sortable: false, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    areMultipleUsers() {
      if (this.item.users && this.item.users.length > 0) {
        return true
      }
      return false
    },
    areMultipleContacts() {
      if (this.item.contacts && this.item.contacts.length > 0) {
        return true
      }
      return false
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
        <!-- TODO: check why this cannot be edited -->
        <IFXButton v-if="$api.auth.can('edit-organization')" xSmall btnType="edit" @action="navigateToItemEdit(id)" />
        <IFXDeleteItemButton v-if="!item.ifxOrg" xSmall :item="item" :apiRef="apiRef" :itemType="itemType" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row dense>
        <v-col md="6">
          <v-row dense>
            <v-col>
              <h2>Users</h2>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col v-if="item && item.users && item.users.length">
              <IFXItemDataTable
                :headers="userListHeaders"
                :items="item.users"
                :showSelect="false"
                itemType="OrganizationUser"
                :hideDefaultFooter="item.users.length < 20"
                :selected="[]"
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
              <h2>
                Contacts
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <IFXButton
                      class="ml-2"
                      v-on="on"
                      v-bind="attrs"
                      btnType="add"
                      xSmall
                      @action="openContactDialog()"
                    />
                  </template>
                  <span>Add new contact</span>
                </v-tooltip>
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- <v-row v-for="otherContact in otherContacts" :key="otherContact.id">
                <v-col cols="1">
                  <v-icon v-if="otherContact.type === 'Email'" color="success">email</v-icon>
                  <v-icon v-else-if="otherContact.type === 'Phone'" color="success">local_phone</v-icon>
                  <span v-else></span>
                </v-col>
                <v-col>
                  <a v-if="otherContact.type === 'Email'" :href="`mailto:${otherContact.detail}`">{{ otherContact.detail }}</a>
                  <span v-else>{{otherContact.detail}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else>
              No contacts
            </v-col> -->
              <div v-for="(otherContact, index) in otherContacts" :key="index">
                <IFXContactRoleDisplayEdit :contact="otherContact" @update="updateContact(otherContact, index)" />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="mainContacts.length">
          <v-row>
            <v-col>
              <h2>Main Contact</h2>
            </v-col>
          </v-row>
          <v-row v-for="mainContact in mainContacts" :key="mainContact.id">
            <v-col>
              <IFXContactCard :contact="mainContact" :editBtn="false" dense />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <IFXPageActionBar
        class="mt-0"
        btnType="submit"
        :disabled="!isSubmittable"
        @action="submitUpdate"
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
    </v-container>
  </v-container>
</template>
