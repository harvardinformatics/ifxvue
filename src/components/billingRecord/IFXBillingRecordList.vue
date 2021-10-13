<script>
import IFXBillingRecordMixin from '@/components/billingRecord/IFXBillingRecordMixin'
import IFXButton from '@/components/IFXButton'
import IFXBillingRecordTransactions from './IFXBillingRecordTransactions'
// import IFXItemDataTable from '@/components/item/IFXItemDataTable'
// import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXBillingRecordList',
  components: {
    // IFXItemDataTable,
    IFXButton,
    IFXBillingRecordTransactions,
  },
  mixins: [IFXBillingRecordMixin],
  filters: {
    transactionDisplay(txn) {
      return `${txn.description}`
    },
  },
  props: {
    facility: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    organization: {
      type: Object,
      required: false,
      default: null,
    },
    app: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    this.isLoading = true
    await this.facilityBillingRecords()
    this.isLoading = false
  },
  data() {
    return {
      isLoading: true,
      selected: [],
      items: [],
      itemKey: 'id',
      message: '',
      messageType: 'info',
      updating: false,
      allHeaders: [
        { text: 'ID', value: 'id', sortable: true, hide: true },
        { text: '', value: 'data-table-expand', sortable: false },
        { text: 'State', value: 'currentState', sortable: true, width: '100px', namedSlot: true },
        { text: 'User', value: 'productUser.full_name', sortable: true },
        { text: 'Lab', value: 'account.organization', sortable: true },
        { text: 'Expense Code / PO', value: 'account.slug', sortable: true },
        { text: 'Product', value: 'product', sortable: true },
        { text: 'Charge', value: 'charge', sortable: true, width: '100px' },
        { text: 'Percent', value: 'percent', sortable: true, width: '100px' },
        { text: 'Usage id', value: 'productUsage.id', sortable: true },
        { text: 'Txn desc', value: 'transactions', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      isDownloadDisabled: false,
      rowSelectionToggle: [],
      rowSelectionToggleIndeterminate: {},
      tableCollpased: false,
      search: null,
      errors: [],
      isValid: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        rate: 0,
        charge: null,
        description: null,
        author: {},
        orgRec: {},
      },
      defaultItem: {
        rate: 0,
        charge: 0,
        description: '',
        author: {},
      },
    }
  },
  computed: {
    headers() {
      return this.allHeaders.filter((h) => !h.hide).filter((h) => !this.$vuetify.breakpoint[h.hide])
    },
    dateParts: function () {
      return this.date.split('-')
    },
    month: function () {
      return Number(this.dateParts[1])
    },
    year: function () {
      return Number(this.dateParts[0])
    },
    filteredItems: function () {
      return this.getItemsFilteredBySearch()
    },
  },
  methods: {
    getErrorMessage(error) {
      // Regular showMessage is not getting the response data properly
      let message = 'Unknown error'
      if (error) {
        if (
          error.hasOwnProperty('response')
          && error.response
          && error.response.hasOwnProperty('data')
          && error.response.data
        ) {
          message = Object.values(error.response.data).join('\n')
        } else {
          message = error
        }
      }
      return message
    },
    getItemsFilteredBySearch() {
      let items = this.items
      if (this.search) {
        const search = this.search.toString().toLowerCase()
        items = items.filter((i) => {
          let item = i
          if (i.data) {
            item = i.data
          }
          return Object.keys(item).some((j) => this.filterSearch(item[j], search))
        })
      }
      return items
    },
    facilityBillingRecords() {
      this.clearTableState()
      return this.$api.billing
        .getBillingRecords(this.facility.invoicePrefix, this.month, this.year, this.organization)
        .then((res) => (this.items = res))
    },
    toggleGroup(group) {
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      const isSelected = this.rowSelectionToggle.indexOf(group) !== -1
      records.forEach((record) => {
        const index = this.selected.findIndex((item) => record.id === item.id)
        if (index !== -1) {
          if (!isSelected) {
            this.selected.splice(index, 1)
          }
        } else if (isSelected) {
          this.selected.push(record)
        }
      })
      this.$set(this.rowSelectionToggleIndeterminate, group, false)
    },
    summaryCharges(group) {
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      const summary = records.reduce((prev, current) => prev + current.charge, 0)
      return summary
    },
    determineGroupState(e) {
      const group = e.item.account.organization
      this.$nextTick(() => {
        const records = this.filteredItems.filter((item) => item.account.organization === group)
        const checked = this.selected.filter((item) => item.account.organization === group)
        const state = checked.length !== 0 && checked.length < records.length
        this.$set(this.rowSelectionToggleIndeterminate, group, state)
        // Now set the checkbox model to the correct state
        if (checked.length) {
          if (checked.length === records.length) {
            // All are checked so add this if it isn't already there
            const index = this.rowSelectionToggle.indexOf(group)
            if (index === -1) {
              this.rowSelectionToggle.push(group)
            }
          }
        } else {
          // None are checked so remove this group
          const index = this.rowSelectionToggle.indexOf(group)
          if (index !== -1) {
            this.rowSelectionToggle.splice(index, 1)
          }
        }
      })
    },
    toggleSelectAll({ items, value }) {
      const orgSet = new Set()
      items.forEach((item) => {
        orgSet.add(item.account.organization)
      })
      this.$nextTick(() => {
        if (value) {
          // The user selected all records. Set all the checkboxes on
          this.rowSelectionToggle = Array.from(orgSet)
        } else {
          // They've cleared all records. Remove all orgs from the array
          this.rowSelectionToggle = []
        }
        // And clear indeterminate state
        this.$set(this.rowSelectionToggleIndeterminate, Array.from(orgSet), false)
      })
    },
    collpaseRows() {
      // This is a bit of a hack to collpase the group sections when the table loads
      this.$nextTick(() => {
        const table = this.$refs.table
        if (table) {
          const keys = Object.keys(table.$vnode.componentInstance.openCache)
          keys.forEach((key) => {
            table.$vnode.componentInstance.openCache[key] = false
          })
        }
      })
    },
    clearTableState() {
      this.selected = []
      this.rowSelectionToggle = []
      this.rowSelectionToggleIndeterminate = {}
    },
    closeTxnDialog() {
      this.dialog = false
    },
    openTxnDialog(item) {
      this.editedItem = { ...this.defaultItem }
      this.editedItem.rate = item.rate
      this.editedItem.orgRec = item
      this.editedItem.author = { ...this.$api.authUser }
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    async addNewTransaction(item) {
      const index = this.items.findIndex((rec) => rec.id === item.orgRec.id)
      if (index !== -1) {
        const orgBillingRec = this.items[index]
        const { charge, rate, description, author } = item
        const newTransactionData = {
          charge,
          rate,
          description,
          author,
        }
        const newTransaction = this.$api.billingTransaction.create(newTransactionData)
        orgBillingRec.addTransaction(newTransaction)
        const newBillingRec = await this.$api.billing.update(this.app, orgBillingRec)
        this.items.splice(index, 1, newBillingRec[0])
      }
      this.dialog = false
    },
  },
  watch: {
    filteredItems() {
      if (!this.tableCollpased) {
        this.collpaseRows()
        this.tableCollpased = true
      }
    },
  },
}
</script>
<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <v-container>
    <v-row>
      <v-col id="data-table">
        <v-data-table
          ref="table"
          v-if="filteredItems"
          v-model="selected"
          :items="filteredItems"
          :headers="headers"
          show-select
          show-expand
          expand-icon="mdi-menu-right"
          :itemKey="itemKey"
          :loading="isLoading"
          :items-per-page="-1"
          group-by="account.organization"
          @item-selected="determineGroupState"
          @toggle-select-all="toggleSelectAll"
        >
          <template v-slot:group.header="{ group, headers, isOpen, toggle }">
            <td :colspan="headers.length">
              <v-row>
                <v-checkbox
                  v-model="rowSelectionToggle"
                  :value="group"
                  hide-details
                  multiple
                  :indeterminate.sync="rowSelectionToggleIndeterminate[group]"
                  class="shrink ml-3 mt-0"
                  @click="toggleGroup(group)"
                ></v-checkbox>
                <div>
                  <v-btn icon small @click="toggle">
                    <v-icon>{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
                  </v-btn>
                  <span class="group-header">
                    {{ $api.organization.parseSlug(group).name }}
                  </span>
                  <span class="ml-3 font-weight-medium">
                    Total charges: {{ summaryCharges(group) | centsToDollars }}
                  </span>
                </div>
              </v-row>
              <v-row></v-row>
            </td>
          </template>
          <template v-slot:item.account.organization="{ item }">
            <span style="white-space: nowrap">
              {{ $api.organization.parseSlug(item.account.organization).name }}
            </span>
          </template>
          <template v-slot:item.currentState="{ item }">
            <span class="state-display">{{ item.currentState | stateDisplay }}</span>
          </template>
          <template v-slot:item.account.slug="{ item }">
            <span style="white-space: nowrap">{{ item.account.code }}</span>
            ({{ item.account.name }})
          </template>
          <template v-slot:item.transactions="{ item }">
            <div style="min-width: 150px">
              <v-row v-for="txn in item.transactions" :key="txn.id">
                {{ txn | transactionDisplay }}
              </v-row>
            </div>
          </template>
          <template v-slot:item.charge="{ item }">
            {{ item.charge | centsToDollars }}
          </template>
          <template v-slot:item.actions="{ item }">
            <IFXButton iconString="add" btnType="add" xSmall @action="openTxnDialog(item)" />
          </template>
          <template v-slot:expanded-item="{ item }">
            <IFXBillingRecordTransactions :billingRecord="item" />
          </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a new transaction to Billing Record {{ editedItem.orgRec.id }}</span>
            </v-card-title>
            <v-card-subtitle>
              <div class=" py-2 text-h6 font-weight-medium ">Rate is {{ editedItem.rate }}</div>
            </v-card-subtitle>

            <v-card-text>
              <v-container>
                <v-form v-model="isValid" lazy-validation>
                  <v-row>
                    <v-col>
                      <v-text-field
                        required
                        v-model="editedItem.charge"
                        label="Charge"
                        :error-messages="errors[editedItem.charge]"
                        :rules="formRules.currency"
                        prefix="$"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        required
                        v-model="editedItem.description"
                        label="Transaction description"
                        :error-messages="errors[editedItem.description]"
                        :rules="formRules.generic"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeTxnDialog">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text :disabled="!isValid" @click="addNewTransaction(editedItem)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.message-text {
  font-size: smaller;
  font-style: italic;
  color: red;
}
.state-display {
  font-size: smaller;
}
</style>
<style>
#data-table .v-data-table__expand-icon--active {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
#data-table .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
