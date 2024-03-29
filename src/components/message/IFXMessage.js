import IFXItemBase from '@/components/item/IFXItemBase'

export default class Message extends IFXItemBase {
  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get displayName() {
    return this.data.display_name
  }

  set displayName(displayName) {
    this.data.display_name = displayName
  }

  get subject() {
    return this.data.subject
  }

  set subject(subject) {
    this.data.subject = subject
  }

  get message() {
    return this.data.message
  }

  set message(message) {
    this.data.message = message
  }
}
