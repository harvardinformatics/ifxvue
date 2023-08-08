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

/* Generic ProductUsage that is primarily used
 * by the IFXCalculateBillingMonth component
 */
class ProductUsage extends IFXItemBase {
  get product() {
    return this.data.product
  }

  set product(product) {
    this.data.product = product
  }

  get productUser() {
    return this.data.product_user
  }

  set productUser(productUser) {
    this.data.product_user = productUser
  }

  get year() {
    return this.data.year
  }

  set year(year) {
    this.data.year = year
  }

  get month() {
    return this.data.month
  }

  set month(month) {
    this.data.month = month
  }

  get quantity() {
    return this.data.quantity
  }

  set quantity(quantity) {
    this.data.quantity = quantity
  }

  get decimalQuantity() {
    return this.data.decimal_quantity
  }

  set decimalQuantity(decimalQuantity) {
    this.data.decimal_quantity = decimalQuantity
  }

  get startDate() {
    return this.data.start_date
  }

  set startDate(startDate) {
    this.data.start_date = startDate
  }

  get description() {
    return this.data.description
  }

  set description(description) {
    this.data.description = description
  }

  get organization() {
    return this.data.organization
  }

  set organization(organization) {
    this.data.organization = organization
  }

  get processing() {
    return this.data.processing
  }

  get loggedBy() {
    return this.data.logged_by
  }

  get created() {
    return this.data.created
  }

  get updated() {
    return this.data.updated
  }
}

export { Product, ProductRate, ProductUsage, Processing }
