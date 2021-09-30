<script>
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXContactCard from '@/components/contact/IFXContactCard'

export default {
  name: 'IFXOrganizationDetail',
  mixins: [IFXOrganizationMixin, IFXItemDetailMixin],
  components: {
    IFXItemSelectList,
    IFXSelectableContact,
    IFXDeleteItemButton,
    IFXItemDataTable,
    IFXContactCard,
  },
  methods: {
    displayRank() {
      const value = this.apiRef.getValidRankByValue(this.item.rank)
      if (value && value.text) {
        return value.text
      }
      return ''
    }
  },
  computed: {
    mainContacts() {
      // Returns contacts with name and phone or address
      if (this.item && this.item.contacts) {
        const result = this.item.contacts.filter(contact => contact.name && (contact.phone || contact.address))
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
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.slug }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <!-- TODO: check why this cannot be edited -->
        <IFXButton v-if="!item.ifxOrg" btnType="edit" @action="navigateToItemEdit(id)"/>
        <IFXDeleteItemButton v-if="!item.ifxOrg" :item='item' :apiRef='apiRef' :itemType='itemType'/>
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row dense>
        <v-col>
          <v-row dense>
            <v-col>
              <h2>Users</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="item && item.users">
              <IFXItemDataTable
                :headers="userListHeaders"
                :items="item.users"
                :showSelect="false"
                itemType="OrganizationUser"
                :hideDefaultFooter="item.users.length < 20"
                :selected="[]"
              >
                <template v-slot:fullName="{ item }">
                  <router-link :to="{ name: 'UserDetail', params: { id: item.user.id } }">{{item.fullName}}</router-link>
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
            <v-col v-else>
              No users
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
              <IFXContactCard :contact="mainContact" :editBtn="false" dense/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- TODO: use contact card instead? -->
          <IFXItemSelectList
            title='Contacts'
            disabled
            :items='item.contacts'
            >
            <template v-slot="{item}">
              <IFXSelectableContact disabled :item='item'/>
            </template>
          </IFXItemSelectList>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
