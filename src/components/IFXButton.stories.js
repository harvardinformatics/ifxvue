import { ref } from 'vue'
import IFXButton from './IFXButton.vue'

export default {
  title: 'Components/IFXButton',
  component: IFXButton,
  tags: ['autodocs'],
  argTypes: {
    btnType: {
      control: 'select',
      options: ['edit', 'remove', 'add', 'submit', 'download', 'copy', 'default', 'reset', 'close', 'cancel', 'home', 'other'],
    },
    btnText: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

// Template to handle action events
const Template = (args) => ({
  components: { IFXButton },
  setup() {
    const handleAction = () => {
      alert('Button action triggered!')
      console.log('IFXButton @action event fired')
    }
    return { args, handleAction }
  },
  template: '<IFXButton v-bind="args" @action="handleAction" />',
})

export const Default = Template.bind({})
Default.args = {
  btnText: 'Click Me',
  btnType: 'submit',
  disabled: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
  btnText: 'Disabled Button',
  btnType: 'submit',
  disabled: true,
}

export const CustomText = Template.bind({})
CustomText.args = {
  btnText: 'Save Changes',
  btnType: 'button',
  disabled: false,
}

// Interactive test with visible feedback
// Interactive test with visible feedback
export const WithActionFeedback = {
  render: (args) => ({
    components: { IFXButton },
    setup() {
      const actionLog = ref([])  // ADD ref() here
      const handleAction = () => {
        const timestamp = new Date().toLocaleTimeString()
        actionLog.value.push(`Clicked at ${timestamp}`)  // Use .value
      }
      return {
        args,
        handleAction,
        actionLog
      }
    },
    template: `
      <div>
        <IFXButton v-bind="args" @action="handleAction" />
        <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <strong>Action Log:</strong>
          <div v-if="actionLog.length === 0" style="color: #999; margin-top: 8px;">
            Click the button to see actions logged here
          </div>
          <div v-for="(log, index) in actionLog" :key="index" style="margin-top: 4px;">
            • {{ log }}
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    btnText: 'Test Action',
    btnType: 'submit',
    disabled: false,
  },
}