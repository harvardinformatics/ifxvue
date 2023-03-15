<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'

import IFXBillingRecordMixin from '@/components/billingRecord/IFXBillingRecordMixin'
import IFXButton from '@/components/IFXButton'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMailButton from '@/components/mailing/IFXMailButton'
import IFXBillingRecordHeaderDecimal from '@/components/billingRecord/IFXBillingRecordHeaderDecimal'
import IFXContactablesCombobox from '@/components/IFXContactablesCombobox'
import IFXBillingRecordTransactionsDecimal from './IFXBillingRecordTransactionsDecimal'

export default {
  name: 'IFXBillingRecordListDecimal',
  components: {
    IFXButton,
    IFXSearchField,
    IFXBillingRecordTransactionsDecimal,
    IFXContactablesCombobox,
    IFXMailButton,
    IFXBillingRecordHeaderDecimal,
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
    allowChangeExpenseCode: {
      type: Boolean,
      required: false,
      default: true,
    },
    useDefaultMailButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    promiseBatchSize: {
      type: Number,
      required: false,
      default: 20,
    },
    showDates: {
      type: Boolean,
      required: false,
      default: false,
    },
    sortBy: {
      type: String,
      required: false,
      default: null,
    },
  },
  mounted() {
    this.facilityBillingRecords()
      .catch((error) => {
        const errorMessage = this.getErrorMessage(error)
        this.messageType = 'error'
        this.message = `Error loading ${this.facility.name} billing records: ${errorMessage}`
      })
      .then(async () => {
        this.expenseCodes = await this.$api.account.getList()
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
        { text: 'Start Date', value: 'startDate', sortable: true, hide: !this.showDates, namedSlot: true },
        { text: 'End Date', value: 'endDate', sortable: true, hide: !this.showDates, namedSlot: true },
        { text: 'Charge', value: 'decimalCharge', sortable: true, width: '100px' },
        { text: 'Percent', value: 'percent', sortable: true, width: '100px' },
        {
          text: 'Usage id',
          value: 'productUsage',
          namedSlot: true,
          sortable: true,
          sort: function (a, b) {
            if (a.productUsageLinkText) {
              return a.productUsageLinkText.localeCompare(b.productUsageLinkText)
            }
            if (a.productUsage) {
              return a.productUsage.id - b.productUsage.id
            }
            return 0
          },
        },
        { text: 'Transaction description', value: 'transactions', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      rowSelectionToggle: [],
      rowSelectionToggleIndeterminate: {},
      tableCollpased: false,
      errors: [],
      search: null,
      isValidTxn: false,
      isValidEdit: false,
      isValidBulkEdit: false,
      txnDialog: false,
      editDialog: false,
      notifyDialog: false,
      editedItem: {
        rate: 0,
        charge: 0,
        decimalCharge: 0,
        description: null,
        author: {},
        orgRec: {},
        index: null,
      },
      defaultItem: {
        rate: 0,
        charge: 0,
        decimalCharge: 0,
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
      newExpenseCode: null,
      showChangeExpenseCodeDialog: false,
      recordIDsToBeChanged: [],
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
      let br = this.items[index]
      if (br.billingRecordStates?.length) {
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
      const result = items.some((record) => record?.currentState === 'FINAL')
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
          let value = this.filteredItems[i]
          keys.forEach((key) => {
            value = value[key]
          })
          // If value is undefined, but not false
          if (!value && value !== false) continue
          // TODO: make this check more generalized for multiple item types
          // Check for different item types
          if (header.value === 'startDate' || header.value === 'endDate') {
            value = moment(String(value)).format('M/DD/YYYY h:mm A')
          } else if (header.value.toLowerCase().includes('date')) {
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
    async setState(items, state) {
      const promises = []
      const toBeUpdated = []
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i]
        if (!item.billingRecordStates) {
          promises.push(this.apiRef.getByID(this.facility.invoicePrefix, item.id))
          if (i !== 0 && i % this.promiseBatchSize === 0) {
            // Wait a bit to not overwhelm the backend
            /* eslint-disable no-await-in-loop */
            await new Promise((r) => setTimeout(r, 500))
          }
        } else {
          item.billingRecordStates.push({ name: state, user: '', approvers: [], comment: '' })
          toBeUpdated.push(item)
        }
      }
      const results = await Promise.all(promises)
      results.forEach((item) => {
        item.billingRecordStates.push({ name: state, user: '', approvers: [], comment: '' })
        toBeUpdated.push(item)
      })

      return this.$api.billingRecord.bulkUpdate(toBeUpdated, this.facility.applicationUsername)
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
      const summary = records.reduce((prev, current) => prev + parseInt(current.decimalCharge, 10), 0)
      return summary
    },
    getSummaryDetails(group) {
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      const expenseMap = new Map()
      records.forEach((item) => {
        const charge = item.decimalCharge
        if (expenseMap.has(item.account.slug)) {
          const value = expenseMap.get(item.account.slug)
          expenseMap.set(item.account.slug, value + charge)
        } else {
          expenseMap.set(item.account.slug, charge)
        }
      })
      return expenseMap
    },
    determineGroupState(e) {
      const group = e.item.account.organization
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      let checked = this.selected.filter((item) => item.account.organization === group).length
      checked += e.value ? 1 : -1
      const state = checked !== 0 && checked < records.length
      this.$set(this.rowSelectionToggleIndeterminate, group, state)
      // Now set the checkbox model to the correct state
      if (checked) {
        if (checked === records.length) {
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
    },
    toggleSelectAll({ items, value }) {
      const orgSet = new Set()
      items.forEach((item) => {
        orgSet.add(item.account.organization)
      })
      if (value) {
        // The user selected all records. Set all the checkboxes on
        this.rowSelectionToggle = Array.from(orgSet)
      } else {
        // They've cleared all records. Remove all orgs from the array
        this.rowSelectionToggle = []
      }
      // And clear indeterminate state
      this.$set(this.rowSelectionToggleIndeterminate, Array.from(orgSet), false)
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
      const { charge, decimalCharge, rate, description, author } = item
      const newTransactionData = {
        charge,
        decimalCharge,
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
          this.showChangeExpenseCodeDialog = false
        })
    },
    async openEditDialog(item) {
      const index = this.items.findIndex((rec) => rec.id === item.id)
      if (index !== -1) {
        this.editingIndex = index
        this.editedRecord = cloneDeep(item)
        this.newExpenseCode = await this.$api.account.create(item.account)

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
      return item.currentState !== 'FINAL'
    },
    allowEditingRecords(item) {
      return item.currentState !== 'FINAL'
    },
    defaultNotifyLabManagers() {
      const orgSlugs = this.items.map((item) => item.account.organization)
      this.$api.notifyLabManagers(
        [...new Set(orgSlugs)],
        this.facility,
        this.year,
        this.month,
        this.recipientField,
        this.$router
      )
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
    buildNotificationlList() {
      let list = ''
      if (this.selectedContactables.length) {
        list = this.selectedContactables.map((contact) => contact.name).join(', ')
      } else {
        list = 'Lab managers'
      }
      return list
    },
    async openChangeExpenseCodeDialog() {
      // Assume they want to change all records they've selected
      this.recordIDsToBeChanged = this.selected.map((record) => record.id)
      this.showChangeExpenseCodeDialog = true
    },
    closeChangeExpenseCodeDialog() {
      this.recordIDsToBeChanged = []
      this.showChangeExpenseCodeDialog = false
    },
    async changeExpenseCode() {
      const recordsToChange = []
      const groups = new Set()
      this.updating = true
      for (let i = 0; i < this.recordIDsToBeChanged.length; i++) {
        const index = this.items.findIndex((rec) => rec.id === this.recordIDsToBeChanged[i])
        const newBillingRec = cloneDeep(await this.getFullBillingRecordByItemIndex(index))
        newBillingRec.account = this.newExpenseCode.data
        recordsToChange.push(newBillingRec)
      }
      this.$api.billingRecord
        .bulkUpdate(recordsToChange, this.facility.applicationUsername)
        .then((response) => {
          if (response.error) {
            this.showMessage(response.error)
          } else {
            // Replace all the new billing records
            response.data.forEach((record) => {
              const newBillingRec = this.$api.billingRecord.create(record)
              let index = this.items.findIndex((rec) => rec.id === record.id)
              this.items.splice(index, 1, newBillingRec)
              // Now replace the records in the selected array
              index = this.selected.findIndex((rec) => rec.id === record.id)
              // Save potentially old org
              groups.add(this.selected[index].account.organization)
              this.selected.splice(index, 1, newBillingRec)
              // Save the (deduped) org for setting the header checkboxes
              groups.add(newBillingRec.account.organization)
            })
            // Now set the header checkboxes
            Array.from(groups).forEach((org) => {
              this.setHeaderCheckBoxState(org)
            })
            this.showMessage(`Successfully updated ${response.data.length} billing record(s)`)
          }
        })
        .catch((error) => {
          const message = this.getErrorMessage(error)
          this.showMessage(message)
        })
        .finally(() => {
          this.isLoading = false
          this.updating = false
          this.closeChangeExpenseCodeDialog()
        })
    },
    setHeaderCheckBoxState(group) {
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      const checked = this.selected.filter((item) => item.account.organization === group).length
      const state = checked !== 0 && checked < records.length
      this.$set(this.rowSelectionToggleIndeterminate, group, state)
      // Now set the checkbox model to the correct state
      if (checked) {
        if (checked === records.length) {
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
        <v-row class="d-flex justify-space-between w-full">
          <v-col cols="4">
            <div class="text-no-wrap">
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
                <v-row dense class="d-flex justify-start align-center">
                  <v-col class="pa-2">
                    <IFXMailButton
                      v-if="useDefaultMailButton"
                      v-model="recipientField"
                      :disabled="!filteredItems.length"
                      toolTip="Notify Lab Managers"
                      @input="defaultNotifyLabManagers()"
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
                              <v-card-text>
                                <v-form v-model="isValid">
                                  <v-row class="text-body-1">
                                    <v-col v-if="selected.length">
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
                                    <v-col cols="12" class="text-body-1 results-section">
                                      <div class="text-body-1 font-weight-medium text-center">
                                        Email Notification Results
                                      </div>
                                      <div class="text-body-2 font-weight-regular text-center">
                                        Sent to {{ buildNotificationlList() }}
                                      </div>
                                      <div v-if="emailResponse.successes.length" class="my-3 pb-2 border-bottom">
                                        Successfully
                                        <span class="green--text">sent</span>
                                        for the following organizations:
                                        <ul class="lab-manager-list">
                                          <li v-for="value in emailResponse.successes" :key="value">
                                            <span>{{ value }}</span>
                                          </li>
                                        </ul>
                                      </div>
                                      <div
                                        v-if="Object.keys(emailResponse.errors).length"
                                        class="my-3 pb-2 border-bottom"
                                      >
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
                                      <div v-if="emailResponse.nobrs.length" class="my-3 pb-2 border-bottom">
                                        The following organizations had&nbsp;
                                        <span class="yellow--text text--darken-3">no billing records</span>
                                        :
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
                                <v-btn color="secondary" text @click="notifyDialog = false">
                                  {{ emailResponse ? 'Close' : 'Cancel' }}
                                </v-btn>
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
                  <v-col v-if="allowChangeExpenseCode">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div v-on="on">
                          <v-btn
                            :disabled="selected.length == 0 || billingRecordsAreFinal(selected)"
                            v-bind="attrs"
                            fab
                            small
                            color="green"
                            @click="openChangeExpenseCodeDialog()"
                          >
                            <!-- <v-icon dark>mdi-file-replace-outline</v-icon> -->
                            <v-icon dark>mdi-playlist-edit</v-icon>
                          </v-btn>
                        </div>
                      </template>
                      <span>Edit billing record account</span>
                    </v-tooltip>
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
            :sort-by="sortBy"
            group-by="account.organization"
            @item-selected="determineGroupState"
            @toggle-select-all="toggleSelectAll"
          >
            <template
              v-slot:group.header="{ group, headers, isOpen, toggle }"
              v-on:rendered="itemRendered('group.header')"
            >
              <IFXBillingRecordHeaderDecimal
                :key="group"
                :item="item"
                :group="group"
                :colSpan="headers.length"
                :isOpen="isOpen"
                :showCheckboxes="showCheckboxes"
                :toggle="toggle"
                :rowSelectionToggle.sync="rowSelectionToggle"
                :rowSelectionToggleIndeterminateGroup.sync="rowSelectionToggleIndeterminate[group]"
                :summaryCharges="summaryCharges(group)"
                :toggleGroup="toggleGroup"
                :getSummaryDetails="getSummaryDetails"
                @
              />
            </template>
            <template v-slot:item.id="{ item }">
              <a href="" @click.prevent="navigateToDetail(item.id)">{{ item.id }}</a>
            </template>

            <template v-slot:item.account.organization="{ item }">
              <span class="text-no-wrap">
                {{ $api.organization.parseSlug(item.account.organization).name }}
              </span>
            </template>
            <template v-slot:item.currentState="{ item }">
              <span class="state-display">{{ item.currentState | stateDisplay }}</span>
            </template>
            <template v-slot:item.account.slug="{ item }">
              <span class="text-no-wrap">{{ item.account.code }}</span>
              ({{ item.account.name }})
            </template>
            <template v-slot:item.transactions="{ item }">
              <div style="min-width: 150px">
                <div class="my-1" v-for="txn in item.transactions" :key="txn.id">
                  {{ txn | transactionDisplay }}
                </div>
              </div>
            </template>
            <template v-slot:item.decimalCharge="{ item }">
              {{ item.decimalCharge | dollars }}
            </template>
            <template v-slot:item.startDate="{ item }">
              <span class="text-no-wrap">
                {{ item.startDate | humanDatetime }}
              </span>
            </template>
            <template v-slot:item.endDate="{ item }">
              <span class="text-no-wrap">
                {{ item.endDate | humanDatetime }}
              </span>
            </template>
            <template v-slot:item.productUsage="{ item }">
              <span v-if="item.productUsageLinkText" class="text-no-wrap">
                <a :href="item.productUsageUrl">{{ item.productUsageLinkText }}</a>
              </span>
              <span v-else class="text-no-wrap">
                {{ item.productUsage.id }}
              </span>
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
              <IFXBillingRecordTransactionsDecimal :billingRecord="item" />
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
          <v-dialog v-model="showChangeExpenseCodeDialog" v-if="showChangeExpenseCodeDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit Selected Billing Records</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model="isValidBulkEdit">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        required
                        v-model="newExpenseCode"
                        :items="expenseCodes"
                        item-text="slug"
                        label="New Expense Code / PO"
                        :error-messages="errors[newExpenseCode]"
                        :rules="formRules.generic"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="records-container">
                    <v-col cols="12">
                      <ul class="text-body-1">
                        <li v-for="record in selected" :key="record.id">
                          <div class="font-weight-medium mr-3">
                            Billing Record #{{ record.id }}
                            <span class="font-weight-regular">({{ record.account.name }})"</span>
                          </div>
                          <div class="font-weight-light mb-5">({{ record.description }})"</div>
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <div v-if="updating">
                  <span class="mr-3">Updating billing records...</span>
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <v-spacer></v-spacer>
                <v-btn color="secondary" text @click="closeChangeExpenseCodeDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="!isValidBulkEdit" @click="changeExpenseCode">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<style lang="scss" scoped>
.w-full {
  width: 100%;
}
.records-container {
  max-height: 50vh;
  overflow: auto;
}
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
.results-section {
  max-height: 30rem;
  overflow: auto;
}
.border-bottom {
  border-bottom: 1px solid #ccc;
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
