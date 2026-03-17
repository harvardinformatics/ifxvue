import { ref } from 'vue'
import IFXItemDataTable from './IFXItemDataTable.vue'

// Mock data
const mockHeaders = [
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Email', value: 'email', sortable: true },
  { title: 'Role', value: 'role', sortable: true },
  { title: 'Status', value: 'status', sortable: true },
  { title: 'Date Modified', value: 'date_modified', sortable: true },
]

const mockItems = [
  { id: 1, name: 'Alan Turing', email: 'alan@turing.com', role: 'Admin', status: 'Active', date_modified: '2024-01-15' },
  { id: 2, name: 'Ada Lovelace', email: 'ada@lovelace.com', role: 'User', status: 'Active', date_modified: '2024-01-14' },
  { id: 3, name: 'Grace Hopper', email: 'grace@hopper.com', role: 'Manager', status: 'Inactive', date_modified: '2024-01-13' },
  { id: 4, name: 'John von Neumann', email: 'john@neumann.com', role: 'User', status: 'Active', date_modified: '2024-01-12' },
  { id: 5, name: 'Claude Shannon', email: 'claude@shannon.com', role: 'Admin', status: 'Active', date_modified: '2024-01-11' },
  { id: 6, name: 'Donald Knuth', email: 'donald@knuth.com', role: 'User', status: 'Active', date_modified: '2024-01-10' },
  { id: 7, name: 'Edsger Dijkstra', email: 'edsger@dijkstra.com', role: 'Manager', status: 'Inactive', date_modified: '2024-01-09' },
  { id: 8, name: 'Barbara Liskov', email: 'barbara@liskov.com', role: 'User', status: 'Active', date_modified: '2024-01-08' },
]

// Mock storage
const mockStorage = {
  getItem: (key) => {
    return localStorage.getItem(key) ? parseInt(localStorage.getItem(key)) : null
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value.toString())
  },
}

export default {
  title: 'Components/IFXItemDataTable',
  component: IFXItemDataTable,
  tags: ['autodocs'],
  argTypes: {
    showSelect: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    multiSort: {
      control: 'boolean',
    },
    defaultItemsPerPage: {
      control: 'number',
    },
  },
}

const Template = (args) => ({
  components: { IFXItemDataTable },
  setup() {
    const selected = ref([])

    const handleClickRow = (item) => {
      console.log('Row clicked:', item)
    }

    const handlePageChange = (page) => {
      console.log('Page changed:', page)
    }

    return {
      args,
      selected,
      handleClickRow,
      handlePageChange,
      mockHeaders,
      mockItems,
    }
  },
  template: `
    <div>
      <IFXItemDataTable
        v-bind="args"
        :headers="mockHeaders"
        :items="mockItems"
        v-model:selected="selected"
        @click-row="handleClickRow"
        @update:page="handlePageChange"
      />
      <div v-if="selected.length > 0" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
        <strong>Selected Items ({{ selected.length }}):</strong>
        <div v-for="item in selected" :key="item.id" style="margin-top: 8px;">
          • {{ item.name }} - {{ item.email }}
        </div>
      </div>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  itemType: 'user',
  showSelect: true,
  loading: false,
  sortBy: 'date_modified',
  sortDesc: true,
  multiSort: false,
  defaultItemsPerPage: 10,
}

export const WithoutSelection = Template.bind({})
WithoutSelection.args = {
  itemType: 'user',
  showSelect: false,
  loading: false,
  sortBy: 'name',
  sortDesc: false,
  multiSort: false,
  defaultItemsPerPage: 10,
}

export const Loading = Template.bind({})
Loading.args = {
  itemType: 'user',
  showSelect: true,
  loading: true,
  sortBy: 'date_modified',
  sortDesc: true,
  multiSort: false,
  defaultItemsPerPage: 10,
}

export const MultiSort = Template.bind({})
MultiSort.args = {
  itemType: 'user',
  showSelect: true,
  loading: false,
  sortBy: ['role', 'name'],
  sortDesc: [false, false],
  multiSort: true,
  defaultItemsPerPage: 10,
}

export const SmallPageSize = Template.bind({})
SmallPageSize.args = {
  itemType: 'user',
  showSelect: true,
  loading: false,
  sortBy: 'date_modified',
  sortDesc: true,
  multiSort: false,
  defaultItemsPerPage: 5,
}

export const WithNamedSlot = {
  render: (args) => ({
    components: { IFXItemDataTable },
    setup() {
      const selected = ref([])
      const customHeaders = [
        ...mockHeaders,
        { title: 'Actions', key: 'actions', sortable: false, namedSlot: true },
      ]

      return {
        args,
        selected,
        customHeaders,
        mockItems,
      }
    },
    beforeCreate() {
      this.$api = {
        storage: mockStorage,
      }
    },
    template: `
      <IFXItemDataTable
        v-bind="args"
        :headers="customHeaders"
        :items="mockItems"
        v-model:selected="selected"
      >
        <template #actions="{ item }">
          <v-btn size="small" color="primary" @click="console.log('Edit', item)">Edit</v-btn>
        </template>
      </IFXItemDataTable>
    `,
  }),
  args: {
    itemType: 'user',
    showSelect: true,
    loading: false,
    sortBy: 'date_modified',
    sortDesc: true,
    multiSort: false,
    defaultItemsPerPage: 10,
  },
}