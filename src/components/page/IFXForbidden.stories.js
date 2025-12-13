import IFXForbidden from './IFXForbidden.vue'

export default {
  title: 'Components/IFXForbidden',
  component: IFXForbidden,
  tags: ['autodocs'],
  argTypes: {
    msg: {
      control: 'text',
      description: 'Custom forbidden message',
    },
  },
}

const Template = (args) => ({
  components: { IFXForbidden },
  setup() {
    return { args }
  },
  template: `
    <IFXForbidden v-bind="args" />
  `,
})

export const Default = Template.bind({})
Default.args = {
  msg: 'You are not authorized to view this page.',
}

export const CustomMessage = Template.bind({})
CustomMessage.args = {
  msg: 'Access denied. This resource requires administrator privileges.',
}

export const WithCustomContent = {
  render: (args) => ({
    components: { IFXForbidden },
    setup() {
      return { args }
    },
    template: `
      <IFXForbidden v-bind="args">
        <div>
          <p>Your account does not have permission to access this feature.</p>
          <p>Please contact your administrator to request access.</p>
        </div>
      </IFXForbidden>
    `,
  }),
  args: {
    msg: 'Insufficient Permissions',
  },
}