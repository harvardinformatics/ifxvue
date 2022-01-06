<script>
import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXUserList',
  mixins: [IFXUserMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  props: {
    headers: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      includeDisabled: this.$api.storage.getItem('UserListIncludeDisabled') || false,
      mailFab: false,
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
    composeEmail(recipientField) {
      const params = {
        recipientField: recipientField,
        recipients: null
      }
      params.recipients = this.selected.map((item) => item.primaryEmail).join(',')
      console.log('params ', params)
      this.$router.push({ name: 'MailingCompose', params: params })
    }
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
        { text: '', value: 'rowActionEdit', sortable: false }
      ]
      const headers = this.headers || defaultHeaders
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    }
  },
  watch: {
    includeDisabled(val) {
      this.$api.storage.setItem('UserListIncludeDisabled', val)
      this.getSetItems()
    }
  }
}
</script>
<template>
  <v-container v-if="!isLoading" grid-list-md>
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <v-row nowrap align="center">
          <v-col>
            <IFXSearchField :search.sync='search'/>
          </v-col>
          <v-col>
            <v-checkbox class="action-item" label="Include disabled" v-model="includeDisabled"></v-checkbox>
          </v-col>
          <v-col>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-speed-dial
                    direction="bottom"
                    v-model="mailFab"
                    v-bind="attrs"
                  >
                    <template v-slot:activator>
                      <v-btn
                        v-model="mailFab"
                        small
                        color="green"
                        fab
                      >
                        <v-icon color="white" v-if="mailFab">
                          mdi-close
                        </v-icon>
                        <v-icon color="white" v-else>
                          mdi-email-send-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-btn
                      xSmall
                      fab
                      color="#A4F323"
                      @click="composeEmail('to')"
                      :disabled="!selected.length"
                    >
                      to:
                    </v-btn>
                    <v-btn
                      xSmall
                      fab
                      color="#86C61D"
                      @click="composeEmail('cc')"
                      :disabled="!selected.length"
                    >
                      cc:
                    </v-btn>
                    <v-btn
                      xSmall
                      fab
                      color="#669617"
                      @click="composeEmail('bcc')"
                      :disabled="!selected.length"
                    >
                      bcc:
                    </v-btn>
                  </v-speed-dial>
                </div>
              </template>
              <span>
                Email selected users
              </span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items='filteredItems'
      :headers='computedHeaders'
      :selected.sync='selected'
      :itemType='itemType'
    ></IFXItemDataTable>
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
