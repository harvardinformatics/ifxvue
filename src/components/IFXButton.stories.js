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
    xSmall: {
      control: 'boolean',
    },
    small: {
      control: 'boolean',
    },
    large: {
      control: 'boolean',
    },
    inDialog: {
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
  btnType: 'other',
  disabled: false,
}

// FAB (Floating Action Button) - icon only, no text
export const FAB = {
  render: () => ({
    components: { IFXButton },
    setup() {
      const handleAction = (type) => {
        console.log(`${type} FAB clicked`)
      }
      return { handleAction }
    },
    template: `
      <div>
        <h3>FAB Buttons (Icon Only - No Text)</h3>
        <p style="color: #666; margin-bottom: 16px;">
          When no btnText is provided, the button becomes a circular FAB (Floating Action Button)
        </p>
        
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div style="text-align: center;">
            <IFXButton btnType="add" @action="handleAction('add')" />
            <div style="font-size: 12px; margin-top: 4px;">add</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="edit" @action="handleAction('edit')" />
            <div style="font-size: 12px; margin-top: 4px;">edit</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="remove" @action="handleAction('remove')" />
            <div style="font-size: 12px; margin-top: 4px;">remove</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="download" @action="handleAction('download')" />
            <div style="font-size: 12px; margin-top: 4px;">download</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="copy" @action="handleAction('copy')" />
            <div style="font-size: 12px; margin-top: 4px;">copy</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="home" @action="handleAction('home')" />
            <div style="font-size: 12px; margin-top: 4px;">home</div>
          </div>
          
          <div style="text-align: center;">
            <IFXButton btnType="reset" @action="handleAction('reset')" />
            <div style="font-size: 12px; margin-top: 4px;">reset</div>
          </div>
        </div>
      </div>
    `,
  }),
}

// FAB Sizes
export const FABSizes = {
  render: () => ({
    components: { IFXButton },
    template: `
      <div>
        <h3>FAB Button Sizes</h3>
        <div style="display: flex; gap: 16px; align-items: center; margin-top: 16px;">
          <div style="text-align: center;">
            <IFXButton btnType="add" x-small />
            <div style="font-size: 12px; margin-top: 4px;">x-small</div>
          </div>

          <div style="text-align: center;">
            <IFXButton btnType="add" small />
            <div style="font-size: 12px; margin-top: 4px;">small</div>
          </div>

          <div style="text-align: center;">
            <IFXButton btnType="add" />
            <div style="font-size: 12px; margin-top: 4px;">default</div>
          </div>

          <div style="text-align: center;">
            <IFXButton btnType="add" large />
            <div style="font-size: 12px; margin-top: 4px;">large</div>
          </div>
        </div>
      </div>
    `,
  }),
}

// All Button Types with Text
export const AllButtonTypes = {
  render: () => ({
    components: { IFXButton },
    template: `
      <div>
        <h3>All Button Types with Text</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
          <IFXButton btnType="submit" />
          <IFXButton btnType="close" />
          <IFXButton btnType="cancel" />
          <IFXButton btnType="edit" btnText="Edit" />
          <IFXButton btnType="add" btnText="Add" />
          <IFXButton btnType="remove" btnText="Remove" />
          <IFXButton btnType="download" btnText="Download" />
          <IFXButton btnType="copy" btnText="Copy" />
          <IFXButton btnType="other" btnText="Other" />
        </div>
      </div>
    `,
  }),
}

// In Dialog variant
export const InDialog = {
  render: () => ({
    components: { IFXButton },
    template: `
      <div>
        <h3>Dialog Buttons (text variant)</h3>
        <p style="color: #666; margin-bottom: 16px;">
          When inDialog is true, buttons use the text variant (no background)
        </p>
        <div style="display: flex; gap: 12px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <IFXButton btnType="cancel" inDialog />
          <IFXButton btnType="submit" inDialog />
        </div>
      </div>
    `,
  }),
}

// Interactive test with visible feedback
export const WithActionFeedback = {
  render: (args) => ({
    components: { IFXButton },
    setup() {
      const actionLog = ref([])
      const handleAction = () => {
        const timestamp = new Date().toLocaleTimeString()
        actionLog.value.push(`Clicked at ${timestamp}`)
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