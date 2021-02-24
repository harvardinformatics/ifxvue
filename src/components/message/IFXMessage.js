import IFXItemBase from '@/components/item/IFXItemBase'

export default class Message extends IFXItemBase {
  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get message() {
    return this.data.message
  }

  set message(message) {
    this.data.message = message
  }
}
