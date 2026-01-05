import IFXFullContactCreateEdit from './IFXFullContactCreateEdit.vue'

export default {
  title: 'Components/IFXFullContactCreateEdit',
  component: IFXFullContactCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXFullContactCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXFullContactCreateEdit v-bind="args" />`,
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