import { ref } from 'vue'
import IFXBillingRecordHeader from './IFXBillingRecordHeader.vue'

export default {
  title: 'Components/IFXBillingRecordHeader',
  component: IFXBillingRecordHeader,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecordHeader },
  setup() {
    const isOpen = ref(false)
    const rowSelectionToggle = ref([])

    const toggle = () => {
      isOpen.value = !isOpen.value
    }

    const toggleGroup = (group) => {
      console.log('Toggle group:', group)
    }

    const getSummaryDetails = (group) => {
      return new Map([
        ['HRG-2024-001', 125000],
        ['HRG-2024-002', 87500],
        ['HRG-2024-003', 45000],
      ])
    }

    return { args, isOpen, rowSelectionToggle, toggle, toggleGroup, getSummaryDetails }
  },
  template: `
    <table style="width: 100%; border: 1px solid #e0e0e0;">
      <tbody>
      <tr>
        <IFXBillingRecordHeader
          v-bind="args"
          :isOpen="isOpen"
          :toggle="toggle"
          :toggleGroup="toggleGroup"
          :getSummaryDetails="getSummaryDetails"
          :rowSelectionToggle="rowSelectionToggle"
          @update:row-selection-toggle="rowSelectionToggle = $event"
        />
      </tr>
      </tbody>
    </table>
  `,
})

export const Default = Template.bind({})
Default.args = {
  group: 'harvard',
  colSpan: 6,
  showCheckboxes: true,
  rowSelectionToggleIndeterminateGroup: false,
  summaryCharges: 257500,
}

export const WithoutCheckboxes = Template.bind({})
WithoutCheckboxes.args = {
  group: 'mit',
  colSpan: 5,
  showCheckboxes: false,
  rowSelectionToggleIndeterminateGroup: false,
  summaryCharges: 180000,
}