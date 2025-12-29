import IFXContactDetail from './IFXContactDetail.vue'

export default {
  title: 'Components/IFXContactDetail',
  component: IFXContactDetail,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXContactDetail },
  setup() {
    return { args }
  },
  template: `<IFXContactDetail v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  id: '1',
  selectedContact: {
    id: '1',
    name: 'John Smith',
    computedName: 'John Smith',
    detail: 'john.smith@harvard.edu',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@harvard.edu',
    phone: '617-555-0101',
    address: '123 Harvard St, Cambridge, MA 02138',
  }
}

export const WithOrganization = Template.bind({})
WithOrganization.args = {
  id: '2',
  selectedContact: {
    id: '2',
    name: 'Sarah Johnson',
    computedName: 'Sarah Johnson',
    org: 'Neuroscience Lab',
    detail: 'sarah.johnson@harvard.edu',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@harvard.edu',
    phone: '617-555-0102',
  }
}