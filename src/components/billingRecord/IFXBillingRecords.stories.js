import IFXBillingRecords from './IFXBillingRecords.vue'

export default {
  title: 'Components/IFXBillingRecords',
  component: IFXBillingRecords,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecords },
  setup() {
    return { args }
  },
  template: '<IFXBillingRecords v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  organization: null,
  useDefaultMailButton: false,
  allowDownloads: true,
  allowChangeExpenseCode: true,
  allowDeleteBillingRecords: false,
  showDates: true,
  showStartDate: true,
  showTotals: true,
  totalUnits: 'hours',
}

export const SingleOrganization = Template.bind({})
SingleOrganization.args = {
  organization: 'harvard-neuroscience',
  useDefaultMailButton: true,
  allowDownloads: false,
  allowChangeExpenseCode: false,
  allowDeleteBillingRecords: false,
  showDates: false,
  showStartDate: false,
  showTotals: false,
  totalUnits: 'scans',
}