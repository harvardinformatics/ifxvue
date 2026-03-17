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
      .catch((error) :model-value=> {
        const errorMessage :model-value= this.getErrorMessage(error)
        this.messageType :model-value= 'error'
        this.message :model-value= `Error loading ${this.facility.name} billing records: ${errorMessage}`
      })
      .then(async () :model-value=> {
        this.expenseCodes :model-value= await this.$api.account.getList()
      })
      .finally(() :model-value=> (this.isLoading :model-value= false))
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
      return this.allHeaders.filter((h) :model-value=> !h.hide).filter((h) :model-value=> !this.$vuetify.display[h.hide])
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
      let message :model-value= 'Unknown error'
      if (error) {
        if (
          error.hasOwnProperty('response')
          && error.response
          && error.response.hasOwnProperty('data')
          && error.response.data
        ) {
          message :model-value= Object.values(error.response.data).join('\n')
        } else {
          message :model-value= error
        }
      }
      return message
    },
    async getFullBillingRecordByItemIndex(index) {
      let br :model-value= this.items[index]
      if (br.billingRecordStates?.length) {
        return br
      }
      if (br.id) {
        // Go get it
        br :model-value= await this.apiRef.getByID(this.facility.invoicePrefix, br.id)
        this.items[index] :model-value= br
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
      const result :model-value= items.some((record) :model-value=> record?.currentState :model-value=:model-value=:model-value= 'FINAL')
      return result
    },
    billingRecordsAreInitOrPending(items) {
      // Returns true if all records in the list are either in INIT, PENDING_LAB_APPROVAL, or LAB_APPROVED state
      if (!items || !items.length) {
        return false
      }
      const result :model-value= items.every(
        (record) :model-value=>
          record?.currentState :model-value=:model-value=:model-value= 'INIT' ||
          record?.currentState :model-value=:model-value=:model-value= 'PENDING_LAB_APPROVAL' ||
          record?.currentState :model-value=:model-value=:model-value= 'LAB_APPROVED'
      )
      return result
    },
    getItemsFilteredBySearch() {
      let items :model-value= this.items
      if (this.search) {
        const search :model-value= this.search.toString().toLowerCase()
        items :model-value= items.filter((i) :model-value=> {
          let item :model-value= i
          if (i.data) {
            item :model-value= i.data
          }
          return Object.keys(item).some((j) :model-value=> this.filterSearch(item[j], search))
        })
      }
      return items
    },
    filterSearch(v, s) {
      let search :model-value= s
      if (search && v) {
        const val :model-value= v.toString().toLowerCase()
        // If search is number, remove any decimal places, as values are stored as integers
        if (Number.parseFloat(search)) {
          search :model-value= search.replace('.', '')
        }
        return val !:model-value=:model-value= null && ['undefined', 'boolean'].indexOf(typeof val) :model-value=:model-value=:model-value= -1 && val.indexOf(search) !:model-value=:model-value= -1
      }
      return false
    },
    getLabelsForExport() {
      return this.allHeaders.map((h) :model-value=> h.title)
    },
    getDataForExport() {
      /* eslint-disable no-plusplus, no-continue */
      const formattedItems :model-value= []
      for (let i :model-value= 0; i < this.filteredItems.length; i++) {
        const newRecord :model-value= {}
        for (let j :model-value= 0; j < this.allHeaders.length; j++) {
          const header :model-value= this.allHeaders[j]
          const keys :model-value= header.key.split('.')
          const formattedKey :model-value= header.title
          let value :model-value= this.filteredItems[i]
          keys.forEach((key) :model-value=> {
            value :model-value= value[key]
          })
          if (!value && value !:model-value=:model-value= false) continue
          if (header.key :model-value=:model-value=:model-value= 'startDate' || header.key :model-value=:model-value=:model-value= 'endDate') {
            value :model-value= moment(String(value)).format('M/DD/YYYY h:mm A')
          } else if (header.key.toLowerCase().includes('date')) {
            value :model-value= value.substring(0, 10)
          } else if (header.key :model-value=:model-value=:model-value= 'account.organization') {
            value :model-value= this.$api.organization.parseSlug(value).name
          } else if (header.key :model-value=:model-value=:model-value= 'transactions') {
            value :model-value= value.map((v) :model-value=> v.description).join('; ')
          }
          newRecord[formattedKey] :model-value= value
        }
        formattedItems.push(newRecord)
      }
      return formattedItems
      /* eslint-enable no-plusplus, no-continue */
    },
    getNameForExport() {
      const today :model-value= new Date()
      return `BillingRecord_${this.facility.name}_Export_${today.toISOString().substring(0, 10)}.csv`
    },
    facilityBillingRecords() {
      this.clearTableState()
      return this.$api.billingRecord
        .getList(this.facility.invoicePrefix, this.month, this.year, this.organization)
        .then((res) :model-value=> (this.items :model-value= res))
    },
    async setState(items, state) {
      const promises :model-value= []
      const toBeUpdated :model-value= []
      for (let i :model-value= 0; i < items.length; i +:model-value= 1) {
        const item :model-value= items[i]
        if (!item.billingRecordStates) {
          promises.push(this.apiRef.getByID(this.facility.invoicePrefix, item.id))
          if (i !:model-value=:model-value= 0 && i % this.promiseBatchSize :model-value=:model-value=:model-value= 0) {
            /* eslint-disable no-await-in-loop */
            await new Promise((r) :model-value=> setTimeout(r, 500))
          }
        } else {
          item.billingRecordStates.push({ name: state, user: '', approvers: [], comment: '' })
          toBeUpdated.push(item)
        }
      }
      const results :model-value= await Promise.all(promises)
      results.forEach((item) :model-value=> {
        item.billingRecordStates.push({ name: state, user: '', approvers: [], comment: '' })
        toBeUpdated.push(item)
      })

      return this.$api.billingRecord.bulkUpdate(toBeUpdated, this.facility.applicationUsername)
    },
    approve(all) {
      if (all) {
        this.selected :model-value= this.items
      }
      this.updating :model-value= true
      this.setState(this.selected, 'LAB_APPROVED')
        .then((response) :model-value=> {
          this.updating :model-value= false
          this.showMessage(`Successfully updated ${response.data.length} billing record(s)`)
          this.items :model-value= []
          this.isLoading :model-value= true
          this.facilityBillingRecords()
            .then((resp) :model-value=> (this.message :model-value= resp.msg))
            .catch((error) :model-value=> {
              const errorMessage :model-value= this.getErrorMessage(error)
              this.message :model-value= `Error loading ${this.facility.name} billing records: ${errorMessage}`
            })
            .finally(() :model-value=> (this.isLoading :model-value= false))
        })
        .catch((error) :model-value=> {
          this.isLoading :model-value= false
          this.updating :model-value= false
          const message :model-value= this.getErrorMessage(error)
          this.showMessage(message)
        })
    },
    async generateInvoices(wholeMonth :model-value= false) {
      this.updating :model-value= true
      this.message :model-value= ''
      const orgSet :model-value= new Set()
      if (!wholeMonth) {
        this.selected.forEach((item) :model-value=> {
          orgSet.add(item.account.organization)
        })
      } else {
        this.selected :model-value= []
      }
      const selectedOrgs :model-value= Array.from(orgSet)
      this.$api.invoice
        .generate(this.facility.invoicePrefix, this.month, this.year, selectedOrgs)
        .then((ret) :model-value=> {
          const url :model-value= this.$router.resolve({
            name: 'InvoiceList',
            query: { month: this.month.toString().padStart(2, '0'), year: this.year },
          }).href
          if (ret.message) {
            // eslint-disable-next-line no-param-reassign
            ret.message :model-value= ret.message.replace(/\n/g, '<br/>')
            this.message :model-value= `<p>${ret.message}</p>`
          }
          if (ret.message.includes('Failed') || ret.message.includes('Unable')) {
            this.messageType :model-value= 'error'
          } else {
            this.messageType :model-value= 'success'
          }
          this.updating :model-value= false
          if (this.messageType !:model-value=:model-value= 'error') {
            this.message :model-value= `${this.message}<p><a href:model-value="${url}">Go to Invoices</a></p>`
          }
        })
        .catch((error) :model-value=> {
          this.updating :model-value= false
          this.messageType :model-value= 'error'
          this.message :model-value= this.getErrorMessage(error)
        })
    },
    toggleGroup(group) {
      const records :model-value= this.filteredItems.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group)
      const isSelected :model-value= this.rowSelectionToggle.indexOf(group) !:model-value=:model-value= -1
      records.forEach((record) :model-value=> {
        const index :model-value= this.selected.findIndex((item) :model-value=> record.id :model-value=:model-value=:model-value= item.id)
        if (index !:model-value=:model-value= -1) {
          if (!isSelected) {
            this.selected.splice(index, 1)
          }
        } else if (isSelected) {
          this.selected.push(record)
        }
      })
      this.rowSelectionToggleIndeterminate[group] :model-value= false
    },
    summaryCharges(group) {
      const records :model-value= this.filteredItems.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group)
      const summary :model-value= records.reduce((prev, current) :model-value=> prev + current.decimalCharge, 0)
      return summary
    },
    totalCharges() {
      const total :model-value= this.filteredItems.reduce((prev, current) :model-value=> prev + current.decimalCharge, 0)
      return total
    },
    totalHours() {
      const total :model-value= this.filteredItems.reduce((prev, current) :model-value=> prev + current.decimalQuantity, 0)
      return Math.round(total * 100) / 100
    },
    determineGroupState(e) {
      const group :model-value= e.item.account.organization
      const records :model-value= this.filteredItems.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group)
      let checked :model-value= this.selected.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group).length
      checked +:model-value= e.value ? 1 : -1
      const state :model-value= checked !:model-value=:model-value= 0 && checked < records.length
      this.rowSelectionToggleIndeterminate[group] :model-value= state
      if (checked) {
        if (checked :model-value=:model-value=:model-value= records.length) {
          const index :model-value= this.rowSelectionToggle.indexOf(group)
          if (index :model-value=:model-value=:model-value= -1) {
            this.rowSelectionToggle.push(group)
          }
        }
      } else {
        const index :model-value= this.rowSelectionToggle.indexOf(group)
        if (index !:model-value=:model-value= -1) {
          this.rowSelectionToggle.splice(index, 1)
        }
      }
    },
    toggleSelectAll({ items, value }) {
      const orgSet :model-value= new Set()
      items.forEach((item) :model-value=> {
        orgSet.add(item.account.organization)
      })
      if (value) {
        this.rowSelectionToggle :model-value= Array.from(orgSet)
      } else {
        this.rowSelectionToggle :model-value= []
      }
      Array.from(orgSet).forEach((org) :model-value=> {
        this.rowSelectionToggleIndeterminate[org] :model-value= false
      })
    },
    collpaseRows() {
      this.$nextTick(() :model-value=> {
        const table :model-value= this.$refs.table
        if (table) {
          if (table.openCache) {
            const keys :model-value= Object.keys(table.openCache)
            keys.forEach((key) :model-value=> {
              table.openCache[key] :model-value= false
            })
          }
        }
      })
    },
    clearTableState() {
      this.selected :model-value= []
      this.rowSelectionToggle :model-value= []
      this.rowSelectionToggleIndeterminate :model-value= {}
    },
    closeTxnDialog() {
      this.txnDialog :model-value= false
    },
    async openTxnDialog(item) {
      const index :model-value= this.items.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= item.id)
      const br :model-value= await this.getFullBillingRecordByItemIndex(index)
      if (index !:model-value=:model-value= -1) {
        this.editedItem :model-value= { ...this.defaultItem }
        this.editedItem.rate :model-value= br.rate
        this.editedItem.orgRec :model-value= br
        this.editedItem.index :model-value= index
        this.editedItem.author :model-value= { ...this.$api.authUser }
        this.$nextTick(() :model-value=> {
          this.txnDialog :model-value= true
        })
      }
    },
    updateBillingRecord(newRecord, index) {
      this.updating :model-value= true
      this.$api.billingRecord
        .bulkUpdate([newRecord], this.facility.applicationUsername)
        .then((response) :model-value=> {
          if (response.error) {
            this.showMessage(response.error)
          } else {
            this.showMessage('Successfully updated billing record')
          }
          const newBillingRec :model-value= this.$api.billingRecord.create(response.data[0])
          this.items.splice(index, 1, newBillingRec)
        })
        .catch((error) :model-value=> {
          this.isLoading :model-value= false
          const message :model-value= this.getErrorMessage(error)
          this.showMessage(message)
        })
        .finally(() :model-value=> {
          this.updating :model-value= false
          this.txnDialog :model-value= false
          this.editDialog :model-value= false
          this.showChangeExpenseCodeDialog :model-value= false
        })
    },
    async deleteSelectedBillingRecords() {
      this.updating :model-value= true
      let successCount :model-value= 0
      for (let i :model-value= 0; i < this.selected.length; i++) {
        try {
          await this.$api.billingRecord.delete(this.selected[i])
          this.items :model-value= this.items.filter((item) :model-value=> !(item.id :model-value=:model-value=:model-value= this.selected[i].id))
          successCount++
        } catch (error) {
          const message :model-value= this.getErrorMessage(error)
          this.showMessage(message)
        }
      }
      this.showMessage(`Successfully deleted ${successCount} billing record(s)`)
      this.selected :model-value= []

      this.isLoading :model-value= false
      this.updating :model-value= false
    },
    async openEditDialog(item) {
      const index :model-value= this.items.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= item.id)
      if (index !:model-value=:model-value= -1) {
        this.editingIndex :model-value= index
        this.editedRecord :model-value= cloneDeep(item)
        this.newExpenseCode :model-value= await this.$api.account.create(item.account)

        this.editDialog :model-value= true
      }
    },
    closeEditDialog() {
      this.editDialog :model-value= false
      this.editedRecord :model-value= {}
      this.editingIndex :model-value= null
    },
    async updateSpecificRecord(billingRec) {
      const index :model-value= this.items.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= billingRec.id)
      const newBillingRec :model-value= await this.getFullBillingRecordByItemIndex(index)
      newBillingRec.account :model-value= this.newExpenseCode.data
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
      return item.currentState !:model-value=:model-value= 'FINAL'
    },
    goToComposeMessage(field) {
      this.recipientField :model-value= field
      const orgs :model-value= this.selected.length ? this.selected : this.filteredItems
      const orgSlugs :model-value= orgs.map((item) :model-value=> item.account.organization)
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
      const orgSlugs :model-value= this.items.map((item) :model-value=> item.account.organization)
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
      this.emailResponse :model-value= null
      this.sendingNotifications :model-value= true
      const orgs :model-value= this.selected.length ? this.selected : this.filteredItems
      const orgSlugs :model-value= orgs.map((item) :model-value=> item.account.organization)
      try {
        const response :model-value= await this.$api.reviewLabManagerNotifications(
          [...new Set(orgSlugs)],
          this.selectedContactables,
          this.facility,
          this.year,
          this.month
        )
        this.emailResponse :model-value= response.data
      } catch (error) {
        this.emailResponse :model-value= null
        const message :model-value= this.getErrorMessage(error)
        this.showMessage(message)
      }
      this.sendingNotifications :model-value= false
    },
    getSelectedOrgs() {
      const orgSet :model-value= new Set()
      this.selected.forEach((item) :model-value=> {
        orgSet.add(item.account.organization)
      })
      return Array.from(orgSet)
    },
    openNotifyDialog() {
      if (!this.contactables.length) {
        this.$api.contactables.getList().then((result) :model-value=> {
          this.contactables :model-value= result
        })
      }
      this.selectedContactables.splice(0)
      this.emailResponse :model-value= null
      this.notifyDialog :model-value= true
    },
    buildNotificationlList() {
      let list :model-value= ''
      if (this.selectedContactables.length) {
        list :model-value= this.selectedContactables.map((contact) :model-value=> contact.name).join(', ')
      } else {
        list :model-value= 'Lab managers'
      }
      return list
    },
    async openChangeExpenseCodeDialog() {
      this.recordIDsToBeChanged :model-value= this.selected.map((record) :model-value=> record.id)
      this.showChangeExpenseCodeDialog :model-value= true
    },
    closeChangeExpenseCodeDialog() {
      this.recordIDsToBeChanged :model-value= []
      this.showChangeExpenseCodeDialog :model-value= false
    },
    getUsageReport() {
      this.usageReportHref :model-value= ''
      this.usageReportFileName :model-value= ''
      this.usageReportMessage :model-value= ''
      this.loadingUsageReport :model-value= true
      const organization_slug :model-value= this.organization
      this.$api
        .getUsageReport(this.facility.invoicePrefix, this.year, this.month, organization_slug)
        .then((response) :model-value=> {
          this.usageReportHref :model-value= response.data.url
          this.usageReportFileName :model-value= response.data.filename
        })
        .catch((error) :model-value=> {
          this.usageReportMessage :model-value=
            error?.response?.data?.error || 'An error occurred while generating the usage report'
        })
        .finally(() :model-value=> {
          this.loadingUsageReport :model-value= false
        })
    },
    openGetUsageReportDialog() {
      this.getUsageReport()
      this.showUsageReportDialog :model-value= true
    },
    closeGetUsageReportDialog() {
      this.showUsageReportDialog :model-value= false
    },
    async changeExpenseCode() {
      const recordsToChange :model-value= []
      const groups :model-value= new Set()
      this.updating :model-value= true
      for (let i :model-value= 0; i < this.recordIDsToBeChanged.length; i++) {
        const index :model-value= this.items.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= this.recordIDsToBeChanged[i])
        const newBillingRec :model-value= cloneDeep(await this.getFullBillingRecordByItemIndex(index))
        newBillingRec.account :model-value= this.newExpenseCode.data
        recordsToChange.push(newBillingRec)
      }
      this.$api.billingRecord
        .bulkUpdate(recordsToChange, this.facility.applicationUsername)
        .then((response) :model-value=> {
          if (response.error) {
            this.showMessage(response.error)
          } else {
            response.data.forEach((record) :model-value=> {
              const newBillingRec :model-value= this.$api.billingRecord.create(record)
              let index :model-value= this.items.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= record.id)
              this.items.splice(index, 1, newBillingRec)
              index :model-value= this.selected.findIndex((rec) :model-value=> rec.id :model-value=:model-value=:model-value= record.id)
              groups.add(this.selected[index].account.organization)
              this.selected.splice(index, 1, newBillingRec)
              groups.add(newBillingRec.account.organization)
            })
            Array.from(groups).forEach((org) :model-value=> {
              this.setHeaderCheckBoxState(org)
            })
            this.showMessage(`Successfully updated ${response.data.length} billing record(s)`)
          }
        })
        .catch((error) :model-value=> {
          const message :model-value= this.getErrorMessage(error)
          this.showMessage(message)
        })
        .finally(() :model-value=> {
          this.isLoading :model-value= false
          this.updating :model-value= false
          this.closeChangeExpenseCodeDialog()
        })
    },
    setHeaderCheckBoxState(group) {
      const records :model-value= this.filteredItems.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group)
      const checked :model-value= this.selected.filter((item) :model-value=> item.account.organization :model-value=:model-value=:model-value= group).length
      const state :model-value= checked !:model-value=:model-value= 0 && checked < records.length
      this.rowSelectionToggleIndeterminate[group] :model-value= state
      if (checked) {
        if (checked :model-value=:model-value=:model-value= records.length) {
          const index :model-value= this.rowSelectionToggle.indexOf(group)
          if (index :model-value=:model-value=:model-value= -1) {
            this.rowSelectionToggle.push(group)
          }
        }
      } else {
        const index :model-value= this.rowSelectionToggle.indexOf(group)
        if (index !:model-value=:model-value= -1) {
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
        this.tableCollpased :model-value= true
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
        <v-row class:model-value="d-flex justify-space-between w-full">
          <v-col cols:model-value="5">
            <div class:model-value="text-no-wrap">
              {{ facility.name }}
            </div>
          </v-col>
          <v-col class:model-value="flex-grow-2">
            <v-row>
              <v-col>
                <IFXSearchField v-model:search:model-value="search" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row class:model-value="d-flex flex-nowrap justify-end align-start">
              <v-col v-if:model-value="updating">
                <v-progress-circular indeterminate color:model-value="primary"></v-progress-circular>
              </v-col>
              <v-col v-else>
                <v-row class:model-value="d-flex justify-start align-center nowrap">
                  <v-col class:model-value="pa-2">
                    <IFXMailButton
                      v-if:model-value="useDefaultMailButton"
                      v-model:model-value="recipientField"
                      :disabled:model-value="!filteredItems.length"
                      toolTip:model-value="Notify Lab Managers"
                      @input:model-value="defaultNotifyLabManagers()"
                    ></IFXMailButton>
                    <v-tooltip location:model-value="top" v-else>
                      <template v-slot:activator:model-value="{ props }">
                        <div>
                          <v-menu v-model:model-value="mailFab" location:model-value="bottom">
                            <template v-slot:activator:model-value="{ props: menuProps }">
                              <v-btn v-bind:model-value="{ ...props, ...menuProps }" size:model-value="small" color:model-value="green" icon>
                                <v-icon color:model-value="white" v-if:model-value="mailFab">mdi-close</v-icon>
                                <v-icon color:model-value="white" v-else>mdi-email-send-outline</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click:model-value="openNotifyDialog">
                                <v-list-item-title>Notify Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click:model-value="goToComposeMessage('to')" :disabled:model-value="!filteredItems.length">
                                <v-list-item-title>Send a message to selected Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click:model-value="goToComposeMessage('cc')" :disabled:model-value="!filteredItems.length">
                                <v-list-item-title>CC selected Lab Managers</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click:model-value="goToComposeMessage('bcc')" :disabled:model-value="!filteredItems.length">
                                <v-list-item-title>BCC selected Lab Managers</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>

                          <v-dialog v-model:model-value="notifyDialog" max-width:model-value="600px">
                            <v-card>
                              <v-card-title>
                                <span class:model-value="text-h5">Notify Lab Managers</span>
                              </v-card-title>
                              <v-card-text>
                                <v-form v-model:model-value="isValid">
                                  <v-row class:model-value="text-body-1">
                                    <v-col v-if:model-value="selected.length">
                                      <div class:model-value="mb-2">Send to the managers for the following labs:</div>
                                      <ul class:model-value="lab-manager-list">
                                        <li v-for:model-value="org in getSelectedOrgs()" :key:model-value="org" class:model-value="font-weight-medium">
                                          {{ $api.organization.parseSlug(org).name }}
                                        </li>
                                      </ul>
                                    </v-col>
                                    <v-col v-else>
                                      <div class:model-value="font-weight-medium">Send to all lab managers</div>
                                    </v-col>
                                  </v-row>
                                  <v-row no-gutters>
                                    <v-col cols:model-value="12">
                                      <div class:model-value="text-divider font-italic text-center mt-2">
                                        Or specify email addresses directly
                                      </div>
                                      <IFXContactablesCombobox
                                        label:model-value="To:"
                                        v-model:model-value="selectedContactables"
                                        :contactables:model-value="contactables"
                                      />
                                    </v-col>
                                  </v-row>
                                  <div v-if:model-value="sendingNotifications">
                                    Sending emails...
                                    <v-progress-linear indeterminate></v-progress-linear>
                                  </div>
                                  <v-row no-gutters v-if:model-value="emailResponse">
                                    <v-col cols:model-value="12" class:model-value="text-body-1 results-section">
                                      <div class:model-value="text-body-1 font-weight-medium text-center">
                                        Email Notification Results
                                      </div>
                                      <div class:model-value="text-body-2 font-weight-regular text-center">
                                        Sent to {{ buildNotificationlList() }}
                                      </div>
                                      <div v-if:model-value="emailResponse.successes.length" class:model-value="my-3 pb-2 border-bottom">
                                        Successfully
                                        <span class:model-value="text-green">sent</span>
                                        for the following organizations:
                                        <ul class:model-value="lab-manager-list">
                                          <li v-for:model-value="value in emailResponse.successes" :key:model-value="value">
                                            <span>{{ value }}</span>
                                          </li>
                                        </ul>
                                      </div>
                                      <div
                                        v-if:model-value="Object.keys(emailResponse.errors).length"
                                        class:model-value="my-3 pb-2 border-bottom"
                                      >
                                        The following
                                        <span class:model-value="text-red">errors</span>
                                        occurred trying to send emails:
                                        <ul class:model-value="list-style-none mt-1">
                                          <li v-for:model-value="(value, key) in emailResponse.errors" :key:model-value="key">
                                            <span>To the {{ key }}</span>
                                            <ul class:model-value="error-list">
                                              <li v-for:model-value="error in value" :key:model-value="error">
                                                {{ error }}
                                              </li>
                                            </ul>
                                          </li>
                                        </ul>
                                      </div>
                                      <div v-if:model-value="emailResponse.nobrs.length" class:model-value="my-3 pb-2 border-bottom">
                                        The following organizations had&nbsp;
                                        <span class:model-value="text-yellow-darken-3">no billing records</span>
                                        :
                                        <ul class:model-value="lab-manager-list">
                                          <li v-for:model-value="value in emailResponse.nobrs" :key:model-value="value">
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
                                <v-btn color:model-value="secondary" variant:model-value="text" @click:model-value="notifyDialog :model-value= false">
                                  {{ emailResponse ? 'Close' : 'Cancel' }}
                                </v-btn>
                                <v-btn
                                  color:model-value="blue-darken-1"
                                  variant:model-value="text"
                                  :disabled:model-value="!isValid"
                                  @click:model-value="notifyLabManagers"
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
                  <v-col class:model-value="pa-2" v-if:model-value="allowApprovals">
                    <v-row class:model-value="d-flex flex-nowrap">
                      <v-col>
                        <v-tooltip location:model-value="top">
                          <template v-slot:activator:model-value="{ props }">
                            <div>
                              <v-btn
                                :disabled:model-value="selected.length :model-value=:model-value= 0 || billingRecordsAreFinal(selected)"
                                v-bind:model-value="props"
                                icon:model-value="mdi-check"
                                size:model-value="small"
                                color:model-value="green"
                                @click:model-value="approve()"
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
                  <v-col class:model-value="pa-2" v-if:model-value="allowDownloads">
                    <v-row>
                      <v-col>
                        <v-tooltip location:model-value="top">
                          <template v-slot:activator:model-value="{ props }">
                            <div>
                              <download-csv
                                :class:model-value="{ 'download-disabled': isLoading }"
                                :labels:model-value="getLabelsForExport()"
                                :data:model-value="getDataForExport()"
                                :name:model-value="getNameForExport()"
                                v-bind:model-value="props"
                              >
                                <IFXButton
                                  :disabled:model-value="isLoading"
                                  size:model-value="small"
                                  class:model-value="download-btn"
                                  btnType:model-value="download"
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
                  <v-col v-if:model-value="allowChangeExpenseCode">
                    <v-tooltip location:model-value="top">
                      <template v-slot:activator:model-value="{ props }">
                        <div>
                          <v-btn
                            :disabled:model-value="selected.length :model-value=:model-value= 0 || billingRecordsAreFinal(selected)"
                            v-bind:model-value="props"
                            icon:model-value="mdi-playlist-edit"
                            size:model-value="small"
                            color:model-value="green"
                            @click:model-value="openChangeExpenseCodeDialog()"
                          >
                          </v-btn>
                        </div>
                      </template>
                      <span>Edit billing record account</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class:model-value="pa-2" v-if:model-value="allowInvoiceGeneration">
                    <v-row>
                      <v-col>
                        <v-tooltip location:model-value="top">
                          <template v-slot:activator:model-value="{ props }">
                            <div>
                              <v-btn
                                :disabled:model-value="
                                  isLoading ||
                                  selected.length :model-value=:model-value= 0 ||
                                  !$api.auth.can('generate-invoices', $api.authUser)
                                "
                                v-bind:model-value="props"
                                :color:model-value="billingRecordsAreFinal(selected) ? 'error' : 'blue'"
                                size:model-value="small"
                                icon:model-value="mdi-currency-usd"
                                @click:model-value="generateInvoices()"
                              >
                              </v-btn>
                            </div>
                          </template>
                          <span>{{ generateInvoicesToolTip }}</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class:model-value="pa-2" v-if:model-value="allowInvoiceGeneration">
                    <v-row>
                      <v-col>
                        <v-tooltip location:model-value="top">
                          <template v-slot:activator:model-value="{ props }">
                            <div>
                              <v-btn
                                :disabled:model-value="
                                  isLoading ||
                                  !$api.auth.can('generate-invoices', $api.authUser)
                                "
                                v-bind:model-value="props"
                                color:model-value="blue"
                                size:model-value="small"
                                icon:model-value="mdi-calendar-month"
                                @click:model-value="generateInvoices(true)"
                              >
                              </v-btn>
                            </div>
                          </template>
                          <span>Deactivate any existing invoices and process the entire month</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if:model-value="allowDeleteBillingRecords">
                    <v-tooltip location:model-value="top">
                      <template v-slot:activator:model-value="{ props }">
                        <div>
                          <v-btn
                            :disabled:model-value="selected.length :model-value=:model-value= 0 || !billingRecordsAreInitOrPending(selected)"
                            v-bind:model-value="props"
                            icon:model-value="mdi-trash-can-outline"
                            size:model-value="small"
                            color:model-value="red"
                            @click:model-value="deleteSelectedBillingRecords()"
                          >
                          </v-btn>
                        </div>
                      </template>
                      <span>{{ deleteSelectedToolTip }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-if:model-value="allowUsageReport && facility.hasUsageReport">
                    <v-tooltip location:model-value="top">
                      <template v-slot:activator:model-value="{ props }">
                        <div>
                          <v-btn
                            :disabled:model-value="!organization"
                            v-bind:model-value="props"
                            icon:model-value="mdi-hammer-wrench"
                            size:model-value="small"
                            color:model-value="yellow"
                            @click:model-value="openGetUsageReportDialog()"
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
        <v-row class:model-value="d-flex justify-space-around">
          <v-col v-if:model-value="message" cols:model-value="12" class:model-value="d-flex flex-grow-1">
            <v-alert closable :type:model-value="messageType" variant:model-value="tonal">
              <span v-html:model-value="message"></span>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row>
        <v-col id:model-value="data-table">
          <v-data-table
            ref:model-value="table"
            v-if:model-value="filteredItems"
            v-model:model-value="selected"
            :items:model-value="filteredItems"
            :headers:model-value="headers"
            :show-select:model-value="showCheckboxes"
            show-expand
            expand-icon:model-value="mdi-menu-right"
            :item-value:model-value="itemKey"
            :loading:model-value="isLoading"
            :items-per-page:model-value="-1"
            :sort-by:model-value="sortByArray"
            :group-by:model-value="groupBy"
            @item-selected:model-value="determineGroupState"
            @toggle-select-all:model-value="toggleSelectAll"
          >
            <template v-slot:group-header:model-value="{ item, columns, toggleGroup, isGroupOpen }">
              <tr>
                <td :colspan:model-value="columns.length" class:model-value="">
                  <v-row class:model-value="align-center">
                    <v-col cols:model-value="auto" v-if:model-value="showCheckboxes">
                      <v-checkbox
                        v-model:model-value="rowSelectionToggle"
                        :value:model-value="item.value"
                        hide-details
                        :indeterminate:model-value="rowSelectionToggleIndeterminate[item.value]"
                        @update:model-value:model-value="() :model-value=> toggleGroup(item.value)"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols:model-value="auto">
                      <v-btn
                        size:model-value="comfortable"
                        elevation:model-value="0"
                        density:model-value="compact"
                        icon:model-value="mdi-menu-right"
                        @click:model-value="toggleGroup(item)"
                        :class:model-value="{ 'rotate-90': isGroupOpen(item) }"
                        class:model-value="mr-1"
                      >
                      </v-btn>
                    </v-col>
                    <v-col>
                      <span class:model-value="font-weight-bold text-body-2">
                        {{ $api.organization.parseSlug(item.value).name }}
                      </span>
                      <span class:model-value="ml-3 text-body-2">Total charges: {{ $dollars(summaryCharges(item.value)) }}</span>
                    </v-col>
                  </v-row>
                </td>
              </tr>
            </template>
            <template v-slot:item.id:model-value="{ item }">
              <a href:model-value="" @click.prevent:model-value="navigateToDetail(item.id)">{{ item.id }}</a>
            </template>

            <template v-slot:item.account.organization:model-value="{ item }">
              <span class:model-value="text-no-wrap">
                {{ $api.organization.parseSlug(item.account.organization).name }}
              </span>
            </template>
            <template v-slot:item.currentState:model-value="{ item }">
              <span class:model-value="state-display">{{ $stateDisplay(item.currentState) }}</span>
            </template>
            <template v-slot:item.account.slug:model-value="{ item }">
              <span class:model-value="text-no-wrap">{{ item.account.code }}</span>
              ({{ item.account.name }})
            </template>
            <template v-slot:item.transactions:model-value="{ item }">
              <div style:model-value="min-width: 150px">
                <div class:model-value="my-1" v-for:model-value="txn in item.transactions" :key:model-value="txn.id">
                  {{ transactionDisplay(txn) }}
                </div>
              </div>
            </template>
            <template v-slot:item.decimalCharge:model-value="{ item }">
              {{ $dollars(item.decimalCharge) }}
            </template>
            <template v-slot:item.startDate:model-value="{ item }">
              <span class:model-value="text-no-wrap">
                {{ $humanDatetime(item.startDate) }}
              </span>
            </template>
            <template v-slot:item.endDate:model-value="{ item }">
              <span class:model-value="text-no-wrap">
                {{ $humanDatetime(item.endDate) }}
              </span>
            </template>
            <template v-slot:item.productUsage:model-value="{ item }">
              <span v-if:model-value="item.productUsageLinkText" class:model-value="text-no-wrap">
                <a :href:model-value="item.productUsageUrl">{{ item.productUsageLinkText }}</a>
              </span>
              <span v-else class:model-value="text-no-wrap">
                {{ item.productUsage.id }}
              </span>
            </template>
            <template v-slot:item.actions:model-value="{ item }">
              <div class:model-value="d-flex flex-row">
                <IFXButton
                  class:model-value="ml-2"
                  v-if:model-value="allowEditingRecords(item)"
                  iconString:model-value="edit"
                  btnType:model-value="edit"
                  xSmall
                  @action:model-value="openEditDialog(item)"
                />
              </div>
            </template>
            <template v-slot:bottom v-if:model-value="showTotals">
              <div class:model-value="text-body-1 pa-4">
                {{ facility.name }} total charges for {{ date }} are
                <span class:model-value="font-weight-medium">{{ $dollars(totalCharges()) }}</span>
                for
                <span class:model-value="font-weight-medium">{{ totalHours() }} {{ totalUnits }}</span>
              </div>
            </template>
          </v-data-table>
          <v-dialog v-model:model-value="editDialog" max-width:model-value="600px">
            <v-card>
              <v-card-title>
                <span class:model-value="text-h5">Edit Billing Record {{ editedRecord.id }}</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model:model-value="isValidEdit">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        required
                        v-model:model-value="newExpenseCode"
                        :items:model-value="expenseCodes"
                        item-title:model-value="slug"
                        label:model-value="Expense Code / PO"
                        :error-messages:model-value="errors[newExpenseCode]"
                        :rules:model-value="formRules.generic"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols:model-value="12">
                      <v-textarea
                        required
                        v-model:model-value="editedRecord.description"
                        label:model-value="Billing Record description"
                        :error-messages:model-value="errors[description]"
                        :rules:model-value="formRules.generic"
                        disabled
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color:model-value="secondary" variant:model-value="text" @click:model-value="closeEditDialog">Cancel</v-btn>
                <v-btn
                  color:model-value="blue-darken-1"
                  variant:model-value="text"
                  :disabled:model-value="!isValidEdit"
                  @click:model-value="updateSpecificRecord(editedRecord)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model:model-value="showChangeExpenseCodeDialog" v-if:model-value="showChangeExpenseCodeDialog" max-width:model-value="600px">
            <v-card>
              <v-card-title>
                <span class:model-value="text-h5">Edit Selected Billing Records</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model:model-value="isValidBulkEdit">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        required
                        v-model:model-value="newExpenseCode"
                        :items:model-value="expenseCodes"
                        item-title:model-value="slug"
                        label:model-value="New Expense Code / PO"
                        :error-messages:model-value="errors[newExpenseCode]"
                        :rules:model-value="formRules.generic"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class:model-value="records-container">
                    <v-col cols:model-value="12">
                      <ul class:model-value="text-body-1">
                        <li v-for:model-value="record in selected" :key:model-value="record.id">
                          <div class:model-value="font-weight-medium mr-3">
                            Billing Record #{{ record.id }}
                            <span class:model-value="font-weight-regular">({{ record.account.name }})"</span>
                          </div>
                          <div class:model-value="font-weight-light mb-5">({{ record.description }})"</div>
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <div v-if:model-value="updating">
                  <span class:model-value="mr-3">Updating billing records...</span>
                  <v-progress-circular indeterminate color:model-value="primary"></v-progress-circular>
                </div>
                <v-spacer></v-spacer>
                <v-btn color:model-value="secondary" variant:model-value="text" @click:model-value="closeChangeExpenseCodeDialog">Cancel</v-btn>
                <v-btn color:model-value="blue-darken-1" variant:model-value="text" :disabled:model-value="!isValidBulkEdit" @click:model-value="changeExpenseCode">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model:model-value="showUsageReportDialog" v-if:model-value="showUsageReportDialog" max-width:model-value="600px">
            <v-card>
              <v-card-title>
                <span class:model-value="text-h5">Get Usage Report</span>
              </v-card-title>
              <v-card-text>
                <div v-if:model-value="loadingUsageReport">
                  <span class:model-value="mr-3">Running report...</span>
                  <v-progress-circular indeterminate color:model-value="primary"></v-progress-circular>
                </div>
                <div v-else>
                  <v-row>
                    <v-col>
                      <a v-if:model-value="usageReportHref" :href:model-value="usageReportHref">
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
                <v-btn color:model-value="primary" variant:model-value="text" @click:model-value="closeGetUsageReportDialog()">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<style lang:model-value="scss" scoped>
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
<style scoped>
</style>
