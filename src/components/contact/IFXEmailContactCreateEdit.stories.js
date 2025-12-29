import IFXEmailContactCreateEdit from './IFXEmailContactCreateEdit.vue'

export default {
  title: 'Components/IFXEmailContactCreateEdit',
  component: IFXEmailContactCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXEmailContactCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXEmailContactCreateEdit v-bind="args" />`,
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