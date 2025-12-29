import IFXPhoneContactCreateEdit from './IFXPhoneContactCreateEdit.vue'

export default {
  title: 'Components/IFXPhoneContactCreateEdit',
  component: IFXPhoneContactCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXPhoneContactCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXPhoneContactCreateEdit v-bind="args" />`,
})

export const Create = Template.bind({})
Create.args = {
  isEditing: false,
}

export const Edit = Template.bind({})
Edit.args = {
  isEditing: true,
  id: '2',
}