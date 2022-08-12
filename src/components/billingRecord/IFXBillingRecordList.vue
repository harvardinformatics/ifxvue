<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import IFXBillingRecordMixin from '@/components/billingRecord/IFXBillingRecordMixin'
import IFXButton from '@/components/IFXButton'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMailButton from '@/components/mailing/IFXMailButton'
import IFXContactablesCombobox from '@/components/IFXContactablesCombobox'
import IFXBillingRecordTransactions from './IFXBillingRecordTransactions'

export default {
  name: 'IFXBillingRecordList',
  components: {
    IFXButton,
    IFXSearchField,
    IFXBillingRecordTransactions,
    IFXContactablesCombobox,
    IFXMailButton,
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
    organization: {
      type: String,
      required: false,
      default: null,
    },
    date: {
      type: String,
      required: true,
    },
    allowDownloads: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowApprovals: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowInvoiceGeneration: {
      type: Boolean,
      required: false,
      default: false,
    },
    useDefaultMailButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  mounted() {
    this.facilityBillingRecords()
      .catch((error) => {
        const errorMessage = this.getErrorMessage(error)
        this.messageType = 'error'
        this.message = `Error loading ${this.facility.name} billing records: ${errorMessage}`
      })
      .finally(() => (this.isLoading = false))
  },
  data() {
    return {
      isLoading: true,
      items: [],
      selected: [],
      itemKey: 'id',
      message: '',
      messageType: 'info',
      updating: false,
      allHeaders: [
        { text: '', value: 'data-table-expand', sortable: false },
        { text: 'ID', value: 'id', sortable: true, hide: false },
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
      rowSelectionToggle: [],
      rowSelectionToggleIndeterminate: {},
      tableCollpased: false,
      errors: [],
      search: null,
      isValidTxn: false,
      isValidEdit: false,
      txnDialog: false,
      editDialog: false,
      notifyDialog: false,
      editedItem: {
        rate: 0,
        charge: 0,
        description: null,
        author: {},
        orgRec: {},
        index: null,
      },
      defaultItem: {
        rate: 0,
        charge: 0,
        description: '',
        author: {},
      },
      mailFab: false,
      recipientField: '',
      editedRecord: {},
      expenseCodes: [],
      editingIndex: null,
      selectedContactables: [],
      contactables: [],
      sendingNotifications: false,
      emailResponse: null,
    }
  },
  computed: {
    headers() {
      return this.allHeaders.filter((h) => !h.hide).filter((h) => !this.$vuetify.breakpoint[h.hide])
    },
    month: function () {
      return Number(this.dateParts()[1])
    },
    year: function () {
      return Number(this.dateParts()[0])
    },
    filteredItems: function () {
      return this.getItemsFilteredBySearch()
    },
    generateInvoicesToolTip: function () {
      return this.billingRecordsAreFinal(this.selected)
        ? 'Re-generate invoices for selected records.  This will inactivate existing invoices.'
        : 'Generate invoices for selected records'
    },
    approveAllToolTip: function () {
      return this.billingRecordsAreFinal(this.items)
        ? 'Cannot approve billing records that are FINAL'
        : 'Approve all billing records'
    },
    approveSelectedToolTip: function () {
      return this.billingRecordsAreFinal(this.selected)
        ? 'Cannot approve billing records that are FINAL'
        : 'Approve selected billing records'
    },
    showCheckboxes: function () {
      return this.allowDownloads || this.allowApprovals || this.allowInvoiceGeneration
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    dateParts: function () {
      return this.date.split('-')
    },
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
    async getFullBillingRecordByItemIndex(index) {
      let br = this.items?.[index]
      if (br?.billingRecordStates?.length) {
        // Full record is already there
        return br
      }
      if (br.id) {
        // Go get it
        br = await this.apiRef.getByID(this.facility.invoicePrefix, br.id)
        this.$set(this.items, index, br)
        return br
      }
      console.log(`Billing record with id not found at item index ${index}`)
      return null
    },
    billingRecordsAreFinal(items) {
      // Returns true if any records in the list are in the FINAL state
      if (!items || !items.length) {
        return false
      }
      const result = items.some((record) => record.currentState === 'FINAL')
      return result
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
    // TODO: this is inefficient because it's checking all attributes
    // Make it check only relevant fields
    // Taken almost directly from the Vuetify docs
    filterSearch(v, s) {
      let search = s
      if (search && v) {
        const val = v.toString().toLowerCase()
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search = search.replace('.', '')
        }
        return val !== null && ['undefined', 'boolean'].indexOf(typeof val) === -1 && val.indexOf(search) !== -1
      }
      return false
    },
    getLabelsForExport() {
      return this.allHeaders.map((h) => h.text)
    },
    getDataForExport() {
      /* eslint-disable no-plusplus, no-continue */
      const formattedItems = []
      // Loop through filtered items
      for (let i = 0; i < this.filteredItems.length; i++) {
        // Init new record, will be a row in the exported file
        const newRecord = {}
        // Loop through column headers
        for (let j = 0; j < this.allHeaders.length; j++) {
          const header = this.allHeaders[j]
          // Key used to access data.  May be dot-separated
          const keys = header.value.split('.')
          // Formatted key for displayed that data in final file
          const formattedKey = header.text
          let value = this.items[i]
          keys.forEach((key) => {
            value = value[key]
          })
          // If value is undefined, but not false
          if (!value && value !== false) continue
          // TODO: make this check more generalized for multiple item types
          // Check for different item types
          if (header.value.toLowerCase().includes('date')) {
            value = value.substring(0, 10)
          } else if (header.value === 'account.organization') {
            value = this.$api.organization.parseSlug(value).name
          } else if (header.value === 'transactions') {
            value = value.map((v) => v.description).join('; ')
          }
          newRecord[formattedKey] = value
        }
        formattedItems.push(newRecord)
      }
      return formattedItems
      /* eslint-enable no-plusplus, no-continue */
    },
    getNameForExport() {
      const today = new Date()
      return `BillingRecord_${this.facility.name}_Export_${today.toISOString().substring(0, 10)}.csv`
    },
    facilityBillingRecords() {
      this.clearTableState()
      return this.$api.billingRecord
        .getList(this.facility.invoicePrefix, this.month, this.year, this.organization)
        .then((res) => (this.items = res))
    },
    setState(items, state) {
      items.forEach((s) => {
        s.billingRecordStates.push({ name: state, user: '', approvers: [], comment: '' })
      })
      return this.$api.billingRecord.bulkUpdate(items, this.facility.applicationUsername)
    },
    approve(all) {
      if (all) {
        this.selected = this.items
      }
      this.updating = true
      this.setState(this.selected, 'LAB_APPROVED')
        .then((response) => {
          this.updating = false
          this.showMessage(`Successfully updated ${response.data.length} billing record(s)`)
          this.items = []
          this.isLoading = true
          this.facilityBillingRecords()
            .then((resp) => (this.message = resp.msg))
            .catch((error) => {
              const errorMessage = this.getErrorMessage(error)
              this.message = `Error loading ${this.facility.name} billing records: ${errorMessage}`
            })
            .finally(() => (this.isLoading = false))
        })
        .catch((error) => {
          this.isLoading = false
          this.updating = false
          const message = this.getErrorMessage(error)
          this.showMessage(message)
        })
    },
    async generateInvoices() {
      this.updating = true
      this.message = ''
      const allFinal = this.selected.every((record) => record.currentState === 'FINAL')
      if (!allFinal) {
        await this.setState(this.selected, 'FINAL')
      }
      const orgSet = new Set()
      this.selected.forEach((item) => {
        orgSet.add(item.account.organization)
      })
      const selectedOrgs = Array.from(orgSet)
      this.$api.invoice
        .generate(this.facility.invoicePrefix, this.month, this.year, selectedOrgs)
        .then((ret) => {
          const url = this.$router.resolve({
            name: 'InvoiceList',
            query: { month: this.month.toString().padStart(2, '0'), year: this.year },
          }).href
          if (ret.message) {
            // eslint-disable-next-line no-param-reassign
            ret.message = ret.message.replace(/\n/g, '<br/>')
            this.message = `<p>${ret.message}</p>`
          }
          if (ret.message.includes('Failed') || ret.message.includes('Unable')) {
            this.messageType = 'error'
          } else {
            this.messageType = 'success'
          }
          this.updating = false
          if (this.messageType !== 'error') {
            this.message = `${this.message}<p><a href="${url}">Go to Invoices</a></p>`
          }
          this.isLoading = true
          this.facilityBillingRecords()
            .catch((error) => {
              const errorMessage = this.getErrorMessage(error)
              this.showMessage(`Error loading ${this.facility.name} billing records: ${errorMessage}`)
            })
            .finally(() => {
              this.isLoading = false
            })
        })
        .catch((error) => {
          this.updating = false
          this.messageType = 'error'
          this.message = this.getErrorMessage(error)
        })
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
      this.txnDialog = false
    },
    async openTxnDialog(item) {
      const index = this.items.findIndex((rec) => rec.id === item.id)
      const br = await this.getFullBillingRecordByItemIndex(index)
      if (index !== -1) {
        this.editedItem = { ...this.defaultItem }
        this.editedItem.rate = br.rate
        this.editedItem.orgRec = br
        this.editedItem.index = index
        this.editedItem.author = { ...this.$api.authUser }
        this.$nextTick(() => {
          this.txnDialog = true
        })
      }
    },
    addNewTransaction(item) {
      const orgBillingRec = item.orgRec
      const { charge, rate, description, author } = item
      const newTransactionData = {
        charge,
        rate,
        description,
        author,
      }
      const newTransaction = this.$api.billingTransaction.create(newTransactionData)
      orgBillingRec.addTransaction(newTransaction)
      this.updateBillingRecord(orgBillingRec, item.index)
    },
    updateBillingRecord(newRecord, index) {
      this.updating = true
      this.$api.billingRecord
        .bulkUpdate([newRecord], this.facility.applicationUsername)
        .then((response) => {
          if (response.error) {
            this.showMessage(response.error)
          } else {
            this.showMessage('Successfully updated billing record')
          }
          const newBillingRec = this.$api.billingRecord.create(response.data[0])
          this.items.splice(index, 1, newBillingRec)
        })
        .catch((error) => {
          this.isLoading = false
          const message = this.getErrorMessage(error)
          this.showMessage(message)
        })
        .finally(() => {
          this.updating = false
          this.txnDialog = false
          this.editDialog = false
        })
    },
    async openEditDialog(item) {
      const index = this.items.findIndex((rec) => rec.id === item.id)
      if (index !== -1) {
        if (this.$api.auth.can('set-any-account', this.$api.authUser)) {
          this.expenseCodes = await this.$api.account.getList()
        } else {
          const currentUserRecord = await this.$api.auth
            .getCurrentUserRecord()
            .catch(() => this.showMessage('Could not get user record. '))
          this.expenseCodes = currentUserRecord.accounts
        }

        this.editingIndex = index
        this.editedRecord = cloneDeep(item)
        this.newExpenseCode = this.$api.account.create(item.account)

        this.editDialog = true
      }
    },
    closeEditDialog() {
      this.editDialog = false
      this.editedRecord = {}
      this.editingIndex = null
    },
    async updateSpecificRecord(billingRec) {
      const index = this.items.findIndex((rec) => rec.id === billingRec.id)
      const newBillingRec = await this.getFullBillingRecordByItemIndex(index)
      newBillingRec.account = this.newExpenseCode.data
      this.updateBillingRecord(newBillingRec, this.editingIndex)
      this.closeEditDialog()
    },
    navigateToDetail(id) {
      this.rtr.push({
        name: `${this.itemType}Detail`,
        params: { id, facility_id: this.facility.id },
        query: { next: this.$route.path },
      })
    },
    allowAddingTransactions(item) {
      return this.$api.auth.can('add-transactions', this.$api.authUser) && item.currentState !== 'FINAL'
    },
    allowEditingRecords(item) {
      return this.$api.auth.can('edit-records', this.$api.authUser) && item.currentState !== 'FINAL'
    },
    async notifyLabManagers() {
      this.emailResponse = null
      this.sendingNotifications = true
      const orgs = this.selected.length ? this.selected : this.filteredItems
      const orgSlugs = orgs.map((item) => item.account.organization)
      try {
        const response = await this.$api.reviewLabManagerNotifications(
          [...new Set(orgSlugs)],
          this.selectedContactables,
          this.facility,
          this.year,
          this.month
        )
        this.emailResponse = response.data
      } catch (error) {
        this.emailResponse = null
        const message = this.getErrorMessage(error)
        this.showMessage(message)
      }
      this.sendingNotifications = false
    },
    getSelectedOrgs() {
      const orgSet = new Set()
      this.selected.forEach((item) => {
        orgSet.add(item.account.organization)
      })
      return Array.from(orgSet)
    },
    openNotifyDialog() {
      if (!this.contactables.length) {
        // If we haven't fetched the contactables list, do so now
        this.$api.contactables.getList().then((result) => {
          this.contactables = result
        })
      }
      // Clear any previous usage
      this.selectedContactables.splice(0)
      this.emailResponse = null
      this.notifyDialog = true
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
    <v-card>
      <v-card-title>
        <v-row class="d-flex justify-space-between">
          <v-col cols="4">
            <div>
              {{ facility.name }}
            </div>
          </v-col>
          <v-col cols="3">
            <v-row dense>
              <v-col>
                <IFXSearchField :search.sync="search" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row dense class="d-flex flex-nowrap justify-end align-start">
              <v-col v-if="updating">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-col>
              <v-col v-else>
                <v-row dense class="d-flex justify-space-between align-center">
                  <v-col class="pa-2">
                    <IFXMailButton
                      v-if="useDefaultMailButton"
                      v-model="recipientField"
                      :disabled="!filteredItems.length"
                      toolTip="Notify Lab Managers"
                      @input="notifyLabManagers()"
                    ></IFXMailButton>
                    <v-tooltip top v-else>
                      <template v-slot:activator="{ on, attrs }">
                        <div v-on="on">
                          <v-btn small fab color="green" v-bind="attrs" @click="openNotifyDialog">
                            <v-icon dark color="white">mdi-email-send-outline</v-icon>
                          </v-btn>

                          <v-dialog v-bind="attrs" v-model="notifyDialog" max-width="600px">
                            <v-card>
                              <v-card-title>
                                <span class="text-h5">Notify Lab Managers</span>
                              </v-card-title>
                              <!-- <v-card-subtitle>
                                Send email to the lab managers of all selected organizations
                              </v-card-subtitle> -->
                              <v-card-text>
                                <v-form v-model="isValid">
                                  <v-row class="text-body-1">
                                    <v-col v-if="selected.length">
                                      <!-- <v-list dense>
                                        <v-subheader>Send to the managers for the following labs:</v-subheader>
                                        <v-list-item v-for="org in getSelectedOrgs()" :key="org">
                                          <v-list-item-content>
                                            <v-list-item-title>
                                              {{ $api.organization.parseSlug(org).name }}
                                            </v-list-item-title>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list> -->
                                      <div class="mb-2">Send to the managers for the following labs:</div>
                                      <ul class="lab-manager-list">
                                        <li v-for="org in getSelectedOrgs()" :key="org" class="font-weight-medium">
                                          {{ $api.organization.parseSlug(org).name }}
                                        </li>
                                      </ul>
                                    </v-col>
                                    <v-col v-else>
                                      <div class="font-weight-medium">Send to all lab managers</div>
                                    </v-col>
                                  </v-row>
                                  <v-row no-gutters>
                                    <v-col cols="12">
                                      <div class="text-divider font-italic text-center">
                                        Or specify email addresses directly
                                      </div>
                                      <IFXContactablesCombobox
                                        label="To:"
                                        v-model="selectedContactables"
                                        :contactables="contactables"
                                      />
                                    </v-col>
                                  </v-row>
                                  <div v-if="sendingNotifications">
                                    Sending emails...
                                    <v-progress-linear indeterminate></v-progress-linear>
                                  </div>
                                  <v-row no-gutters v-if="emailResponse">
                                    <v-col cols="12" class="text-body-1">
                                      <div class="text-body-1 font-weight-medium text-center">Email Notification Results</div>
                                      <div v-if="Object.keys(emailResponse.errors).length">
                                        The following
                                        <span class="red--text">errors</span>
                                        occurred trying to send emails:
                                        <ul class="list-style-none mt-1">
                                          <li v-for="(value, key) in emailResponse.errors" :key="key">
                                            <span>To the {{ key }}</span>
                                            <ul class="error-list">
                                              <li v-for="error in value" :key="error">
                                                {{ error }}
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
                                      </div>
                                      <div v-if="emailResponse.successes.length" class="mt-2">
                                        Successfully <span class="green--text">sent</span> for the following organizations:
                                        <ul class="lab-manager-list">
                                          <li v-for="value in emailResponse.successes" :key="value">
                                            <span>{{ value }}</span>
                                          </li>
                                        </ul>
                                      </div>
                                      <div v-if="emailResponse.nobrs.length" class="mt-2">
                                        The following <span class="yellow--text text--darken-3">organizations</span> had no billing records:
                                        <ul class="lab-manager-list">
                                          <li v-for="value in emailResponse.nobrs" :key="value">
                                            <span>{{ value }}</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-form>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" text @click="notifyDialog = false">Cancel</v-btn>
                                <v-btn color="blue darken-1" text :disabled="!isValid" @click="notifyLabManagers">
                                  Notify
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </template>
                      <span>Notify Lab Managers</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class="pa-2" v-if="allowApprovals">
                    <v-row dense class="d-flex flex-nowrap">
                      <v-col>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-on="on">
                              <v-btn
                                :disabled="selected.length == 0 || billingRecordsAreFinal(selected)"
                                v-bind="attrs"
                                fab
                                small
                                color="green"
                                @click="approve()"
                              >
                                <v-icon dark>done</v-icon>
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ approveSelectedToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                      <v-col>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-on="on">
                              <v-btn
                                :disabled="billingRecordsAreFinal(items) || isLoading || items.length == 0"
                                v-bind="attrs"
                                fab
                                small
                                color="green"
                                @click="approve(true)"
                              >
                                <v-icon dark>done_all</v-icon>
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ approveAllToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pa-2" v-if="allowDownloads">
                    <v-row dense>
                      <v-col>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-on="on">
                              <download-csv
                                :class="{ 'download-disabled': isLoading }"
                                :labels="getLabelsForExport()"
                                :data="getDataForExport()"
                                :name="getNameForExport()"
                                v-bind="attrs"
                              >
                                <IFXButton
                                  :disabled="isLoading"
                                  small
                                  class="download-btn"
                                  btnType="download"
                                ></IFXButton>
                              </download-csv>
                            </div>
                          </template>
                          <span>Download billing records in csv format</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pa-2" v-if="allowInvoiceGeneration">
                    <v-row dense>
                      <v-col>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-on="on">
                              <v-btn
                                :disabled="
                                  isLoading ||
                                  selected.length == 0 ||
                                  !$api.auth.can('generate-invoices', $api.authUser)
                                "
                                v-bind="attrs"
                                :color="billingRecordsAreFinal(selected) ? 'error' : 'blue'"
                                small
                                fab
                                @click="generateInvoices()"
                              >
                                <v-icon>payments</v-icon>
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ generateInvoicesToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row dense class="d-flex justify-space-around">
          <v-col v-if="message" cols="12" class="d-flex flex-grow-1">
            <v-alert dismissible :type="messageType" border="left" elevation="2" colored-border>
              <span v-html="message"></span>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row>
        <v-col id="data-table">
          <v-data-table
            ref="table"
            v-if="filteredItems"
            v-model="selected"
            :items="filteredItems"
            :headers="headers"
            :show-select="showCheckboxes"
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
                    v-if="showCheckboxes"
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
              </td>
            </template>
            <template v-slot:item.id="{ item }">
              <a href="" @click.prevent="navigateToDetail(item.id)">{{ item.id }}</a>
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
              <div class="d-flex flex-row">
                <IFXButton
                  v-if="allowAddingTransactions(item)"
                  iconString="add"
                  btnType="add"
                  xSmall
                  @action="openTxnDialog(item)"
                />
                <IFXButton
                  class="ml-2"
                  v-if="allowEditingRecords(item)"
                  iconString="edit"
                  btnType="edit"
                  xSmall
                  @action="openEditDialog(item)"
                />
              </div>
            </template>
            <template v-slot:expanded-item="{ item }">
              <IFXBillingRecordTransactions :billingRecord="item" />
            </template>
          </v-data-table>
          <v-dialog v-model="txnDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Add a new transaction to Billing Record {{ editedItem.orgRec.id }}</span>
              </v-card-title>
              <v-card-subtitle>
                <div class="py-2 text-h6 font-weight-medium">Rate is {{ editedItem.rate }}</div>
              </v-card-subtitle>

              <v-card-text>
                <v-form v-model="isValidTxn">
                  <v-row>
                    <v-col>
                      <v-currency-field
                        required
                        v-model="editedItem.charge"
                        label="Charge"
                        :error-messages="errors[editedItem.charge]"
                        :rules="formRules.currency"
                        prefix="$"
                        allow-negative
                      ></v-currency-field>
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
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="closeTxnDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="!isValidTxn" @click="addNewTransaction(editedItem)">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="editDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Billing Record {{ editedRecord.id }}</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model="isValidEdit">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        required
                        v-model="newExpenseCode"
                        :items="expenseCodes"
                        item-text="slug"
                        item-value="slug"
                        label="Expense Code / PO"
                        :error-messages="errors[newExpenseCode]"
                        :rules="formRules.generic"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        required
                        v-model="editedRecord.description"
                        label="Billing Record description"
                        :error-messages="errors[description]"
                        :rules="formRules.generic"
                        disabled
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="closeEditDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="!isValidEdit" @click="updateSpecificRecord(editedRecord)">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<style lang="scss" scoped>
.message-text {
  font-size: smaller;
  font-style: italic;
  color: red;
}
.state-display {
  font-size: smaller;
}
.text-divider {
  display: flex;
  align-items: center;
  letter-spacing: 0.1em;
  --text-divider-gap: 1rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background-color: silver;
    flex-grow: 1;
  }

  &::before {
    margin-right: var(--text-divider-gap);
  }

  &::after {
    margin-left: var(--text-divider-gap);
  }
}
.lab-manager-list {
  list-style: inside;
  list-style-type: square;
}
.error-list {
  list-style-type: circle;
}
.list-style-none {
  list-style-type: none;
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
