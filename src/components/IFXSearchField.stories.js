import { ref } from 'vue'
import IFXSearchField from './IFXSearchField.vue'

export default {
  title: 'Components/IFXSearchField',
  component: IFXSearchField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
  },
}

export const Default = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('')

      return {
        args,
        searchQuery
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Default Search Field (Vue 3 v-model)</h3>
        <p>Standard search field using Vue 3 v-model pattern</p>
        <div style="margin-top: 16px;">
          <IFXSearchField v-model="searchQuery" v-bind="args" />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Search Value:</strong> {{ searchQuery || '(empty)' }}
        </div>
        <div style="margin-top: 8px;">
          <v-btn size="small" @click="searchQuery = 'test query'">Set Test Value</v-btn>
          <v-btn size="small" class="ml-2" @click="searchQuery = ''">Clear</v-btn>
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Search',
    disabled: false,
    clearable: true,
  },
}

export const BackwardCompatible = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('')

      const handleSearchUpdate = (value) => {
        console.log('Vue 2 pattern - update:search event received:', value)
        searchQuery.value = value
      }

      return {
        args,
        searchQuery,
        handleSearchUpdate
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Backward Compatible (Vue 2 Pattern)</h3>
        <p>Using the old Vue 2 pattern with :search prop and @update:search event</p>
        
        <div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <strong>💡 Backward Compatibility Demo:</strong> This uses the Vue 2 pattern (<code>:search</code> + <code>@update:search</code>) instead of v-model
        </div>
        
        <div style="margin-top: 16px;">
          <IFXSearchField 
            :search="searchQuery" 
            @update:search="handleSearchUpdate"
            v-bind="args" 
          />
        </div>
        
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Search Value:</strong> {{ searchQuery || '(empty)' }}
        </div>
        
        <div style="margin-top: 8px;">
          <v-btn size="small" @click="searchQuery = 'legacy pattern'">Set Test Value</v-btn>
          <v-btn size="small" class="ml-2" @click="searchQuery = ''">Clear</v-btn>
        </div>
        
        <div style="margin-top: 16px; padding: 12px; background: #e3f2fd; border-radius: 4px; font-size: 14px;">
          <strong>Check the console</strong> to see the <code>update:search</code> events being fired (Vue 2 compatibility)
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Search (Vue 2 Pattern)',
    disabled: false,
    clearable: true,
  },
}

export const CustomLabel = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('')

      return {
        args,
        searchQuery
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Custom Label</h3>
        <div style="margin-top: 16px;">
          <IFXSearchField v-model="searchQuery" v-bind="args" />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Search Query:</strong> {{ searchQuery || '(empty)' }}
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Filter Users',
    disabled: false,
    clearable: true,
  },
}

export const Disabled = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('Cannot edit this')

      return {
        args,
        searchQuery
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Disabled State</h3>
        <p>Search field is disabled - user cannot interact with it</p>
        <div style="margin-top: 16px;">
          <IFXSearchField v-model="searchQuery" v-bind="args" />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Value:</strong> {{ searchQuery }}
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Search',
    disabled: true,
    clearable: true,
  },
}

export const NotClearable = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('This text cannot be cleared with X button')

      return {
        args,
        searchQuery
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Not Clearable</h3>
        <p>No clear button (X) appears - user must manually delete text</p>
        <div style="margin-top: 16px;">
          <IFXSearchField v-model="searchQuery" v-bind="args" />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Search Query:</strong> {{ searchQuery || '(empty)' }}
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Search',
    disabled: false,
    clearable: false,
  },
}

export const LiveFiltering = {
  render: (args) => ({
    components: { IFXSearchField },
    setup() {
      const searchQuery = ref('')
      const items = [
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'Diana Prince',
        'Eve Adams',
        'Frank Castle',
        'Grace Hopper',
        'Henry Ford',
      ]

      return {
        args,
        searchQuery,
        items
      }
    },
    computed: {
      filteredItems() {
        if (!this.searchQuery) return this.items
        return this.items.filter(item =>
          item.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Live Filtering Example</h3>
        <p>Type to filter the list of names below</p>
        <div style="margin-top: 16px;">
          <IFXSearchField v-model="searchQuery" v-bind="args" />
        </div>
        
        <div style="margin-top: 20px;">
          <strong>Results ({{ filteredItems.length }} of {{ items.length }}):</strong>
          <v-list style="margin-top: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <v-list-item v-for="item in filteredItems" :key="item">
              {{ item }}
            </v-list-item>
            <v-list-item v-if="filteredItems.length === 0" style="color: #999;">
              No results found
            </v-list-item>
          </v-list>
        </div>
      </div>
    `,
  }),
  args: {
    label: 'Filter Names',
    disabled: false,
    clearable: true,
  },
}

export const SideBySideComparison = {
  render: () => ({
    components: { IFXSearchField },
    setup() {
      const vue3Search = ref('')
      const vue2Search = ref('')

      const handleVue2Update = (value) => {
        vue2Search.value = value
      }

      return {
        vue3Search,
        vue2Search,
        handleVue2Update
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Side-by-Side Comparison</h3>
        <p>Both patterns work identically - choose based on your Vue version</p>
        
        <div style="display: flex; gap: 32px; margin-top: 20px;">
          <div style="flex: 1; padding: 16px; border: 2px solid #2196f3; border-radius: 8px; background: #e3f2fd;">
            <h4 style="color: #1565c0; margin-bottom: 12px;">Vue 3 Pattern (Recommended)</h4>
            <IFXSearchField v-model="vue3Search" label="Search (v-model)" />
            <div style="margin-top: 12px; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
              <code>v-model="searchQuery"</code>
              <div style="margin-top: 8px;"><strong>Value:</strong> {{ vue3Search || '(empty)' }}</div>
            </div>
          </div>
          
          <div style="flex: 1; padding: 16px; border: 2px solid #ff9800; border-radius: 8px; background: #fff3e0;">
            <h4 style="color: #e65100; margin-bottom: 12px;">Vue 2 Pattern (Legacy)</h4>
            <IFXSearchField :search="vue2Search" @update:search="handleVue2Update" label="Search (:search prop)" />
            <div style="margin-top: 12px; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
              <code>:search + @update:search</code>
              <div style="margin-top: 8px;"><strong>Value:</strong> {{ vue2Search || '(empty)' }}</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>✅ Both patterns are fully supported!</strong> Use v-model for new Vue 3 code, or keep the old pattern in existing Vue 2 applications.
        </div>
      </div>
    `,
  }),
}