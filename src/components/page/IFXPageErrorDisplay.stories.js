import IFXPageErrorDisplay from './IFXPageErrorDisplay.vue'

export default {
  title: 'Components/IFXPageErrorDisplay',
  component: IFXPageErrorDisplay,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXPageErrorDisplay },
  setup() {
    return { args }
  },
  template: `
    <IFXPageErrorDisplay :errors="args.errors" />
  `,
})

export const Default = Template.bind({})
Default.args = {
  errors: {
  non_field_errors: 'An unexpected error occurred while processing your request.',
},
}

export const WithError = Template.bind({})
WithError.args = {
  errors: {
    non_field_errors: 'Something went wrong. Please try again.',
  },
}

export const WithLongError = Template.bind({})
WithLongError.args = {
  errors: {
    non_field_errors: 'An unexpected error occurred while processing your request. Please check your input and try again. If the problem persists, contact support.',
  },
}