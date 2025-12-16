import IFXMailingCompose from './IFXMailingCompose.vue'

const mockContactables = [
  { detail: 'alice@cbsn.harvard.edu', label: 'Alice Johnson - Lab Manager', text: 'Alice Johnson', name: 'Alice Johnson' },
  { detail: 'bob@cbsn.harvard.edu', label: 'Bob Smith - Research Coordinator', text: 'Bob Smith', name: 'Bob Smith' },
  { detail: 'carol@cbsn.harvard.edu', label: 'Carol White - PI', text: 'Carol White', name: 'Carol White' },
  { detail: 'dave@external.edu', label: 'Dave Brown - Collaborator', text: 'Dave Brown', name: 'Dave Brown' },
  { detail: 'admin@cbsn.harvard.edu', label: 'Lab Admin', text: 'Lab Admin', name: 'Lab Admin' },
]

export default {
  title: 'Components/IFXMailingCompose',
  component: IFXMailingCompose,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMailingCompose },
  setup() {
    return { args }
  },
  beforeCreate() {
    this.$api.contactables = {
      getList: async () => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContactables
      }
    }
    this.$api.mailing = {
      sendIfxMailing: async (mailing) => {
        console.log('Sending mailing:', mailing)
        await new Promise(resolve => setTimeout(resolve, 500))
        return { message: 'Mailing sent successfully!' }
      }
    }
    this.$api.message = {
      getList: async () => []
    }
    this.$api.vars = {
      appDefaultFromField: 'noreply@cbsn.harvard.edu'
    }
    this.$api.auth = {
      getCurrentUserRecord: () => ({
        primaryEmail: 'currentuser@cbsn.harvard.edu'
      })
    }
  },
  template: `<IFXMailingCompose v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}

export const WithPrefilledData = Template.bind({})
WithPrefilledData.args = {
  from: 'admin@cbsn.harvard.edu',
  to: 'alice@cbsn.harvard.edu,bob@cbsn.harvard.edu',
  subject: 'Lab Meeting Tomorrow',
  message: '<p>Hi team,</p><p>Just a reminder about our lab meeting tomorrow at 2pm.</p><p>Best,<br>Admin</p>',
}

export const WithCcAndBcc = Template.bind({})
WithCcAndBcc.args = {
  from: 'admin@cbsn.harvard.edu',
  to: 'alice@cbsn.harvard.edu',
  cc: 'carol@cbsn.harvard.edu',
  bcc: 'dave@external.edu',
  subject: 'Research Update',
  message: '<p>Please find the latest research update attached.</p>',
}

export const BillingNotification = (args) => ({
  components: { IFXMailingCompose },
  setup() {
    return { args }
  },
  beforeCreate() {
    this.$api.contactables = {
      getList: async () => mockContactables
    }
    this.$api.getBillingContacts = async (orgSlugs, prefix) => {
      return {
        data: [
          { detail: 'alice@cbsn.harvard.edu', label: 'Alice Johnson - Neuroscience Lab Manager', name: 'Alice Johnson' },
          { detail: 'bob@cbsn.harvard.edu', label: 'Bob Smith - Psychology Lab Manager', name: 'Bob Smith' },
        ]
      }
    }
    this.$api.mailing = {
      sendIfxMailing: async (mailing) => {
        console.log('Sending billing notification:', mailing)
        await new Promise(resolve => setTimeout(resolve, 500))
        return { message: 'Billing notification sent!' }
      }
    }
    this.$api.organization = {
      parseSlug: (slug) => ({ name: slug.split('_')[0] })
    }
    this.$api.vars = {
      appDefaultFromField: 'billing@cbsn.harvard.edu'
    }
    this.$api.auth = {
      getCurrentUserRecord: () => ({ primaryEmail: 'admin@cbsn.harvard.edu' })
    }
  },
  template: `<IFXMailingCompose v-bind="args" />`,
})
BillingNotification.args = {
  labManagerOrgSlugs: ['neuroscience_lab', 'psychology_lab'],
  invoicePrefix: '7T-',
  recipientField: 'to',
  subject: 'Monthly Billing Statement',
  message: '<p>Please review your monthly billing statement.</p>',
}