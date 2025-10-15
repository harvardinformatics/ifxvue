import IFXMessageDisplay from './IFXMessageDisplay.vue'

export default {
  title: 'Components/IFXMessageDisplay',
  component: IFXMessageDisplay,
  tags: ['autodocs'],
}

export const Default = {
  render: (args) => ({
    components: { IFXMessageDisplay },
    setup() {
      return { args }
    },
    methods: {
      showSuccess() {
        this.$store.dispatch('showMessage', { message: 'Operation completed successfully!' })
      },
      showError() {
        this.$store.dispatch('showMessage', { message: 'An error occurred. Please try again.' })
      },
      showLong() {
        this.$store.dispatch('showMessage', {
          message: 'This is a longer message that will take more time to read. The timeout is calculated based on message length.'
        })
      },
      showAction() {
        this.$store.dispatch('showMessage', {
          message: 'Action required: Please review this important message.',
          isActionRequired: true
        })
      }
    },
    template: `
      <div>
        <div style="padding: 20px;">
          <h3>Click buttons to test message display:</h3>
          <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
            <v-btn color="success" @click="showSuccess">Show Success</v-btn>
            <v-btn color="error" @click="showError">Show Error</v-btn>
            <v-btn color="info" @click="showLong">Show Long Message</v-btn>
            <v-btn color="warning" @click="showAction">Action Required</v-btn>
          </div>
        </div>
        <IFXMessageDisplay v-bind="args" />
      </div>
    `,
  }),
  args: {
    vertical: false,
    top: true,
    color: 'grey-darken-4',
    multiline: false,
    timeout: 3000,
  },
}