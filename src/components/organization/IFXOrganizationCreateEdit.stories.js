import IFXOrganizationCreateEdit from './IFXOrganizationCreateEdit.vue'

export default {
  title: 'Components/IFXOrganizationCreateEdit',
  component: IFXOrganizationCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXOrganizationCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXOrganizationCreateEdit v-bind="args" />`,
})

export const Create = Template.bind({})
Create.args = {
  isEditing: false,
}

export const Edit = Template.bind({})
Edit.args = {
  isEditing: true,
  id: '1',
}