import IFXTooltip from './IFXTooltip.vue'

export default {
  title: 'Components/IFXTooltip',
  component: IFXTooltip,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
    size: {
      control: 'select',
      options: ['x-small', 'small', 'default', 'large', 'x-large'],
    },
    icon: {
      control: 'text',
    },
    tooltip: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    isHTML: {
      control: 'boolean',
    },
  },
}

export const Default = {
  render: (args) => ({
    components: { IFXTooltip },
    setup() {
      const handleAction = () => {
        alert('Tooltip button clicked!')
      }

      return {
        args,
        handleAction
      }
    },
    template: `
      <div style="padding: 40px;">
        <h3>Default Tooltip Button</h3>
        <p>Hover over the button to see the tooltip</p>
        <div style="margin-top: 20px;">
          <IFXTooltip 
            v-bind="args"
            @action="handleAction"
          />
        </div>
      </div>
    `,
  }),
  args: {
    icon: 'mdi-pencil',
    tooltip: 'Edit Item',
    color: 'primary',
    size: 'default',
    disabled: false,
    isHTML: false,
  },
}

export const DifferentIcons = {
  render: () => ({
    components: { IFXTooltip },
    setup() {
      const icons = [
        { icon: 'mdi-pencil', tooltip: 'Edit', color: 'primary' },
        { icon: 'mdi-delete', tooltip: 'Delete', color: 'error' },
        { icon: 'mdi-content-copy', tooltip: 'Copy', color: 'secondary' },
        { icon: 'mdi-check', tooltip: 'Confirm', color: 'success' },
        { icon: 'mdi-information', tooltip: 'Information', color: 'info' },
        { icon: 'mdi-alert', tooltip: 'Warning', color: 'warning' },
      ]

      const handleAction = (name) => {
        console.log(`${name} clicked`)
      }

      return { icons, handleAction }
    },
    template: `
      <div style="padding: 40px;">
        <h3>Different Icons & Colors</h3>
        <p>Various tooltip buttons with different icons and colors</p>
        <div style="margin-top: 20px; display: flex; gap: 16px; flex-wrap: wrap;">
          <IFXTooltip
            v-for="item in icons"
            :key="item.icon"
            :icon="item.icon"
            :tooltip="item.tooltip"
            :color="item.color"
            @action="handleAction(item.tooltip)"
          />
        </div>
      </div>
    `,
  }),
}

