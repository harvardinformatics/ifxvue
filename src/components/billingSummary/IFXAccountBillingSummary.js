import IFXItemBase from '@/components/item/IFXItemBase'

export default class AccountBillingSummary extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    this.data = data
  }

  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get code() {
    return this.data.code
  }

  set code(code) {
    this.data.code = code
  }

  get organization() {
    return this.data.organization
  }

  set organization(organization) {
    this.data.organization = organization
  }

  get accountType() {
    return this.data.account_type
  }

  set accountType(accountType) {
    this.data.account_type = accountType
  }

  get totalDecimalCharge() {
    return this.data.total_decimal_charge
  }

  set totalDecimalCharge(totalDecimalCharge) {
    this.data.total_decimal_charge = totalDecimalCharge
  }

  get month() {
    return this.data.month
  }

  set month(month) {
    this.data.month = month
  }

  get year() {
    return this.data.year
  }

  set year(year) {
    this.data.year = year
  }
}
