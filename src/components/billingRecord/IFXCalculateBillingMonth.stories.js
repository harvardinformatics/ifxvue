import IFXCalculateBillingMonth from './IFXCalculateBillingMonth.vue'

export default {
  title: 'Components/IFXCalculateBillingMonth',
  component: IFXCalculateBillingMonth,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXCalculateBillingMonth },
  setup() {
    return { args }
  },
  template: `<IFXCalculateBillingMonth v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}

export const WithPreselected = Template.bind({})
WithPreselected.args = {
  facilityId: '1',
  year: '2024',
  month: '12',
}