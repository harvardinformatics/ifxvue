import IFXBillingRecordListDecimal from './IFXBillingRecordListDecimal.vue'

export default {
  title: 'Components/IFXBillingRecordListDecimal',
  component: IFXBillingRecordListDecimal,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecordListDecimal },
  setup() {
    return { args }
  },
  template: '<IFXBillingRecordListDecimal v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  facility: {
    id: 1,
    name: 'Neuroscience Facility',
    invoicePrefix: 'NF',
    applicationUsername: 'nf_app',
    hasUsageReport: true,
  },
  organization: null,
  date: '2024-11',
  allowDownloads: false,
  allowApprovals: true,
  allowInvoiceGeneration: true,
  allowChangeExpenseCode: true,
  allowDeleteBillingRecords: false,
  allowUsageReport: true,
  useDefaultMailButton: false,
  showDates: true,
  showStartDate: true,
  showTotals: true,
  totalUnits: 'hours',
}

export const MinimalFeatures = Template.bind({})
MinimalFeatures.args = {
  facility: {
    id: 2,
    name: 'Imaging Core',
    invoicePrefix: 'IC',
    applicationUsername: 'ic_app',
    hasUsageReport: false,
  },
  organization: null,
  date: '2024-10',
  allowDownloads: false,
  allowApprovals: false,
  allowInvoiceGeneration: false,
  allowChangeExpenseCode: false,
  allowDeleteBillingRecords: false,
  allowUsageReport: false,
  useDefaultMailButton: true,
  showDates: false,
  showStartDate: false,
  showTotals: false,
  totalUnits: 'scans',
}

export const SingleOrganization = Template.bind({})
SingleOrganization.args = {
  facility: {
    id: 1,
    name: 'Neuroscience Facility',
    invoicePrefix: 'NF',
    applicationUsername: 'nf_app',
    hasUsageReport: true,
  },
  organization: 'harvard-neuroscience',
  date: '2024-11',
  allowDownloads: false,
  allowApprovals: true,
  allowInvoiceGeneration: false,
  allowChangeExpenseCode: true,
  allowDeleteBillingRecords: true,
  allowUsageReport: true,
  useDefaultMailButton: false,
  showDates: true,
  showStartDate: false,
  showTotals: true,
  totalUnits: 'hours',
}