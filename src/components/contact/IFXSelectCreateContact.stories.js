import IFXSelectCreateContact from './IFXSelectCreateContact.vue'
import { ref } from 'vue'

export default {
  title: 'Components/IFXSelectCreateContact',
  component: IFXSelectCreateContact,
  tags: ['autodocs'],
}

const mockContacts = [
  { id: 1, name: 'John Smith', type: 'Email', detail: 'john.smith@harvard.edu' },
  { id: 2, name: 'Sarah Johnson', type: 'Phone', detail: '617-555-0102' },
  { id: 3, name: 'Michael Chen', type: 'Email', detail: 'michael.chen@harvard.edu' },
]

const Template = (args) => ({
  components: { IFXSelectCreateContact },
  setup() {
    const item = ref({
      contact: null,
      role: null,
    })
    const isValid = ref(false)
    return { args, item, isValid }
  },
  template: `
    <div>
      <IFXSelectCreateContact 
        :allItems="args.allItems" 
        :item="item"
        :allRoles="args.allRoles"
        :filterRoles="args.filterRoles"
        @update:valid="isValid = $event"
      />
      <div style="margin-top: 20px; padding: 10px; background: #f5f5f5;">
        <strong>Form Valid:</strong> {{ isValid }}<br>
        <strong>Selected Contact:</strong> {{ item.contact?.detail || 'None' }}<br>
        <strong>Selected Role:</strong> {{ item.role || 'None' }}
      </div>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  allItems: mockContacts,
  allRoles: [
    { name: 'Additional Email', editable: true },
    { name: 'Work Phone', editable: true },
    { name: 'Additional Phone', editable: true },
    { name: 'Additional Contact', editable: true },
  ],
  filterRoles: true,
}