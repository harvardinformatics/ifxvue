import IFXItemBase from '@/components/item/IFXItemBase'

export default class Contact extends IFXItemBase {
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

  get detail() {
    return this.data.detail
  }

  set detail(detail) {
    this.data.detail = detail
  }

  get phone() {
    return this.data.phone
  }

  set phone(phone) {
    this.data.phone = phone
  }

  get address() {
    return this.data.address
  }

  set address(address) {
    this.data.address = address
  }

  get isValid() {
    return this.data.is_valid
  }

  set isValid(isValid) {
    this.data.is_valid = isValid
  }

  get org() {
    return this.data.org
  }

  get ifxcon() {
    return this.data.ifxcon
  }

  get userId() {
    return this.data.user_id
  }

  get color() {
    return 'red'
  }

  get text() {
    return `${this.name} - ${this.detail}`
  }

  get slug() {
    return this.detail
  }

  get icon() {
    return 'contact_mail'
  }

  get recipients() {
    return [this.detail]
  }
  // -----------------

  get email() {
    return this.detail
  }

  set email(email) {
    this.data.detail = email
  }
}
