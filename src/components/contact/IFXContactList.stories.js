import IFXContactList from './IFXContactList.vue'

export default {
  title: 'Components/IFXContactList',
  component: IFXContactList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXContactList },
  setup() {
    return { args }
  },
  template: `<IFXContactList v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}