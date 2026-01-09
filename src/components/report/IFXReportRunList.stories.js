import IFXReportRunList from './IFXReportRunList.vue'

export default {
  title: 'Components/IFXReportRunList',
  component: IFXReportRunList,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXReportRunList },
  setup() {
    return { args }
  },
  template: '<IFXReportRunList v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {}

export const WithReports = Template.bind({})
WithReports.args = {}