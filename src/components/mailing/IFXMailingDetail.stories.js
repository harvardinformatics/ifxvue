import IFXMailingDetail from './IFXMailingDetail.vue'

const mockMailing = {
  id: 1,
  sent: '2024-12-10 14:30:00',
  subject: 'Monthly Lab Newsletter - December 2024',
  fromstr: 'Lab Admin <admin@cbsn.harvard.edu>',
  tostr: 'Lab Members <lab-members@cbsn.harvard.edu>, Students <students@cbsn.harvard.edu>',
  ccstr: 'Faculty <faculty@cbsn.harvard.edu>, Staff <staff@cbsn.harvard.edu>',
  bccstr: 'External Collaborators <collaborators@external.edu>',
  message: `
    <p>Dear lab members,</p>
    <p>This month we have exciting updates about our new MRI protocols and upcoming maintenance schedules.</p>
    <h3>New MRI Protocols</h3>
    <p>The 7T MRI now supports enhanced diffusion imaging sequences. Please review the updated documentation before your next scan session.</p>
    <h3>Upcoming Events</h3>
    <ul>
      <li>December 15: Lab Meeting - New Research Findings</li>
      <li>December 20: Equipment Training Session</li>
      <li>December 24-26: Holiday Closure</li>
    </ul>
    <p>Best regards,<br>Lab Administration</p>
  `,
  status: 'Sent',
}

export default {
  title: 'Components/IFXMailingDetail',
  component: IFXMailingDetail,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMailingDetail },
  setup() {
    return { args }
  },
  beforeCreate() {
    // Mock API in case it's called
    this.$api.mailing = this.$api.mailing || {}
    this.$api.mailing.getByID = async () => args.selectedMailing
  },
  template: `<IFXMailingDetail v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  id: '1',
  selectedMailing: mockMailing,
}

export const WithoutBCC = Template.bind({})
WithoutBCC.args = {
  id: '1',
  selectedMailing: {
    ...mockMailing,
    bccstr: '',
  },
}

export const SimpleMessage = Template.bind({})
SimpleMessage.args = {
  id: '2',
  selectedMailing: {
    id: 2,
    sent: '2024-12-08 09:15:00',
    subject: 'Equipment Maintenance Notice',
    fromstr: 'facilities@cbsn.harvard.edu',
    tostr: 'all-users@cbsn.harvard.edu',
    ccstr: '',
    bccstr: '',
    message: '<p>The 7T MRI will be offline for scheduled maintenance from Saturday 8am to Sunday 6pm.</p>',
    status: 'Sent',
  },
}