import IFXButton from '../IFXButton.vue'
import IFXNotFound from './IFXNotFound.vue'


export default {
  title: 'Components/IFXNotFound',
  component: IFXNotFound,
  tags: ['autodocs'],
}

const Template = () => ({
  components: { IFXNotFound, IFXButton },
  template: `
    <IFXNotFound />
  `,
})

export const Default = Template.bind({})