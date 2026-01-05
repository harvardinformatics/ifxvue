import IFXSelectableContact from './IFXSelectableContact.vue'
import { ref } from 'vue'

export default {
  title: 'Components/IFXSelectableContact',
  component: IFXSelectableContact,
  tags: ['autodocs'],
}

const mockContacts = [
  { id: 1, name: 'John Smith', type: 'Email', detail: 'john.smith@harvard.edu' },
  { id: 2, name: 'Sarah Johnson', type: 'Phone', detail: '617-555-0102' },
  { id: 3, name: 'Michael Chen', type: 'Email', detail: 'michael.chen@harvard.edu' },
]

const Template = (args) => ({
  components: { IFXSelectableContact },
  setup() {
    const item = ref({
      contact: null,
      type: null,
      role: '',
      detail: '',
      phone: '',
      address: '',
    })
    return { args, item }
  },
  template: `
    <div>
      <IFXSelectableContact
        :disabled="args.disabled"
        :allItems="args.allItems"
        v-model:item="item"
      />
      <pre style="margin-top: 20px; background: #f5f5f5; padding: 10px;">
      {{ JSON.stringify(item, null, 2) }}
    </pre>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  disabled: false,
  allItems: mockContacts,
}