import IFXPageActionBar from './IFXPageActionBar.vue'

export default {
  title: 'Components/IFXPageActionBar',
  component: IFXPageActionBar,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    submitting: {
      control: 'boolean',
    },
    btnType: {
      control: 'select',
      options: ['submit', 'button', 'reset'],
    },
    btnText: {
      control: 'text',
    },
  },
}

const Template = (args) => ({
  components: { IFXPageActionBar },
  setup() {
    const handleAction = () => {
      console.log('Action triggered!')
    }

    return { args, handleAction }
  },
  template: `
    <IFXPageActionBar
      v-bind="args"
      @action="handleAction"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  disabled: false,
  btnType: 'submit',
  btnText: 'Save',
  submitting: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  btnType: 'submit',
  btnText: 'Save',
  submitting: false,
}