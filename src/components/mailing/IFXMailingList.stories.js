import IFXMailingList from './IFXMailingList.vue'

const mockMailings = [
  {
    id: 1,
    sent: '2024-12-10 14:30:00',
    subject: 'Monthly Lab Newsletter',
    fromstr: 'admin@cbsn.harvard.edu',
    tostr: 'lab-members@cbsn.harvard.edu',
    ccstr: 'faculty@cbsn.harvard.edu',
    bccstr: '',
    message: '<p>Updates about new MRI protocols</p>',
    status: 'Sent',
  },
  {
    id: 2,
    sent: '2024-12-08 09:15:00',
    subject: 'Equipment Maintenance',
    fromstr: 'facilities@cbsn.harvard.edu',
    tostr: 'all-users@cbsn.harvard.edu',
    ccstr: '',
    bccstr: '',
    message: '<p>7T MRI offline this weekend</p>',
    status: 'Sent',
  },
]

export default {
  title: 'Components/IFXMailingList',
  component: IFXMailingList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMailingList },
  setup() {
    return { args }
  },
  template: `<IFXMailingList v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}
