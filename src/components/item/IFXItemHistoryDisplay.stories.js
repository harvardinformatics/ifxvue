import IFXItemHistoryDisplay from './IFXItemHistoryDisplay.vue'

export default {
  title: 'Components/IFXItemHistoryDisplay',
  component: IFXItemHistoryDisplay,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXItemHistoryDisplay },
  setup() {
    return { args }
  },
  template: `
    <div style="padding: 20px;">
      <IFXItemHistoryDisplay :item="args.item" />
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  item: {
    id: 1,
    name: 'Test User',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-10-05T14:20:00Z',
  },
}

export const WithDateJoined = Template.bind({})
WithDateJoined.args = {
  item: {
    id: 2,
    username: 'aturing',
    dateJoined: '2023-06-20T08:15:00Z',
    updated: '2024-11-01T16:45:00Z',
  },
}

export const WithAlternateFields = Template.bind({})
WithAlternateFields.args = {
  item: {
    id: 3,
    productName: '7T MRI Scanner',
    dateCreated: '2022-03-10T12:00:00Z',
    lastUpdate: '2024-12-01T09:30:00Z',
  },
}

export const RecentlyCreated = Template.bind({})
RecentlyCreated.args = {
  item: {
    id: 4,
    name: 'New Item',
    created: '2024-12-09T18:00:00Z',
    updated: '2024-12-09T18:00:00Z',
  },
}