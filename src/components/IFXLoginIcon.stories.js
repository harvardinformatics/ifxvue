import { ref } from 'vue'
import IFXLoginIcon from './IFXLoginIcon.vue'

export default {
  title: 'Components/IFXLoginIcon',
  component: IFXLoginIcon,
  tags: ['autodocs'],
  argTypes: {
    isActive: {
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

export const ActiveLogin = {
  render: (args) => ({
    components: { IFXLoginIcon },
    setup() {
      const isActive = ref(true)

      const handleUpdate = (value) => {
        console.log('Login status changed:', value)
        isActive.value = value
      }

      return {
        args,
        isActive,
        handleUpdate
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Active Login (Editable)</h3>
        <p>User has login enabled and can toggle it</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXLoginIcon 
            :isActive="isActive"
            v-bind="args"
            @update:isActive="handleUpdate"
          />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Status:</strong> {{ isActive ? 'Active' : 'Inactive' }}
        </div>
      </div>
      <div style="margin-top: 20px; padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>⚠️ Note:</strong> Set the value of <code>$api.user.canEditField</code> on .storybook/preview.js mockAPI.user to true/false to properly render the icons.
      </div>
    `,
  }),
  args: {
    isActive: true,
    iconOnly: false,
    disabled: false,
  },
}

export const InactiveLogin = {
  render: (args) => ({
    components: { IFXLoginIcon },
    setup() {
      const isActive = ref(false)

      const handleUpdate = (value) => {
        console.log('Login status changed:', value)
        isActive.value = value
      }

      return {
        args,
        isActive,
        handleUpdate
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Inactive Login (Editable)</h3>
        <p>User login is disabled but can be toggled on</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXLoginIcon 
            :isActive="isActive"
            v-bind="args"
            @update:isActive="handleUpdate"
          />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current Status:</strong> {{ isActive ? 'Active' : 'Inactive' }}
        </div>
      </div>
    `,
  }),
  args: {
    isActive: false,
    iconOnly: false,
    disabled: false,
  },
}

export const IconOnly = {
  render: (args) => ({
    components: { IFXLoginIcon },
    setup() {
      const isActiveTrue = ref(true)
      const isActiveFalse = ref(false)

      return {
        args,
        isActiveTrue,
        isActiveFalse
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Icon Only Mode</h3>
        <p>Compact display for data tables and small spaces</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px; display: flex; gap: 32px; align-items: center;">
          <div>
            <strong>Active:</strong>
            <IFXLoginIcon 
              :isActive="isActiveTrue"
              :iconOnly="true"
              :disabled="true"
            />
          </div>
          <div>
            <strong>Inactive:</strong>
            <IFXLoginIcon 
              :isActive="isActiveFalse"
              :iconOnly="true"
              :disabled="true"
            />
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    isActive: true,
    iconOnly: true,
    disabled: true,
  },
}

export const DisabledView = {
  render: (args) => ({
    components: { IFXLoginIcon },
    setup() {
      const isActiveTrue = ref(true)
      const isActiveFalse = ref(false)

      return {
        args,
        isActiveTrue,
        isActiveFalse
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Disabled (View Only)</h3>
        <p>User cannot edit the login status - display only mode</p>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <div style="margin-bottom: 16px;">
            <strong>Active User (Read-only):</strong>
            <IFXLoginIcon 
              :isActive="isActiveTrue"
              :disabled="true"
              v-bind="args"
            />
          </div>
          <div>
            <strong>Inactive User (Read-only):</strong>
            <IFXLoginIcon 
              :isActive="isActiveFalse"
              :disabled="true"
              v-bind="args"
            />
          </div>
        </div>
      </div>
    `,
  }),
  args: {
    isActive: true,
    iconOnly: false,
    disabled: true,
  },
}

export const AllStates = {
  render: () => ({
    components: { IFXLoginIcon },
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
                <td><strong>Active (Editable)</strong></td>
                <td>
                  <IFXLoginIcon 
                    :isActive="true"
                    :disabled="false"
                  />
                </td>
                <td>
                  <IFXLoginIcon 
                    :isActive="true"
                    :disabled="false"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Inactive (Editable)</strong></td>
                <td>
                  <IFXLoginIcon 
                    :isActive="false"
                    :disabled="false"
                  />
                </td>
                <td>
                  <IFXLoginIcon 
                    :isActive="false"
                    :disabled="false"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Active (Disabled)</strong></td>
                <td>
                  <IFXLoginIcon 
                    :isActive="true"
                    :disabled="true"
                  />
                </td>
                <td>
                  <IFXLoginIcon 
                    :isActive="true"
                    :disabled="true"
                    :iconOnly="true"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Inactive (Disabled)</strong></td>
                <td>
                  <IFXLoginIcon 
                    :isActive="false"
                    :disabled="true"
                  />
                </td>
                <td>
                  <IFXLoginIcon 
                    :isActive="false"
                    :disabled="true"
                    :iconOnly="true"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}