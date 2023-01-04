<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXSelectCreateContact from '@/components/contact/IFXSelectCreateContact'
import IFXContactRoleDisplayEdit from '@/components/contact/IFXContactRoleDisplayEdit'

export default {
  name: 'IFXOrganizationDetail',
  mixins: [IFXOrganizationMixin, IFXItemDetailMixin],
  data() {
    return {
      allContacts: [],
      currentContact: {},
      contactDialogOpen: false,
      addContactFormIsValid: false,
    }
  },
  components: {
    IFXDeleteItemButton,
    IFXItemDataTable,
    IFXContactCard,
    IFXSelectCreateContact,
    IFXContactRoleDisplayEdit,
  },
  methods: {
    displayRank() {
      const value = this.apiRef.getValidRankByValue(this.item.rank)
      if (value && value.text) {
        return value.text
      }
      return ''
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
          <v-row>
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
              <h2>Contacts</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="otherContacts && otherContacts.length">
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
            <v-col sm="1" align="end">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <IFXButton v-on="on" v-bind="attrs" btnType="add" xSmall @action="openContactDialog()" />
                </template>
                <span>Add new contact</span>
              </v-tooltip>
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
    </v-container>
  </v-container>
</template>
