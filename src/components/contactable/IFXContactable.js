import IFXItemBase from '@/components/item/IFXItemBase'

export default class Contactable extends IFXItemBase {
  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get type() {
    return this.data.type
  }

  set type(type) {
    this.data.type = type
  }
}
