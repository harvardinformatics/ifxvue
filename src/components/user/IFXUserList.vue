<script>
import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXMailButton from '@/components/mailing/IFXMailButton'

export default {
  name: 'IFXUserList',
  mixins: [IFXUserMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXMailButton,
  },
  props: {
    headers: {
      type: Array,
      required: false,
      default: null,
    },
    /* An array of buttons to put in the page header
    * Each button should be an object with the following properties:
    *   - icon: The icon to display on the button
    *   - tooltip: The tooltip to display when the button is hovered over
    *   - action: The method to call when the button is clicked
    */
    buttons: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      includeDisabled: this.$api.storage.getItem('UserListIncludeDisabled') || false,
      mailFab: false,
      recipientField: '',
      authorizationUpdating: false,
      authorizationUpdateMessage: '',
      authorizationMessageType: 'info',
    }
  },
  methods: {
    async getSetItems() {
      try {
        this.items = await this.$api.user.getList({ include_disabled: this.includeDisabled })
      } catch (error) {
        this.showMessage(error)
      }
    },
    composeEmail() {
      const params = {
        recipientField: this.recipientField,
        recipients: null,
      }
      params.recipients = this.selected.map((item) => item.primaryEmail).join(',')
      this.$router.push({ name: 'MailingCompose', params: params })
    },
    getErrorMessage(error) {
      let message = 'Unknown error'
      if (error.response?.data?.errors) {
        message = error.response.data.errors.join('<br/>')
      } else {
        message = error
      }
      return message
    },
    updateAuthorizations() {
      this.authorizationUpdating = true
      let ifxids = null
      if (this.selected) {
        ifxids = this.selected.map((item) => item.ifxid)
      }
      this.$api
        .updateAuthorizations(ifxids)
        .then((result) => {
          this.authorizationMessageType = 'info'
          const plural = result.data.successes.length > 1 ? 's' : ''
          this.authorizationUpdateMessage = `Successfully updated ${result.data.successes} user${plural}`
        })
        .catch((error) => {
          this.authorizationMessageType = 'error'
          this.authorizationUpdateMessage = this.getErrorMessage(error)
        })
        .finally(() => {
          this.authorizationUpdating = false
        })
    },
  },
  computed: {
    computedHeaders() {
      const defaultHeaders = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Full name', value: 'fullName', sortable: true },
        { text: 'First name', value: 'firstName', hide: 'lgAndDown', sortable: true },
        { text: 'Last name', value: 'lastName', hide: 'lgAndDown', sortable: true },
        { text: 'Date Created', value: 'dateJoined', hide: 'smAndDown', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'IfxId', value: 'ifxid', hide: 'mdAndDown', sortable: true },
        { text: 'Groups', value: 'groups', sortable: true },
        { text: `${this.$api.vars.appNameFormatted} Login`, value: 'isLoginActive', sortable: true },
      ]
      const headers = this.headers || defaultHeaders
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  watch: {
    includeDisabled(val) {
      this.$api.storage.setItem('UserListIncludeDisabled', val)
      this.getSetItems()
    },
  },
}
</script>
<template>
  <v-container grid-list-md>
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <v-row nowrap align="center">
          <v-col>
            <IFXSearchField :search.sync="search" />
          </v-col>
          <v-col>
            <v-checkbox class="action-item" label="Include disabled" v-model="includeDisabled"></v-checkbox>
          </v-col>
          <v-col>
            <IFXMailButton
              v-model="recipientField"
              :disabled="!selected.length"
              toolTip="Email selected users"
              @input="composeEmail()"
            ></IFXMailButton>
          </v-col>
          <v-col>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-btn v-bind="attrs" small fab @click="updateAuthorizations()" color="secondary">
                    <v-icon>verified_user</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>Update Expense code / PO authorizations</span>
            </v-tooltip>
          </v-col>
          <v-col v-if="buttons && buttons.length" class="d-flex flex-row flex-nowrap">
            <v-tooltip top v-for="(button, index) in buttons" :key="index">
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-btn v-bind="attrs" small fab @click="button.action(selected)" color="primary" :disabled="!selected.length" class="ml-2">
                    <v-icon>{{button.icon}}</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>{{ button.tooltip}}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <v-row justify="center" align="center">
      <v-col v-if="authorizationUpdating">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
      <v-col v-else-if="authorizationUpdateMessage">
        <v-alert dismissible :type="authorizationMessageType" border="left" elevation="2" colored-border>
          <span v-html="authorizationUpdateMessage"></span>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <IFXItemDataTable
          :items="filteredItems"
          :headers="computedHeaders"
          :selected.sync="selected"
          :itemType="itemType"
          :loading="isLoading"
        >
          <!-- Loops through all headers and use a named slot if specified-->
          <template v-for="header in headers" #[`${header.value}`]="{ item }">
            <span v-if="header.namedSlot" v-bind:key="header.value">
              <slot :name="header.value" :item="item"></slot>
            </span>
          </template>
        </IFXItemDataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.action-item {
  display: inline-block !important;
  margin-right: 2rem;
}
.v-text-field__details {
  display: none !important;
}

.v-select-list > .v-list {
  padding: 0;
}

.v-select-list > .v-list__tile {
  border-bottom: 1px red solid;
}

.v-select-list {
  padding: 0;
}
</style>
