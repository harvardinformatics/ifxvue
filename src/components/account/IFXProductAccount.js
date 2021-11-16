import IFXItemBase from '@/components/item/IFXItemBase'

export default class ProductAccount extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
    if (!data) {
      this.data.is_valid = false
    }
  }

  get account() {
    return this.data.account
  }

  set account(account) {
    this.data.account = account
  }

  get isValid() {
    return this.data.is_valid
  }

  set isValid(isValid) {
    this.data.is_valid = isValid
  }

  get percent() {
    return this.data.percent
  }

  set percent(percent) {
    this.data.percent = percent
  }

  get product() {
    return this.data.product
  }

  set product(product) {
    this.data.product = product
  }
}
