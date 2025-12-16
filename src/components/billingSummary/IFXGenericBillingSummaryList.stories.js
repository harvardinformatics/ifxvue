import GenericBillingSummaryList from './IFXGenericBillingSummaryList.vue'

const mockFacility = {
  id: 1,
  name: '7T MRI Facility',
  invoicePrefix: '7T-',
}

const mockHeaders = [
  { title: 'Lab Name', value: 'organization', sortable: true },
  { title: 'Total Charge', value: 'totalDecimalCharge', sortable: true, namedSlot: true },
  { title: 'Usage Hours', value: 'usageHours', sortable: true },
]

export default {
  title: 'Components/GenericBillingSummaryList',
  component: GenericBillingSummaryList,
  tags: ['autodocs'],
}

export const Default = {
  render: (args) => ({
    components: { GenericBillingSummaryList },
    setup() {
      return { args }
    },
    mounted() {
      this.$api.billingSummary = {
        getList: async () => {
          await new Promise(resolve => setTimeout(resolve, 300))
          return [
            { id: 1, organization: 'Neuroscience Lab', totalDecimalCharge: 15000, usageHours: 50 },
            { id: 2, organization: 'Psychology Department', totalDecimalCharge: 8500, usageHours: 28 },
            { id: 3, organization: 'Biology Research Center', totalDecimalCharge: 12300, usageHours: 41 },
            { id: 4, organization: 'Medical School', totalDecimalCharge: 0, usageHours: 0 },
          ]
        }
      }
      // Force re-fetch
      this.$refs.component.getSetItems()
    },
    template: `<GenericBillingSummaryList ref="component" v-bind="args" />`,
  }),
  args: {
    facility: mockFacility,
    apiString: 'billingSummary',
    itemType: 'BillingSummary',
    headers: mockHeaders,
    month: 12,
    year: 2024,
    extraParams: {},
  },
}

export const WithError = {
  render: (args) => ({
    components: { GenericBillingSummaryList },
    setup() {
      return { args }
    },
    mounted() {
      this.$api.billingSummary = {
        getList: async () => {
          await new Promise(resolve => setTimeout(resolve, 300))
          const error = new Error()
          error.response = {
            data: {
              error: 'Database connection failed',
              detail: 'Timeout after 30 seconds'
            }
          }
          throw error
        }
      }
      this.$refs.component.getSetItems()
    },
    template: `<GenericBillingSummaryList ref="component" v-bind="args" />`,
  }),
  args: {
    facility: mockFacility,
    apiString: 'billingSummary',
    itemType: 'BillingSummary',
    headers: mockHeaders,
    month: 12,
    year: 2024,
    extraParams: {},
  },
}

export const FilteredData = {
  render: (args) => ({
    components: { GenericBillingSummaryList },
    setup() {
      return { args }
    },
    mounted() {
      this.$api.billingSummary = {
        getList: async () => {
          await new Promise(resolve => setTimeout(resolve, 300))
          return [
            { id: 1, organization: 'Neuroscience Lab', totalDecimalCharge: 15000, usageHours: 50 },
            { id: 2, organization: 'Psychology Department', totalDecimalCharge: 8500, usageHours: 28 },
            { id: 3, organization: 'Biology Research Center', totalDecimalCharge: 12300, usageHours: 41 },
          ]
        }
      }
      this.$refs.component.getSetItems()
    },
    template: `<GenericBillingSummaryList ref="component" v-bind="args" />`,
  }),
  args: {
    facility: mockFacility,
    apiString: 'billingSummary',
    itemType: 'BillingSummary',
    headers: mockHeaders,
    month: 12,
    year: 2024,
    extraParams: { departmentId: 42 },
  },
}