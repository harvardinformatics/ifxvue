import IFXBillingRecordDetail from './IFXBillingRecordDetail.vue'

export default {
  title: 'Components/IFXBillingRecordDetail',
  component: IFXBillingRecordDetail,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXBillingRecordDetail },
  setup() {
    return { args }
  },
  template: `<IFXBillingRecordDetail v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  id: '1',
  facilityId: '1',
  showEditButtons: false,
}

export const WithEditButtons = Template.bind({})
WithEditButtons.args = {
  id: '1',
  facilityId: '1',
  showEditButtons: true,
}