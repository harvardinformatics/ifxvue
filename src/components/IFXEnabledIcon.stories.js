import { ref } from 'vue'
import IFXEnabledIcon from './IFXEnabledIcon.vue'

export default {
  title: 'Components/IFXEnabledIcon',
  component: IFXEnabledIcon,
  tags: ['autodocs'],
  argTypes: {
    isEnabled: {
      control: 'boolean',
    },
    iconOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export const EnabledUser = {
  render: (args) => ({
    components: { IFXEnabledIcon },
    setup() {
      const isEnabled = ref(true)

      const handleUpdate = (value) => {
        console.log('Enabled status changed:', value)
        isEnabled.value = value
      }

      return {
        args,
        isEnabled,
        handleUpdate
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Enabled FAS User (Editable)</h3>
        <p>User is enabled and can toggle status</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXEnabledIcon 
            :isEnabled="isEnabled"
            v-bind="args"
            @update:isEnabled="handleUpdate"
          />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Status:</strong> {{ isEnabled ? 'Enabled' : 'Disabled' }}
        </div>
      </div>
    `,
  }),
  args: {
    isEnabled: true,
    iconOnly: false,
    disabled: false,
  },
}

export const DisabledUser = {
  render: (args) => ({
    components: { IFXEnabledIcon },
    setup() {
      const isEnabled = ref(false)

      const handleUpdate = (value) => {
        console.log('Enabled status changed:', value)
        isEnabled.value = value
      }

      return {
        args,
        isEnabled,
        handleUpdate
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Disabled FAS User (Editable)</h3>
        <p>User is disabled but can be toggled on</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXEnabledIcon 
            :isEnabled="isEnabled"
            v-bind="args"
            @update:isEnabled="handleUpdate"
          />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Status:</strong> {{ isEnabled ? 'Enabled' : 'Disabled' }}
        </div>
      </div>
    `,
  }),
  args: {
    isEnabled: false,
    iconOnly: false,
    disabled: false,
  },
}

export const IconOnly = {
  render: (args) => ({
    components: { IFXEnabledIcon },
    setup() {
      const isEnabledTrue = ref(true)
      const isEnabledFalse = ref(false)

      return {
        args,
        isEnabledTrue,
        isEnabledFalse
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Icon Only Mode</h3>
        <p>Compact display for data tables and small spaces</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px; display: flex; gap: 32px; align-items: center;">
          <div>
            <strong>Enabled:</strong>
            <IFXEnabledIcon 
              :isEnabled="isEnabledTrue"
              :iconOnly="true"
              :disabled="true"
            />
          </div>
          <div>
            <strong>Disabled:</strong>
            <IFXEnabledIcon 
              :isEnabled="isEnabledFalse"
              :iconOnly="true"
              :disabled="true"
            />
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    isEnabled: true,
    iconOnly: true,
    disabled: true,
  },
}

export const ReadOnlyView = {
  render: (args) => ({
    components: { IFXEnabledIcon },
    setup() {
      const isEnabledTrue = ref(true)
      const isEnabledFalse = ref(false)

      return {
        args,
        isEnabledTrue,
        isEnabledFalse
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Read-Only (View Only)</h3>
        <p>User cannot edit the enabled status - display only mode</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <div style="margin-bottom: 16px;">
            <strong>Enabled User (Read-only):</strong>
            <IFXEnabledIcon 
              :isEnabled="isEnabledTrue"
              :disabled="true"
              v-bind="args"
            />
          </div>
          <div>
            <strong>Disabled User (Read-only):</strong>
            <IFXEnabledIcon 
              :isEnabled="isEnabledFalse"
              :disabled="true"
              v-bind="args"
            />
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    isEnabled: true,
    iconOnly: false,
    disabled: true,
  },
}

export const AllStates = {
  render: () => ({
    components: { IFXEnabledIcon },
    setup() {
      return {}
    },
    template: `
      <div style="padding: 20px;">
        <h3>All States Comparison</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>State</th>
                <th>Full Label</th>
                <th>Icon Only</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Enabled (Editable)</strong></td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="true"
                    :disabled="false"
                  />
                </td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="true"
                    :disabled="false"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Disabled (Editable)</strong></td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="false"
                    :disabled="false"
                  />
                </td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="false"
                    :disabled="false"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Enabled (Read-only)</strong></td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="true"
                    :disabled="true"
                  />
                </td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="true"
                    :disabled="true"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Disabled (Read-only)</strong></td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="false"
                    :disabled="true"
                  />
                </td>
                <td>
                  <IFXEnabledIcon 
                    :isEnabled="false"
                    :disabled="true"
                    :iconOnly="true"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div style="margin-top: 20px; padding: 12px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
          <strong>ℹ️ Note:</strong> This component indicates whether a user is enabled as a FAS (Faculty of Arts and Sciences) user. Similar to IFXLoginIcon but for different permission level.
        </div>
      </div>
    `,
  }),
}

export const Comparison = {
  render: () => ({
    components: { IFXEnabledIcon },
    setup() {
      const enabled = ref(true)
      const disabled = ref(false)

      return { enabled, disabled }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Side-by-Side Comparison</h3>
        <div style="margin-top: 16px; display: flex; gap: 32px;">
          <div style="flex: 1; padding: 16px; border: 2px solid #4caf50; border-radius: 8px; background: #f1f8e9;">
            <h4 style="color: #2e7d32; margin-bottom: 12px;">✓ Enabled State</h4>
            <IFXEnabledIcon 
              :isEnabled="enabled"
              :disabled="true"
            />
          </div>
          
          <div style="flex: 1; padding: 16px; border: 2px solid #f44336; border-radius: 8px; background: #ffebee;">
            <h4 style="color: #c62828; margin-bottom: 12px;">✗ Disabled State</h4>
            <IFXEnabledIcon 
              :isEnabled="disabled"
              :disabled="true"
            />
          </div>
        </div>
      </div>
    `,
  }),
}