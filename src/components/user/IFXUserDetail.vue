<script>
import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'
import IFXUserEdit from '@/components/user/IFXUserEdit'

export default {
  name: 'IFXUserDetail',
  mixins: [IFXUserMixin, IFXItemDetailMixin],
  components: {
    IFXLoginIcon,
    IFXItemHistoryDisplay,
    IFXUserEdit,
  },
  data() {
    return {
      allGroupNames: [],
      dialogSection: 'all',
      dialogOpen: false,
    }
  },
  methods: {
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
    openDialog(section) {
      this.dialogSection = section
      this.dialogOpen = true
    },
    closeDialog() {
      this.dialogSection = 'all'
      this.dialogOpen = false
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
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
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
          <IFXButton btnType="edit" xSmall @action="openDialog('user')" />
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
          <h3>Email(s)</h3>
        </v-col>
        <v-col>
          <v-row dense>
            <v-col md="4">Primary Email</v-col>
            <v-col>
              <a :href="`mailto:${item.primaryEmail}`">{{ item.primaryEmail }}</a>
            </v-col>
          </v-row>
          <span v-if="areContactsPresent">
            <div v-for="contact in item.contacts" :key="contact.id">
              <v-row dense v-if="contact.role !== 'Primary Email' && contact.type === 'Email'">
                <v-col md="4">{{ contact.role }}</v-col>
                <v-col>
                  <a :href="`mailto:${contact.detail}`">{{ contact.detail }}</a>
                </v-col>
              </v-row>
            </div>
          </span>
          <!-- <span v-html="additionalEmailList()"></span> -->
        </v-col>
      </v-row>
      <span v-if="areContactsPresent">
        <v-divider class="my-2"></v-divider>
        <v-row dense>
          <v-col sm="4" md="3">
            <h3>Other Contacts</h3>
          </v-col>
          <v-col>
            <div v-for="contact in item.contacts" :key="contact.id">
              <v-row dense v-if="contact.type !== 'Email'">
                <v-col md="4">{{ contact.role }}</v-col>
                <v-col>
                  <a :href="`mailto:${contact.detail}`">{{ contact.detail }}</a>
                </v-col>
              </v-row>
            </div>
            <!-- <span v-html="additionalContactList()"></span> -->
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="edit" xSmall @action="openDialog('contacts')" />
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
              </div>
            </span>
          </v-col>
          <v-col sm="1" align="end">
            <IFXButton btnType="edit" xSmall @action="openDialog('affiliations')" />
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
      <v-dialog v-model="dialogOpen" max-width="90vw" persistent>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon small @click.stop="closeDialog" data-cy="dialog-close" v-on="on">
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
