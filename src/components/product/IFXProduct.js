import IFXItemBase from '@/components/item/IFXItemBase'

export class ProductRate extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
    if (!data) {
      this.data.active = false
    }
  }

  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get price() {
    return this.data.price
  }

  set price(price) {
    this.data.price = price
  }

  get dollarValue() {
    return (this.data.price / 100).toFixed(2)
  }

  set dollarValue(price) {
    this.data.price = Math.round(price * 100)
  }

  get id() {
    return this.data.id
  }

  set id(id) {
    this.data.id = id
  }

  get units() {
    return this.data.units
  }

  set units(units) {
    this.data.units = units
  }

  get maxQty() {
    return this.data.max_qty
  }

  set maxQty(maxQty) {
    this.data.max_qty = maxQty
  }

  get active() {
    return this.data.is_active
  }

  set active(active) {
    this.data.is_active = active
  }
}

export class Product extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    this.data = data
    this.rates = data.rates || []
    this.data.billing_calculator = data.billing_calculator || 'ifxbilling.calculator.BasicBillingCalculator'
  }

  get id() {
    return this.data.id
  }

  get productNumber() {
    return this.data.product_number
  }

  get name() {
    return this.data.product_name
  }

  set name(name) {
    this.data.product_name = name
  }

  get description() {
    return this.data.product_description
  }

  set description(description) {
    this.data.product_description = description
  }

  get billingCalculator() {
    return this.data.billing_calculator
  }

  set billingCalculator(billingCalculator) {
    this.data.billing_calculator = billingCalculator
  }

  get facility() {
    return this.data.facility
  }

  set facility(facility) {
    this.data.facility = facility
  }

  get reportingGroup() {
    return this.data.reporting_group
  }

  set reportingGroup(reportingGroup) {
    this.data.reporting_group = reportingGroup
  }

  get rates() {
    return this.data.rates
  }

  set rates(rates) {
    this.data.rates = rates
  }

  addRate(rate) {
    this.data.rates.push(rate)
  }

  removeRate(index) {
    this.data.rates.splice(index, 1)
  }

  get text() {
    return this.name
  }
}
