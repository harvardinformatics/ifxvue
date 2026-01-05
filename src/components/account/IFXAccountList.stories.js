import IFXAccountList from './IFXAccountList.vue'

export default {
  title: 'Components/IFXAccountList',
  component: IFXAccountList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXAccountList },
  setup() {
    return { args }
  },
  template: `<IFXAccountList v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}