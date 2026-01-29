import IFXItemBase from '@/components/item/IFXItemBase'

export default class IFXLogChannel extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
  }

  get title() {
    let title = this.name
    if (this.organization) {
      title += ` for ${this.organization}`
    }
    return title
  }

  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get organization() {
    return this.data.organization
  }

  set organization(organization) {
    this.data.organization = organization
  }

  get isUserChannel() {
    return this.data.is_user_channel || false
  }

  set isUserChannel(isUserChannel) {
    this.data.is_user_channel = isUserChannel
  }

  get isMandatory() {
    return this.data.is_mandatory || false
  }

  set isMandatory(isMandatory) {
    this.data.is_mandatory = isMandatory
  }
}
