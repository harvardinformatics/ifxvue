import IFXContactRoleDisplayEdit from './IFXContactRoleDisplayEdit.vue'
import { ref } from 'vue'

export default {
  title: 'Components/IFXContactRoleDisplayEdit',
  component: IFXContactRoleDisplayEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXContactRoleDisplayEdit },
  setup() {
    const contact = ref({ ...args.contact })
    return { args, contact }
  },
  template: `
    <div>
      <IFXContactRoleDisplayEdit 
        :contact="contact"
        :allRoles="args.allRoles"
        :filterRoles="args.filterRoles"
        @change="contact = $event"
      />
      <div style="margin-top: 20px; padding: 10px; background: #f5f5f5;">
        <strong>Current Contact:</strong><br>
        <pre>{{ JSON.stringify(contact, null, 2) }}</pre>
      </div>
    </div>
  `,
})

export const EmailContact = Template.bind({})
EmailContact.args = {
  contact: {
    id: 1,
    role: 'Additional Email',
    type: 'Email',
    detail: 'john.smith@harvard.edu',
    active: true,
    contact: {
      id: 1,
      name: 'John Smith',
      type: 'Email',
      detail: 'john.smith@harvard.edu',
    }
  },
  allRoles: [
    { name: 'Additional Email', editable: true },
    { name: 'Work Phone', editable: true },
    { name: 'Additional Phone', editable: true },
    { name: 'Additional Contact', editable: true },
  ],
  filterRoles: true,
}

export const PhoneContact = Template.bind({})
PhoneContact.args = {
  contact: {
    id: 2,
    role: 'Work Phone',
    type: 'Phone',
    detail: '617-555-0102',
    active: true,
    contact: {
      id: 2,
      name: 'Sarah Johnson',
      type: 'Phone',
      detail: '617-555-0102',
    }
  },
  allRoles: [
    { name: 'Additional Email', editable: true },
    { name: 'Work Phone', editable: true },
    { name: 'Additional Phone', editable: true },
    { name: 'Additional Contact', editable: true },
  ],
  filterRoles: true,
}

export const FullContact = Template.bind({})
FullContact.args = {
  contact: {
    id: 3,
    role: 'Additional Contact',
    type: 'Email',
    detail: 'michael.chen@harvard.edu',
    active: true,
    contact: {
      id: 3,
      name: 'Michael Chen',
      type: 'Email',
      detail: 'michael.chen@harvard.edu',
      phone: '617-555-0103',
      address: '123 Main St, Cambridge, MA 02138',
    }
  },
  allRoles: [
    { name: 'Additional Email', editable: true },
    { name: 'Work Phone', editable: true },
    { name: 'Additional Phone', editable: true },
    { name: 'Additional Contact', editable: true },
  ],
  filterRoles: true,
}

export const InactiveContact = Template.bind({})
InactiveContact.args = {
  contact: {
    id: 4,
    role: 'Additional Email',
    type: 'Email',
    detail: 'old.email@harvard.edu',
    active: false,
    contact: {
      id: 4,
      name: 'Old Contact',
      type: 'Email',
      detail: 'old.email@harvard.edu',
    }
  },
  allRoles: [
    { name: 'Additional Email', editable: true },
    { name: 'Work Phone', editable: true },
    { name: 'Additional Phone', editable: true },
    { name: 'Additional Contact', editable: true },
  ],
  filterRoles: true,
}