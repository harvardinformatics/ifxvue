import IFXMessageCreateEdit from './IFXMessageCreateEdit.vue'

export default {
  title: 'Components/IFXMessageCreateEdit',
  component: IFXMessageCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMessageCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXMessageCreateEdit v-bind="args" />`,
})

export const Create = Template.bind({})
Create.args = {
  selectedMessage: {
    subject: '',
    message: '',
  }
}

export const Edit = Template.bind({})
Edit.args = {
  id: '1',
  selectedMessage: {
    id: 1,
    name: 'lab_meeting_reminder',
    displayName: 'Lab Meeting Reminder',
    subject: 'Weekly Lab Meeting',
    message: '<p>Hi team,</p><p>This is a reminder about our weekly lab meeting scheduled for <strong>Thursday at 2 PM</strong>.</p><p>Please review the agenda beforehand.</p>',
  }
}

export const EditWithoutDisplayName = Template.bind({})
EditWithoutDisplayName.args = {
  id: '2',
  selectedMessage: {
    id: 2,
    name: 'equipment_maintenance',
    subject: 'Scheduled Maintenance',
    message: '<p>The MRI scanner will be offline for maintenance this weekend.</p>',
  }
}