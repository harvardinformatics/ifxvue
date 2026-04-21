import IFXItemBase from '@/components/item/IFXItemBase'
import isEmpty from 'lodash/isEmpty'

class Processing extends IFXItemBase {
  constructor(data = {}) {
    super(data)
  }

  get resolved() {
    return this.data.resolved
  }

  get errorMessage() {
    return this.data.error_message
  }

  get created() {
    return this.data.created
  }

  get updated() {
    return this.data.updated
  }
}

class ProductRate extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
    if (isEmpty(data)) {
      this.data.is_active = true
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

  get decimalPrice() {
    return this.data.decimal_price
  }

  set decimalPrice(decimal_price) {
    this.data.decimal_price = decimal_price
    this.data.price = Math.round(decimal_price * 100)
  }

  get dollarValue() {
    return (this.data.price / 100).toFixed(2)
  }

  set dollarValue(price) {
    this.data.price = Math.round(price * 100)
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

  get description() {
    return this.data.description
  }

  set description(description) {
    this.data.description = description
  }
}

class Product extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    this.data = data
    this.rates = data.rates || []
    this.data.billing_calculator = data.billing_calculator || 'ifxbilling.calculator.BasicBillingCalculator'
    if (!this.data.billable) {
      this.data.billable = false
    }
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

  get productName() {
    return this.data.product_name
  }

  set productName(productName) {
    this.data.product_name = productName
  }

  get billable() {
    return this.data.billable
  }

  set billable(billable) {
    this.data.billable = billable
  }

  get description() {
    return this.data.product_description
  }

  set description(description) {
    this.data.product_description = description
  }

  get productDescription() {
    return this.data.product_description
  }

  set productDescription(productDescription) {
    this.data.product_description = productDescription
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

  get productCategory() {
    return this.data.product_category
  }

  set productCategory(productCategory) {
    this.data.product_category = productCategory
  }

  get rates() {
    return this.data.rates
  }

  set rates(rates) {
    this.data.rates = rates
  }

  get parent() {
    return this.data.parent
  }

  set parent(parent) {
    this.data.parent = parent
  }

  get objectCodeCategory() {
    return this.data.object_code_category
  }

  set objectCodeCategory(objectCodeCategory) {
    this.data.object_code_category = objectCodeCategory
  }

  get productOrganization() {
    return this.data.product_organization
  }

  set productOrganization(productOrganization) {
    this.data.product_organization = productOrganization
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

  get isActive() {
    return this.data.is_active
  }

  set isActive(is_active) {
    this.data.is_active = is_active
  }
}

export { Product, ProductRate, Processing }
