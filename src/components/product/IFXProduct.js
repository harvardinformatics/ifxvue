// TODO: extend ItemBase
// import IFXItemBase from '@/components/item/IFXItemBase'
export class ProductRate {
  constructor(data) {
    this.data = data
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

  get isActive() {
    return this.data.is_active
  }

  set isActive(isActive) {
    this.data.is_active = isActive
  }
}

export class Product {
  constructor(data) {
    this.data = data
    this.rates = data.rates || []
  }

  get id() {
    return this.data.id
  }

  get productNumber() {
    return this.data.product_number
  }

  // set productNumber(productNumber) {
  //   return this.data.product_number = productNumber
  // }

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
