import IFXMessageDetail from './IFXMessageDetail.vue'

export default {
  title: 'Components/IFXMessageDetail',
  component: IFXMessageDetail,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMessageDetail },
  setup() {
    return { args }
  },
  template: `<IFXMessageDetail v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  id: '1',
  selectedMessage: {
    id: 1,
    name: 'lab_meeting_reminder',
    displayName: 'Lab Meeting Reminder',
    subject: 'Weekly Lab Meeting',
    message: '<p>Hi team,</p><p>This is a reminder about our weekly lab meeting scheduled for <strong>Thursday at 2 PM</strong>.</p><p>Please review the agenda beforehand.</p>',
  }
}

export const SimpleMessage = Template.bind({})
SimpleMessage.args = {
  id: '2',
  selectedMessage: {
    id: 2,
    name: 'equipment_maintenance',
    displayName: 'Equipment Maintenance Notice',
    subject: 'Scheduled Maintenance',
    message: '<p>The MRI scanner will be offline for maintenance this weekend.</p>',
  }
}

export const WithoutDisplayName = Template.bind({})
WithoutDisplayName.args = {
  id: '3',
  selectedMessage: {
    id: 3,
    name: 'safety_training',
    subject: 'Annual Safety Training Required',
    message: '<p>All lab members must complete annual safety training by the end of the month.</p><p>Training materials are available on the intranet.</p>',
  }
}