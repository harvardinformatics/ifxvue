import IFXContactCard from './IFXContactCard.vue'

export default {
  title: 'Components/IFXContactCard',
  component: IFXContactCard,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXContactCard },
  setup() {
    return { args }
  },
  template: `<IFXContactCard v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  contact: {
    id: 1,
    name: 'John Smith',
    detail: 'john.smith@harvard.edu',
    phone: '617-555-0101',
    address: '123 Harvard St, Cambridge, MA 02138',
  }
}

export const WithUserId = Template.bind({})
WithUserId.args = {
  contact: {
    id: 2,
    name: 'Sarah Johnson',
    userId: 42,
    detail: 'sarah.johnson@harvard.edu',
    phone: '617-555-0102',
  }
}

export const WithOrganization = Template.bind({})
WithOrganization.args = {
  contact: {
    id: 3,
    name: 'Contact Person',
    org: 'Neuroscience Department',
    detail: 'contact@neuro.harvard.edu',
    phone: '617-555-0103',
    address: '456 Science Center, Cambridge, MA 02138',
  }
}

export const Dense = Template.bind({})
Dense.args = {
  dense: true,
  contact: {
    id: 4,
    name: 'Michael Chen',
    detail: 'michael.chen@harvard.edu',
  }
}

export const Empty = Template.bind({})
Empty.args = {
  contact: null
}

export const NoEditButton = Template.bind({})
NoEditButton.args = {
  editBtn: false,
  contact: {
    id: 5,
    name: 'Emily Rodriguez',
    detail: 'emily.rodriguez@harvard.edu',
    phone: '617-555-0104',
  }
}