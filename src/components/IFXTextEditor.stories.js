import { ref } from 'vue'
import IFXTextEditor from './IFXTextEditor.vue'

export default {
  title: 'Components/IFXTextEditor',
  component: IFXTextEditor,
  tags: ['autodocs'],
}

export const Default = {
  render: (args) => ({
    components: { IFXTextEditor },
    setup() {
      const content = ref('')

      return {
        args,
        content
      }
    },
    template: `
      <div>
        <div style="padding: 20px;">
          <h3>Rich Text Editor</h3>
          <p>Type in the editor below to see live updates</p>
        </div>
        
        <div style="padding: 20px;">
          <IFXTextEditor v-model="content" v-bind="args" />
        </div>
        
        <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Content (HTML):</strong>
          <pre style="margin-top: 8px; padding: 12px; background: white; border-radius: 4px; overflow: auto;">{{ content || '(empty)' }}</pre>
        </div>
        
        <div style="margin-top: 12px; padding: 20px; background: #f5f5f5; border-radius: 4px;">
          <strong>Rendered Preview:</strong>
          <div style="margin-top: 8px; padding: 12px; background: white; border-radius: 4px; min-height: 50px;" v-html="content || '<em style=color:#999>Nothing typed yet</em>'"></div>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const WithInitialContent = {
  render: (args) => ({
    components: { IFXTextEditor },
    setup() {
      const content = ref('<h2>Welcome!</h2><p>This editor has <strong>initial content</strong> loaded.</p><ul><li>You can edit it</li><li>Add formatting</li><li>And more!</li></ul>')

      return {
        args,
        content
      }
    },
    template: `
      <div>
        <div style="padding: 20px;">
          <h3>Editor with Initial Content</h3>
        </div>
        
        <div style="padding: 20px;">
          <IFXTextEditor v-model="content" v-bind="args" />
        </div>
        
        <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Content:</strong>
          <pre style="margin-top: 8px; padding: 12px; background: white; border-radius: 4px; overflow: auto;">{{ content }}</pre>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const FormExample = {
  render: (args) => ({
    components: { IFXTextEditor },
    setup() {
      const title = ref('')
      const description = ref('')

      const handleSubmit = () => {
        alert(`Form submitted!\n\nTitle: ${title.value}\nDescription: ${description.value}`)
      }

      const handleClear = () => {
        title.value = ''
        description.value = ''
      }

      return {
        args,
        title,
        description,
        handleSubmit,
        handleClear
      }
    },
    template: `
      <div>
        <div style="padding: 20px;">
          <h3>Form with Text Editor</h3>
        </div>
        
        <v-form style="padding: 20px;">
          <v-text-field
            v-model="title"
            label="Title"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          
          <div class="mb-4">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Description</label>
            <IFXTextEditor v-model="description" v-bind="args" />
          </div>
          
          <div style="display: flex; gap: 8px;">
            <v-btn color="primary" @click="handleSubmit">
              Submit
            </v-btn>
            <v-btn variant="outlined" @click="handleClear">
              Clear
            </v-btn>
          </div>
        </v-form>
        
        <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 4px;">
          <strong>Form Data:</strong>
          <pre style="margin-top: 8px; padding: 12px; background: white; border-radius: 4px;">Title: {{ title || '(empty)' }}
Description: {{ description || '(empty)' }}</pre>
        </div>
      </div>
    `,
  }),
  args: {},
}