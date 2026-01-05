import IFXAffiliationRoleDisplayEdit from './IFXAffiliationRoleDisplayEdit.vue'
import { ref } from 'vue'

export default {
  title: 'Components/IFXAffiliationRoleDisplayEdit',
  component: IFXAffiliationRoleDisplayEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXAffiliationRoleDisplayEdit },
  setup() {
    const affiliation = ref({ ...args.affiliation })
    return { args, affiliation }
  },
  template: `
    <div>
      <IFXAffiliationRoleDisplayEdit 
        :affiliation="affiliation"
        @update="affiliation = $event"
      />
      <div style="margin-top: 20px; padding: 10px; background: #f5f5f5;">
        <strong>Current Affiliation:</strong><br>
        <pre>{{ JSON.stringify(affiliation, null, 2) }}</pre>
      </div>
    </div>
  `,
})

export const Active = Template.bind({})
Active.args = {
  affiliation: {
    id: 1,
    role: 'admin',
    organization: 'harvard',
    active: true,
  }
}

export const Inactive = Template.bind({})
Inactive.args = {
  affiliation: {
    id: 2,
    role: 'member',
    organization: 'mit',
    active: false,
  }
}