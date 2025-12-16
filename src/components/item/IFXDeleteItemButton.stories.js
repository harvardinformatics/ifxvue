import { ref } from 'vue'
import IFXDeleteItemButton from './IFXDeleteItemButton.vue'

const mockItem = {
  id: 42,
  name: 'Test User',
  email: 'test@example.com',
}

const mockApiRef = {
  delete: async (item) => {
    console.log('Deleting item:', item)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }
}

export default {
  title: 'Components/IFXDeleteItemButton',
  component: IFXDeleteItemButton,
  tags: ['autodocs'],
}

export const Default = {
  render: (args) => ({
    components: { IFXDeleteItemButton },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 20px;">
        <p><strong>Item to delete:</strong> {{ args.item.name }} (ID: {{ args.item.id }})</p>
        <IFXDeleteItemButton v-bind="args" />
      </div>
    `,
  }),
  args: {
    itemType: 'User',
    item: mockItem,
    apiRef: mockApiRef,
  },
}
