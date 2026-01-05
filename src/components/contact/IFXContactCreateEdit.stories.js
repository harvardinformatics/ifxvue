import IFXContactCreateEdit from './IFXContactCreateEdit.vue'

export default {
  title: 'Components/IFXContactCreateEdit',
  component: IFXContactCreateEdit,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXContactCreateEdit },
  setup() {
    return { args }
  },
  template: `<IFXContactCreateEdit v-bind="args" />`,
})

export const CreateEmail = Template.bind({})
CreateEmail.args = {
  contactType: 'Email',
}

export const CreatePhone = Template.bind({})
CreatePhone.args = {
  contactType: 'Phone',
}

export const CreateFull = Template.bind({})
CreateFull.args = {
  contactType: 'Full',
}

export const EditExisting = Template.bind({})
EditExisting.args = {
  id: '2',
}