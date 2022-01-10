import IFXItemBase from '@/components/item/IFXItemBase'

export default class Account extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
    if (!data) {
      this.data.active = false
    }
  }

  get code() {
    return this.data.code
  }

  set code(val) {
    this.data.code = val
  }

  get name() {
    return this.data.name
  }

  set name(val) {
    this.data.name = val
  }

  get organization() {
    return this.data.organization
  }

  set organization(val) {
    this.data.organization = val
  }

  get accountType() {
    return this.data.account_type
  }

  set accountType(val) {
    this.data.account_type = val
  }

  get root() {
    return this.data.root
  }

  set root(val) {
    this.data.root = val
  }

  get active() {
    return this.data.active
  }

  set active(val) {
    this.data.active = val
  }

  get validFrom() {
    return this.data.valid_from
  }

  set validFrom(val) {
    this.data.valid_from = val
  }

  get expirationDate() {
    return this.data.expiration_date
  }

  set expirationDate(val) {
    this.data.expiration_date = val
  }

  get slug() {
    return this.data.slug
  }

  get created() {
    return this.data.created
  }

  get updated() {
    return this.data.updated
  }
}
