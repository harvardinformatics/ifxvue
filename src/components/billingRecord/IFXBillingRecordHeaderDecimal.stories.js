import { ref } from 'vue'
import IFXBillingRecordHeaderDecimal from './IFXBillingRecordHeaderDecimal.vue'

export default {
  title: 'Components/IFXBillingRecordHeaderDecimal',
  component: IFXBillingRecordHeaderDecimal,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecordHeaderDecimal },
  setup() {
    const rowSelectionToggle = ref([])
    const rowSelectionToggleIndeterminateGroup = ref(false)
    const isOpen = ref(false)

    const toggle = () => {
      isOpen.value = !isOpen.value
      console.log('Toggle clicked, isOpen:', isOpen.value)
    }

    const toggleGroup = (group) => {
      console.log('Toggle group:', group)
    }

    return {
      args: {
        ...args,
        toggle,
        toggleGroup,
      },
      rowSelectionToggle,
      rowSelectionToggleIndeterminateGroup,
      isOpen,
    }
  },
  template: `
    <table>
      <tbody>
        <IFXBillingRecordHeaderDecimal 
          v-bind="args"
          :isOpen="isOpen"
          v-model:rowSelectionToggle="rowSelectionToggle"
          v-model:rowSelectionToggleIndeterminateGroup="rowSelectionToggleIndeterminateGroup"
        />
      </tbody>
    </table>
  `,
})

export const Default = Template.bind({})
Default.args = {
  group: 'harvard-neuroscience',
  colSpan: 10,
  showCheckboxes: true,
  summaryCharges: 15000.50,
}

export const WithoutCheckbox = Template.bind({})
WithoutCheckbox.args = {
  group: 'mit-brain-cognitive-sciences',
  colSpan: 8,
  showCheckboxes: false,
  summaryCharges: 8500.25,
}

export const Indeterminate = (args) => ({
  components: { IFXBillingRecordHeaderDecimal },
  setup() {
    const rowSelectionToggle = ref(['harvard-neuroscience'])
    const rowSelectionToggleIndeterminateGroup = ref(true)
    const isOpen = ref(true)

    const toggle = () => {
      isOpen.value = !isOpen.value
      console.log('Toggle clicked, isOpen:', isOpen.value)
    }

    const toggleGroup = (group) => {
      console.log('Toggle group:', group)
    }

    return {
      args: {
        ...args,
        toggle,
        toggleGroup,
      },
      rowSelectionToggle,
      rowSelectionToggleIndeterminateGroup,
      isOpen,
    }
  },
  template: `
    <table>
      <tbody>
        <IFXBillingRecordHeaderDecimal 
          v-bind="args"
          :isOpen="isOpen"
          v-model:rowSelectionToggle="rowSelectionToggle"
          v-model:rowSelectionToggleIndeterminateGroup="rowSelectionToggleIndeterminateGroup"
        />
      </tbody>
    </table>
  `,
})
Indeterminate.args = {
  group: 'harvard-neuroscience',
  colSpan: 10,
  showCheckboxes: true,
  summaryCharges: 12000.00,
}