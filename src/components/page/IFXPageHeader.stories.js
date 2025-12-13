import IFXPageHeader from './IFXPageHeader.vue'

export default {
  title: 'Components/IFXPageHeader',
  component: IFXPageHeader,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXPageHeader },
  setup() {
    return { args }
  },
  beforeCreate() {
    this.$route = {
      ...this.$route,
      query: args.hasNext ? { next: 'previous-page' } : {},
    }
  },
  template: `
    <IFXPageHeader>
      <template #title>
        {{ args.title }}
      </template>
    </IFXPageHeader>
  `,
})

export const Default = Template.bind({})
Default.args = {
  title: 'Dashboard',
  hasNext: false,
}

export const WithBackButton = Template.bind({})
WithBackButton.args = {
  title: 'User Profile',
  hasNext: true,
}