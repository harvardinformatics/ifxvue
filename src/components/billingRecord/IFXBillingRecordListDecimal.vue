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

export default {
  name: 'IFXBillingRecordListDecimal',
  components: {
    IFXButton,
    IFXSearchField,
    IFXContactablesCombobox,
    IFXMailButton,
    IFXBillingRecordHeaderDecimal,
  },
  mixins: [IFXBillingRecordMixin],
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
    allowDeleteBillingRecords: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowUsageReport: {
      type: Boolean,
      required: false,
      default: false,
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
    showStartDate: {
      type: Boolean,
      required: false,
      default: false,
    },
    sortBy: {
      type: String,
      required: false,
      default: null,
    },
    showTotals: {
      type: Boolean,
      required: false,
      default: false,
    },
    totalUnits: {
      type: String,
      required: false,
      default: 'hours',
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
        { title: '', key: 'data-table-expand', sortable: false },
        { title: 'ID', key: 'id', sortable: true, hide: false },
        { title: 'State', key: 'currentState', sortable: true, width: '100px', namedSlot: true },
        { title: 'User', key: 'productUser.full_name', sortable: true },
        { title: 'Lab', key: 'account.organization', sortable: true },
        { title: 'Expense Code / PO', key: 'account.slug', sortable: true },
        { title: 'Product', key: 'product', sortable: true },
        {
          title: 'Start Date',
          key: 'startDate',
          sortable: true,
          hide: !this.showDates && !this.showStartDate,
          namedSlot: true,
        },
        { title: 'End Date', key: 'endDate', sortable: true, hide: !this.showDates, namedSlot: true },
        { title: 'Charge', key: 'decimalCharge', sortable: true, width: '100px' },
        { title: 'Percent', key: 'percent', sortable: true, width: '100px' },
        {
          title: 'Usage id',
          key: 'productUsage',
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
        { title: 'Transaction description', key: 'transactions', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      rowSelectionToggle: [],
      rowSelectionToggleIndeterminate: {},
      tableCollpased: false,
      errors: [],
      search: null,
      isValid: false,
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
      showUsageReportDialog: false,
      loadingUsageReport: false,
      groupBy: [
        {
          key: 'account.organization',
          order: 'asc',
        },
      ],
    }
  },
  computed: {
    headers() {
      return this.allHeaders.filter((h) => !h.hide).filter((h) => !this.$vuetify.display[h.hide])
    },
    sortByArray() {
      return this.sortBy ? [{ key: this.sortBy, order: 'asc' }] : []
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
    deleteSelectedToolTip: function () {
      return this.billingRecordsAreFinal(this.selected)
        ? 'Can only delete billing records that are INIT or PENDING_LAB_APPROVAL'
        : 'Delete selected billing records'
    },
    showCheckboxes: function () {
      return this.allowDownloads || this.allowApprovals || this.allowInvoiceGeneration || this.allowDeleteBillingRecords
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
        this.items[index] = br
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
    billingRecordsAreInitOrPending(items) {
      // Returns true if all records in the list are either in INIT, PENDING_LAB_APPROVAL, or LAB_APPROVED state
      if (!items || !items.length) {
        return false
      }
      const result = items.every(
        (record) =>
          record?.currentState === 'INIT' ||
          record?.currentState === 'PENDING_LAB_APPROVAL' ||
          record?.currentState === 'LAB_APPROVED'
      )
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
      return this.allHeaders.map((h) => h.title)
    },
    getDataForExport() {
      /* eslint-disable no-plusplus, no-continue */
      const formattedItems = []
      for (let i = 0; i < this.filteredItems.length; i++) {
        const newRecord = {}
        for (let j = 0; j < this.allHeaders.length; j++) {
          const header = this.allHeaders[j]
          const keys = header.key.split('.')
          const formattedKey = header.title
          let value = this.filteredItems[i]
          keys.forEach((key) => {
            value = value[key]
          })
          if (!value && value !== false) continue
          if (header.key === 'startDate' || header.key === 'endDate') {
            value = moment(String(value)).format('M/DD/YYYY h:mm A')
          } else if (header.key.toLowerCase().includes('date')) {
            value = value.substring(0, 10)
          } else if (header.key === 'account.organization') {
            value = this.$api.organization.parseSlug(value).name
          } else if (header.key === 'transactions') {
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
    async generateInvoices(wholeMonth = false) {
      this.updating = true
      this.message = ''
      const orgSet = new Set()
      if (!wholeMonth) {
        this.selected.forEach((item) => {
          orgSet.add(item.account.organization)
        })
      } else {
        this.selected = []
      }
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
      this.rowSelectionToggleIndeterminate[group] = false
    },
    summaryCharges(group) {
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      const summary = records.reduce((prev, current) => prev + current.decimalCharge, 0)
      return summary
    },
    totalCharges() {
      const total = this.filteredItems.reduce((prev, current) => prev + current.decimalCharge, 0)
      return total
    },
    totalHours() {
      const total = this.filteredItems.reduce((prev, current) => prev + current.decimalQuantity, 0)
      return Math.round(total * 100) / 100
    },
    determineGroupState(e) {
      const group = e.item.account.organization
      const records = this.filteredItems.filter((item) => item.account.organization === group)
      let checked = this.selected.filter((item) => item.account.organization === group).length
      checked += e.value ? 1 : -1
      const state = checked !== 0 && checked < records.length
      this.rowSelectionToggleIndeterminate[group] = state
      if (checked) {
        if (checked === records.length) {
          const index = this.rowSelectionToggle.indexOf(group)
          if (index === -1) {
            this.rowSelectionToggle.push(group)
          }
        }
      } else {
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
        this.rowSelectionToggle = Array.from(orgSet)
      } else {
        this.rowSelectionToggle = []
      }
      Array.from(orgSet).forEach((org) => {
        this.rowSelectionToggleIndeterminate[org] = false
      })
    },
    collpaseRows() {
      this.$nextTick(() => {
        const table = this.$refs.table
        if (table) {
          if (table.openCache) {
            const keys = Object.keys(table.openCache)
            keys.forEach((key) => {
              table.openCache[key] = false
            })
          }
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
    async deleteSelectedBillingRecords() {
      this.updating = true
      let successCount = 0
      for (let i = 0; i < this.selected.length; i++) {
        try {
          await this.$api.billingRecord.delete(this.selected[i])
          this.items = this.items.filter((item) => !(item.id === this.selected[i].id))
          successCount++
        } catch (error) {
          const message = this.getErrorMessage(error)
          this.showMessage(message)
        }
      }
      this.showMessage(`Successfully deleted ${successCount} billing record(s)`)
      this.selected = []

      this.isLoading = false
      this.updating = false
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
    allowEditingRecords(item) {
      return item.currentState !== 'FINAL'
    },
    goToComposeMessage(field) {
      this.recipientField = field
      const orgs = this.selected.length ? this.selected : this.filteredItems
      const orgSlugs = orgs.map((item) => item.account.organization)
      this.$router.push({
        name: 'MailingCompose',
        params: {
          labManagerOrgSlugs: [...new Set(orgSlugs)],
          message: null,
          subject: null,
          recipientField: this.recipientField,
          invoicePrefix: this.facility.invoicePrefix,
        },
      })
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
        this.$api.contactables.getList().then((result) => {
          this.contactables = result
        })
      }
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
      this.recordIDsToBeChanged = this.selected.map((record) => record.id)
      this.showChangeExpenseCodeDialog = true
    },
    closeChangeExpenseCodeDialog() {
      this.recordIDsToBeChanged = []
      this.showChangeExpenseCodeDialog = false
    },
    getUsageReport() {
      this.usageReportHref = ''
      this.usageReportFileName = ''
      this.usageReportMessage = ''
      this.loadingUsageReport = true
      const organization_slug = this.organization
      this.$api
        .getUsageReport(this.facility.invoicePrefix, this.year, this.month, organization_slug)
        .then((response) => {
          this.usageReportHref = response.data.url
          this.usageReportFileName = response.data.filename
        })
        .catch((error) => {
          this.usageReportMessage =
            error?.response?.data?.error || 'An error occurred while generating the usage report'
        })
        .finally(() => {
          this.loadingUsageReport = false
        })
    },
    openGetUsageReportDialog() {
      this.getUsageReport()
      this.showUsageReportDialog = true
    },
    closeGetUsageReportDialog() {
      this.showUsageReportDialog = false
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
            response.data.forEach((record) => {
              const newBillingRec = this.$api.billingRecord.create(record)
              let index = this.items.findIndex((rec) => rec.id === record.id)
              this.items.splice(index, 1, newBillingRec)
              index = this.selected.findIndex((rec) => rec.id === record.id)
              groups.add(this.selected[index].account.organization)
              this.selected.splice(index, 1, newBillingRec)
              groups.add(newBillingRec.account.organization)
            })
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
      this.rowSelectionToggleIndeterminate[group] = state
      if (checked) {
        if (checked === records.length) {
          const index = this.rowSelectionToggle.indexOf(group)
          if (index === -1) {
            this.rowSelectionToggle.push(group)
          }
        }
      } else {
        const index = this.rowSelectionToggle.indexOf(group)
        if (index !== -1) {
          this.rowSelectionToggle.splice(index, 1)
        }
      }
    },
    transactionDisplay(txn) {
      return `${txn.description}`
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
          <v-col cols="5">
            <div class="text-no-wrap">
              {{ facility.name }}
            </div>
          </v-col>
          <v-col class="flex-grow-2">
            <v-row>
              <v-col>
                <IFXSearchField v-model:search="search" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row class="d-flex flex-nowrap justify-end align-start">
              <v-col v-if="updating">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-col>
              <v-col v-else>
                <v-row class="d-flex justify-start align-center nowrap">
                  <v-col class="pa-2">
                    <IFXMailButton
                      v-if="useDefaultMailButton"
                      v-model="recipientField"
                      :disabled="!filteredItems.length"
                      toolTip="Notify Lab Managers"
                      @input="defaultNotifyLabManagers()"
                    ></IFXMailButton>
                    <v-tooltip location="top" v-else>
                      <template v-slot:activator="{ props }">
                        <div>
                          <v-menu v-model="mailFab" location="bottom">
                            <template v-slot:activator="{ props: menuProps }">
                              <v-btn v-bind="{ ...props, ...menuProps }" size="small" color="green" icon>
                                <v-icon color="white" v-if="mailFab">mdi-close</v-icon>
                                <v-icon color="white" v-else>mdi-email-send-outline</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click="openNotifyDialog">
                                <v-list-item-title>Notify Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="goToComposeMessage('to')" :disabled="!filteredItems.length">
                                <v-list-item-title>Send a message to selected Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="goToComposeMessage('cc')" :disabled="!filteredItems.length">
                                <v-list-item-title>CC selected Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="goToComposeMessage('bcc')" :disabled="!filteredItems.length">
                                <v-list-item-title>BCC selected Lab Managers</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>

                          <v-dialog v-model="notifyDialog" max-width="600px">
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
                                      <div class="text-divider font-italic text-center mt-2">
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
                                        <span class="text-green">sent</span>
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
                                        <span class="text-red">errors</span>
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
                                        <span class="text-yellow-darken-3">no billing records</span>
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
                                <v-btn color="secondary" variant="text" @click="notifyDialog = false">
                                  {{ emailResponse ? 'Close' : 'Cancel' }}
                                </v-btn>
                                <v-btn
                                  color="blue-darken-1"
                                  variant="text"
                                  :disabled="!isValid"
                                  @click="notifyLabManagers"
                                >
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
                    <v-row class="d-flex flex-nowrap">
                      <v-col>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <div>
                              <v-btn
                                :disabled="selected.length == 0 || billingRecordsAreFinal(selected)"
                                v-bind="props"
                                icon="mdi-check"
                                size="small"
                                color="green"
                                @click="approve()"
                              >
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ approveSelectedToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- Commented out for Storybook - download-csv not registered -->
                  <!--
                  <v-col class="pa-2" v-if="allowDownloads">
                    <v-row>
                      <v-col>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <div>
                              <download-csv
                                :class="{ 'download-disabled': isLoading }"
                                :labels="getLabelsForExport()"
                                :data="getDataForExport()"
                                :name="getNameForExport()"
                                v-bind="props"
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
                  -->
                  <v-col v-if="allowChangeExpenseCode">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <div>
                          <v-btn
                            :disabled="selected.length == 0 || billingRecordsAreFinal(selected)"
                            v-bind="props"
                            icon="mdi-playlist-edit"
                            size="small"
                            color="green"
                            @click="openChangeExpenseCodeDialog()"
                          >
                          </v-btn>
                        </div>
                      </template>
                      <span>Edit billing record account</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class="pa-2" v-if="allowInvoiceGeneration">
                    <v-row>
                      <v-col>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <div>
                              <v-btn
                                :disabled="
                                  isLoading ||
                                  selected.length == 0 ||
                                  !$api.auth.can('generate-invoices', $api.authUser)
                                "
                                v-bind="props"
                                :color="billingRecordsAreFinal(selected) ? 'error' : 'blue'"
                                size="small"
                                icon="mdi-currency-usd"
                                @click="generateInvoices()"
                              >
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ generateInvoicesToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pa-2" v-if="allowInvoiceGeneration">
                    <v-row>
                      <v-col>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <div>
                              <v-btn
                                :disabled="
                                  isLoading ||
                                  !$api.auth.can('generate-invoices', $api.authUser)
                                "
                                v-bind="props"
                                color="blue"
                                size="small"
                                icon="mdi-calendar-month"
                                @click="generateInvoices(true)"
                              >
                              </v-btn>
                            </div>
                          </template>
                          <span>Deactivate any existing invoices and process the entire month</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="allowDeleteBillingRecords">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <div>
                          <v-btn
                            :disabled="selected.length == 0 || !billingRecordsAreInitOrPending(selected)"
                            v-bind="props"
                            icon="mdi-trash-can-outline"
                            size="small"
                            color="red"
                            @click="deleteSelectedBillingRecords()"
                          >
                          </v-btn>
                        </div>
                      </template>
                      <span>{{ deleteSelectedToolTip }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-if="allowUsageReport && facility.hasUsageReport">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <div>
                          <v-btn
                            :disabled="!organization"
                            v-bind="props"
                            icon="mdi-hammer-wrench"
                            size="small"
                            color="yellow"
                            @click="openGetUsageReportDialog()"
                          >
                          </v-btn>
                        </div>
                      </template>
                      <span>Get usage report</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-space-around">
          <v-col v-if="message" cols="12" class="d-flex flex-grow-1">
            <v-alert closable :type="messageType" variant="tonal">
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
            :item-value="itemKey"
            :loading="isLoading"
            :items-per-page="-1"
            :sort-by="sortByArray"
            :group-by="groupBy"
            @item-selected="determineGroupState"
            @toggle-select-all="toggleSelectAll"
          >
            <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
              <tr>
                <td :colspan="columns.length" class="">
                  <v-row class="align-center" density="compact" no-gutters>
                    <v-col cols="1" v-if="showCheckboxes" class="force-compact-checkbox">
                      <v-checkbox
                        v-model="rowSelectionToggle"
                        :value="item.value"
                        hide-details
                        :indeterminate="rowSelectionToggleIndeterminate[item.value]"
                        @update:model-value="() => toggleGroup(item.value)"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        size="comfortable"
                        elevation="0"
                        density="compact"
                        icon="mdi-menu-right"
                        variant="plain"
                        @click="toggleGroup(item)"
                        :class="{ 'rotate-90': isGroupOpen(item) }"
                        class="mr-1"
                      ></v-btn>
                      <span class="font-weight-bold text-body-2">
                        {{ $api.organization.parseSlug(item.value).name }}
                      </span>
                      <span class="ml-3 text-body-2">Total charges: {{ $dollars(summaryCharges(item.value)) }}</span>
                    </v-col>
                  </v-row>
                </td>
              </tr>
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
              <span class="state-display">{{ $stateDisplay(item.currentState) }}</span>
            </template>
            <template v-slot:item.account.slug="{ item }">
              <span class="text-no-wrap">{{ item.account.code }}</span>
              ({{ item.account.name }})
            </template>
            <template v-slot:item.transactions="{ item }">
              <div style="min-width: 150px">
                <div class="my-1" v-for="txn in item.transactions" :key="txn.id">
                  {{ transactionDisplay(txn) }}
                </div>
              </div>
            </template>
            <template v-slot:item.decimalCharge="{ item }">
              {{ $dollars(item.decimalCharge) }}
            </template>
            <template v-slot:item.startDate="{ item }">
              <span class="text-no-wrap">
                {{ $humanDatetime(item.startDate) }}
              </span>
            </template>
            <template v-slot:item.endDate="{ item }">
              <span class="text-no-wrap">
                {{ $humanDatetime(item.endDate) }}
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
                  class="ml-2"
                  v-if="allowEditingRecords(item)"
                  iconString="edit"
                  btnType="edit"
                  xSmall
                  @action="openEditDialog(item)"
                />
              </div>
            </template>
            <template v-slot:bottom v-if="showTotals">
              <div class="text-body-1 pa-4">
                {{ facility.name }} total charges for {{ date }} are
                <span class="font-weight-medium">{{ $dollars(totalCharges()) }}</span>
                for
                <span class="font-weight-medium">{{ totalHours() }} {{ totalUnits }}</span>
              </div>
            </template>
          </v-data-table>
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
                        item-title="slug"
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
                <v-btn color="secondary" variant="text" @click="closeEditDialog">Cancel</v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  :disabled="!isValidEdit"
                  @click="updateSpecificRecord(editedRecord)"
                >
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
                        item-title="slug"
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
                <v-btn color="secondary" variant="text" @click="closeChangeExpenseCodeDialog">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" :disabled="!isValidBulkEdit" @click="changeExpenseCode">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="showUsageReportDialog" v-if="showUsageReportDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Get Usage Report</span>
              </v-card-title>
              <v-card-text>
                <div v-if="loadingUsageReport">
                  <span class="mr-3">Running report...</span>
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <div v-else>
                  <v-row>
                    <v-col>
                      <a v-if="usageReportHref" :href="usageReportHref">
                        {{ usageReportFileName }}
                      </a>
                      <span v-else>
                        {{ usageReportMessage }}
                      </span>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="closeGetUsageReportDialog()">Close</v-btn>
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
.flex-grow-2 {
  flex-grow: 2;
}
.search-field {
  width: 100%;
}
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s;
}
.force-compact-checkbox {
  flex-grow: 0;
  flex-shrink: 1;
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
<style scoped></style>
