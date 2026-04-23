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
      const recipients = this.selected.map((item) => item.primaryEmail || item.email).join(',')
      this.$router.push({
        name: 'MailingCompose',
        state: { recipients, recipientField: this.recipientField },
      })
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
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Full name', key: 'fullName', sortable: true },
        { title: 'First name', key: 'firstName', hide: 'lgAndDown', sortable: true },
        { title: 'Last name', key: 'lastName', hide: 'lgAndDown', sortable: true },
        { title: 'Date Created', key: 'dateJoined', hide: 'smAndDown', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'IfxId', key: 'ifxid', hide: 'mdAndDown', sortable: true },
        { title: 'Groups', key: 'groups', sortable: true },
        { title: `${this.$api.vars.appNameFormatted} Login`, key: 'isLoginActive', sortable: true },
      ]
      const headers = this.headers || defaultHeaders
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
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
        <v-row no-wrap align="center">
          <v-col>
            <IFXSearchField v-model:search="search" />
          </v-col>
          <v-col cols="4">
            <v-checkbox v-model="includeDisabled" hide-details>
              <template v-slot:label>
                <span style="white-space: nowrap">Include 1 disabled</span>
              </template>
            </v-checkbox>
          </v-col>
          <v-col>
            <v-row density="compact">
              <v-col>
                <IFXMailButton
                  v-model="recipientField"
                  :disabled="!selected.length"
                  toolTip="Email selected users"
                  @update:modelValue="composeEmail()"
                ></IFXMailButton>
              </v-col>
              <v-col>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="small" icon @click="updateAuthorizations()" color="secondary">
                      <v-icon>mdi-shield-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Update Expense code / PO authorizations</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="buttons && buttons.length">
            <v-row class="d-flex flex-row flex-nowrap" density="compact">
              <v-col v-for="(button, index) in buttons" :key="index" cols="auto">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="small" icon @click="button.action(selected)" color="primary" :disabled="!selected.length" class="ml-2">
                      <v-icon>{{button.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ button.tooltip}}</span>
                </v-tooltip>
              </v-col>
            </v-row>
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
          v-model:selected="selected"
          :itemType="itemType"
          :loading="isLoading"
        >
          <template v-for="header in computedHeaders.filter(h => h.namedSlot)" :key="header.key" #[header.key]="{ item }">
            <slot :name="header.key" :item="item"></slot>
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
