import { ref } from 'vue'
import IFXContactablesCombobox from './IFXContactablesCombobox.vue'

// Mock data
const mockContactables = [
  {
    id: 23,
    type: "User",
    detail: "alan@turing.com",
    name: "Alan Turing",
    text: "Alan Turing (Primary Email) - alan@turing.com",
    label: "Alan Turing (Primary Email)",
    icon: "person",
    color: "#F39C12"
  },
  {
    id: 34,
    type: "User",
    detail: "lovelace@adaperson.com",
    name: "Ada Lovelace",
    text: "Ada Lovelace (Primary Email) - lovelace@adaperson.com",
    label: "Ada Lovelace (Primary Email)",
    icon: "person",
    color: "#F39C12"
  },
  {
    id: 35,
    type: "User",
    detail: "coolguy@neumann.com",
    name: "John von Neumann",
    text: "John von Neumann (Primary Email) - coolguy@neumann.com",
    label: "John von Neumann (Primary Email)",
    icon: "person",
    color: "#F39C12"
  },
  {
    id: 36,
    type: "User",
    detail: "hopper@grace.com",
    name: "Grace Hopper",
    text: "Grace Hopper (Primary Email) - hopper@grace.com",
    label: "Grace Hopper (Primary Email)",
    icon: "person",
    color: "#F39C12"
  },
  {
    id: 24,
    type: "Contact",
    detail: "notspiderman@marvel.com",
    name: "Peter Parker",
    text: "notspiderman@marvel.com",
    label: "notspiderman@marvel.com",
    icon: "contact_mail",
    color: "red"
  },
  {
    id: 25,
    type: "Contact",
    detail: "hulksmash@marvel.com",
    name: "Bruce Banner",
    text: "hulksmash@marvel.com",
    label: "hulksmash@marvel.com",
    icon: "contact_mail",
    color: "red"
  },
  {
    id: 26,
    type: "Contact",
    detail: "batmanbutiamreallyrich@dccomicsforeverandever.com",
    name: "Bruce Wayne",
    text: "batmanbutiamreallyrich@dccomicsforeverandever.com",
    label: "batmanbutiamreallyrich@dccomicsforeverandever.com",
    icon: "contact_mail",
    color: "red"
  }
]

export default {
  title: 'Components/IFXContactablesCombobox',
  component: IFXContactablesCombobox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    isSearchDisabled: {
      control: 'boolean',
    },
  },
}

// Template with state management
const Template = (args) => ({
  components: { IFXContactablesCombobox },
  setup() {
    const selectedContacts = ref([])

    const handleUpdate = (selected) => {
      console.log('Selected contacts:', selected)
      selectedContacts.value = selected
    }

    return {
      args,
      selectedContacts,
      handleUpdate,
      mockContactables
    }
  },
  template: `
    <div>
      <IFXContactablesCombobox
        v-bind="args"
        :modelValue="selectedContacts"
        :contactables="mockContactables"
        @update:modelValue="handleUpdate"
      />
      <div v-if="selectedContacts.length > 0" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
        <strong>Selected ({{ selectedContacts.length }}):</strong>
        <div v-for="contact in selectedContacts" :key="contact.id" style="margin-top: 8px;">
          • {{ contact.label }} ({{ contact.type }})
        </div>
      </div>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  label: 'recipients',
  required: false,
  isSearchDisabled: false,
}

export const Required = Template.bind({})
Required.args = {
  label: 'contacts',
  required: true,
  isSearchDisabled: false,
}

export const WithPreselected = {
  render: (args) => ({
    components: { IFXContactablesCombobox },
    setup() {
      // Pre-select first two contacts
      const selectedContacts = ref([mockContactables[0], mockContactables[4]])

      const handleUpdate = (selected) => {
        console.log('Selected contacts:', selected)
        selectedContacts.value = selected
      }

      return {
        args,
        selectedContacts,
        handleUpdate,
        mockContactables
      }
    },
    template: `
      <div>
        <IFXContactablesCombobox
          v-bind="args"
          :modelValue="selectedContacts"
          :contactables="mockContactables"
          @update:modelValue="handleUpdate"
        />
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
          <strong>Selected ({{ selectedContacts.length }}):</strong>
          <div v-for="contact in selectedContacts" :key="contact.id" style="margin-top: 8px;">
            • {{ contact.label }} ({{ contact.type }})
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    label: 'team members',
    required: false,
    isSearchDisabled: false,
  },
}