export const DifferentSizes = {
  render: () => ({
    components: { IFXTooltip },
    setup() {
      const sizes = [
        { size: 'x-small', label: 'X-Small' },
        { size: 'small', label: 'Small' },
        { size: 'default', label: 'Default' },
        { size: 'large', label: 'Large' },
        { size: 'x-large', label: 'X-Large' },
      ]

      return { sizes }
    },
    template: `
      <div style="padding: 40px;">
        <h3>Different Sizes (Vue 3 Pattern)</h3>
        <p>Tooltip buttons in various sizes using the new size prop</p>
        <div style="margin-top: 20px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div v-for="item in sizes" :key="item.size" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <IFXTooltip
              :icon="'mdi-star'"
              :tooltip="item.label"
              :size="item.size"
              color="primary"
            />
            <span style="font-size: 12px; color: #666;">{{ item.label }}</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const BackwardCompatible = {
  render: () => ({
    components: { IFXTooltip },
    setup() {
      return {}
    },
    template: `
      <div style="padding: 40px;">
        <h3>Backward Compatible (Vue 2 Pattern)</h3>
        <p>Using the old Vue 2 'fab' prop instead of 'size'</p>
        
        <div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <strong>💡 Vue 2 Pattern:</strong>
          <pre style="margin-top: 8px; background: white; padding: 8px; border-radius: 4px;"><code>&lt;IFXTooltip 
  icon="mdi-pencil"
  tooltip="Edit"
  :fab="true"
  color="primary"
/&gt;</code></pre>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 32px; align-items: flex-start;">
          <div style="flex: 1;">
            <h4 style="margin-bottom: 12px;">fab=true (Large)</h4>
            <IFXTooltip
              icon="mdi-pencil"
              tooltip="Edit (Vue 2 fab=true)"
              :fab="true"
              color="primary"
            />
          </div>
          
          <div style="flex: 1;">
            <h4 style="margin-bottom: 12px;">fab=false (Default)</h4>
            <IFXTooltip
              icon="mdi-pencil"
              tooltip="Edit (Vue 2 fab=false)"
              :fab="false"
              color="primary"
            />
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 12px; background: #e3f2fd; border-radius: 4px;">
          <strong>Key Points:</strong>
          <ul style="margin-top: 8px; margin-left: 20px;">
            <li><code>fab=true</code> maps to <code>size="large"</code></li>
            <li><code>fab=false</code> maps to <code>size="default"</code></li>
            <li>Old <code>iconColor</code> and <code>dark</code> props are ignored (Vuetify 3 handles this automatically)</li>
          </ul>
        </div>
      </div>
    `,
  }),
}

export const SideBySideComparison = {
  render: () => ({
    components: { IFXTooltip },
    setup() {
      return {}
    },
    template: `
      <div style="padding: 40px;">
        <h3>Side-by-Side Comparison</h3>
        <p>Both patterns produce the same result</p>
        
        <div style="display: flex; gap: 32px; margin-top: 20px;">
          <div style="flex: 1; padding: 16px; border: 2px solid #2196f3; border-radius: 8px; background: #e3f2fd;">
            <h4 style="color: #1565c0; margin-bottom: 12px;">Vue 3 Pattern (Recommended)</h4>
            <div style="margin-top: 16px;">
              <IFXTooltip
                icon="mdi-pencil"
                tooltip="Edit using size prop"
                size="large"
                color="primary"
              />
            </div>
            <div style="margin-top: 12px; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
              <code>size="large"</code>
            </div>
          </div>
          
          <div style="flex: 1; padding: 16px; border: 2px solid #ff9800; border-radius: 8px; background: #fff3e0;">
            <h4 style="color: #e65100; margin-bottom: 12px;">Vue 2 Pattern (Legacy)</h4>
            <div style="margin-top: 16px;">
              <IFXTooltip
                icon="mdi-pencil"
                tooltip="Edit using fab prop"
                :fab="true"
                color="primary"
              />
            </div>
            <div style="margin-top: 12px; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
              <code>:fab="true"</code>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <strong>✅ Both patterns are fully supported!</strong> Buttons look and behave identically.
        </div>
      </div>
    `,
  }),
}

export const HTMLTooltip = {
  render: (args) => ({
    components: { IFXTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 40px;">
        <h3>HTML Tooltip</h3>
        <p>Tooltips can contain HTML markup using the isHTML prop</p>
        <div style="margin-top: 20px;">
          <IFXTooltip 
            v-bind="args"
          />
        </div>
        <div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-radius: 4px;">
          <strong>⚠️ Warning:</strong> Only use HTML tooltips with trusted content to avoid XSS vulnerabilities
        </div>
      </div>
    `,
  }),
  args: {
    icon: 'mdi-information',
    tooltip: '<strong>Bold text</strong><br/><em>Italic text</em><br/>Line 3',
    color: 'info',
    size: 'default',
    isHTML: true,
  },
}

export const DisabledState = {
  render: (args) => ({
    components: { IFXTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 40px;">
        <h3>Disabled State</h3>
        <p>Disabled tooltip button cannot be clicked (tooltip still shows on hover)</p>
        <div style="margin-top: 20px;">
          <IFXTooltip 
            v-bind="args"
            @action="() => alert('This should not fire')"
          />
        </div>
      </div>
    `,
  }),
  args: {
    icon: 'mdi-pencil',
    tooltip: 'This action is disabled',
    color: 'primary',
    size: 'default',
    disabled: true,
  },
}

export const TooltipPositions = {
  render: () => ({
    components: { IFXTooltip },
    setup() {
      const positions = ['top', 'bottom', 'left', 'right']

      return { positions }
    },
    template: `
      <div style="padding: 80px; text-align: center;">
        <h3>Tooltip Positions</h3>
        <p>Tooltips can be positioned using Vuetify's location prop</p>
        
        <div style="margin-top: 40px; display: inline-flex; gap: 32px;">
          <IFXTooltip
            v-for="position in positions"
            :key="position"
            icon="mdi-cursor-default"
            :tooltip="'Tooltip on ' + position"
            color="primary"
            :location="position"
          />
        </div>
        
        <div style="margin-top: 40px; padding: 12px; background: #e3f2fd; border-radius: 4px; display: inline-block;">
          <strong>ℹ️ Note:</strong> Use the <code>location</code> prop to control tooltip placement
        </div>
      </div>
    `,
  }),
}