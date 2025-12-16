import IFXMailButton from './IFXMailButton.vue'
import { ref } from 'vue'

export default {
  title: 'Components/IFXMailButton',
  component: IFXMailButton,
  tags: ['autodocs'],
}

export const Default = (args) => ({
  components: { IFXMailButton },
  setup() {
    const selectedField = ref('')
    return { args, selectedField }
  },
  template: `
    <div>
      <IFXMailButton 
        v-model="selectedField"
        v-bind="args"
      />
      <div style="margin-top: 20px;">
        Selected field: <strong>{{ selectedField || 'none' }}</strong>
      </div>
    </div>
  `,
})
Default.args = {}

export const Disabled = (args) => ({
  components: { IFXMailButton },
  setup() {
    const selectedField = ref('')
    return { args, selectedField }
  },
  template: `
    <div>
      <IFXMailButton 
        v-model="selectedField"
        v-bind="args"
      />
    </div>
  `,
})
Disabled.args = {
  disabled: true,
}

export const CustomColors = (args) => ({
  components: { IFXMailButton },
  setup() {
    const selectedField = ref('')
    return { args, selectedField }
  },
  template: `
    <div>
      <IFXMailButton 
        v-model="selectedField"
        v-bind="args"
      />
      <div style="margin-top: 20px;">
        Selected field: <strong>{{ selectedField || 'none' }}</strong>
      </div>
    </div>
  `,
})
CustomColors.args = {
  color: 'blue',
  icon: 'mdi-email',
  toolTip: 'Send email to recipients',
}