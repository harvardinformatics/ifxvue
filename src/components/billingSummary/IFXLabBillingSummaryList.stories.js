import IFXLabBillingSummaryList from './IFXLabBillingSummaryList.vue'

const mockFacility = {
  id: 1,
  name: '7T MRI Facility',
  invoicePrefix: '7T-',
}

// Mock data for the months the component will request
// Component defaults to last 6 months, so for December 2025: June-December 2025
const mockLabChargeData = {
  'Neuroscience Lab': {
    '2025-06': 12500,
    '2025-07': 13800,
    '2025-08': 14200,
    '2025-09': 15000,
    '2025-10': 18000,
    '2025-11': 16500,
    '2025-12': 17200,
  },
  'Psychology Department': {
    '2025-06': 7500,
    '2025-07': 8200,
    '2025-08': 8800,
    '2025-09': 8500,
    '2025-10': 0,  // Gap - no charges this month
    '2025-11': 9200,
    '2025-12': 9500,
  },
  'Biology Research Center': {
    '2025-06': 11000,
    '2025-07': 11500,
    '2025-08': 12000,
    '2025-09': 12300,
    '2025-10': 14100,
    '2025-11': 13800,
    '2025-12': 14500,
  },
  'Medical School': {
    '2025-06': 0,
    '2025-07': 0,
    '2025-08': 0,
    '2025-09': 0,
    '2025-10': 0,
    '2025-11': 0,
    '2025-12': 0,
  },
}

export default {
  title: 'Components/IFXLabBillingSummaryList',
  component: IFXLabBillingSummaryList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXLabBillingSummaryList },
  setup() {
    return { args }
  },
  beforeCreate() {
    this.$api.getLabChargeHistory = async (facility, startMonth, startYear, endMonth, endYear) => {
      console.log('Mock API called:', { facility, startMonth, startYear, endMonth, endYear })
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: mockLabChargeData }
    }
  },
  template: `<IFXLabBillingSummaryList v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  facility: mockFacility,
  showSelectors: true,
}

export const WithoutSelectors = Template.bind({})
WithoutSelectors.args = {
  facility: mockFacility,
  showSelectors: false,
}