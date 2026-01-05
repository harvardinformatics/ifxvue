import IFXMessageList from './IFXMessageList.vue'

export default {
  title: 'Components/IFXMessageList',
  component: IFXMessageList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXMessageList },
  setup() {
    return { args }
  },
  template: `<IFXMessageList v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}