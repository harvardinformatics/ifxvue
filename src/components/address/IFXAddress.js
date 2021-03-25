import IFXItemBase from '@/components/item/IFXItemBase'

export default class Address extends IFXItemBase {
  get type() {
    return this.data.type
  }

  set type(type) {
    this.data.type = type
  }

  get street1() {
    return this.data.street1
  }

  set street1(street1) {
    this.data.street1 = street1
  }

  get street2() {
    return this.data.street2
  }

  set street2(street2) {
    this.data.street2 = street2
  }

  get city() {
    return this.data.city
  }

  set city(city) {
    this.data.city = city
  }

  get state() {
    return this.data.state
  }

  set state(state) {
    this.data.state = state
  }

  get country() {
    return this.data.country
  }

  set country(country) {
    this.data.country = country
  }

  get postalCode() {
    return this.data.postal_code
  }

  set postalCode(postalCode) {
    this.data.postal_code = postalCode
  }
}
