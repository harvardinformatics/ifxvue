<script>
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXSelectableUser from '@/components/user/IFXSelectableUser'

export default {
  name: 'IFXOrganizationDetail',
  mixins: [IFXOrganizationMixin, IFXItemDetailMixin],
  components: {
    IFXItemSelectList,
    IFXSelectableContact,
    IFXSelectableUser
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
      <template #actions>
        <!-- TODO: check why this cannot be edited -->
        <IFXButton v-if="!item.ifxOrg" btnType="edit" @action="navigateToItemEdit(id)"/>
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row>
        <v-col>
          <h3>Name</h3>
          <p>{{item.name}}</p>
        </v-col>
        <v-col>
          <h3>Rank</h3>
          <p>{{displayRank()}}</p>
        </v-col>
        <v-col>
          <h3>Organization tree</h3>
          <p>{{item.orgTree}}</p>
        </v-col>
      </v-row>
        <v-row>
          <v-col>
            <IFXItemSelectList
              title='Users'
              disabled
              :items='item.users'
              >
              <template v-slot="{item}">
                <IFXSelectableUser disabled :item='item'/>
              </template>
            </IFXItemSelectList>
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
