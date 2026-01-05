import IFXBillingRecordList from './IFXBillingRecordList.vue'

export default {
  title: 'Components/IFXBillingRecordList',
  component: IFXBillingRecordList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecordList },
  setup() {
    return { args }
  },
  template: '<IFXBillingRecordList v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  facility: {
    id: 1,
    name: 'Neuroscience Facility',
    invoicePrefix: 'NF',
    applicationUsername: 'nf_app',
  },
  organization: null,
  date: '2024-11',
  allowDownloads: true,
  allowApprovals: true,
  allowInvoiceGeneration: true,
  allowChangeExpenseCode: true,
  allowDeleteBillingRecords: false,
  useDefaultMailButton: false,
  showDates: true,
  showTotals: true,
  totalUnits: 'hours',
}