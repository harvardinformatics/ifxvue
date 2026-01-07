import IFXItemBase from '@/components/item/IFXItemBase'

export default class IFXLogChannel extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
  }

  get title() {
    return this.data.title
  }

  set title(title) {
    this.data.title = title
  }

  get organization() {
    return this.data.organization
  }

  set organization(organization) {
    this.data.organization = organization
  }
}
