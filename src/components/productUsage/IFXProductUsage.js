import IFXItemBase from '@/components/item/IFXItemBase'

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

  get endDate() {
    return this.data.end_date
  }

  set endDate(endDate) {
    this.data.end_date = endDate
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

  get units() {
    return this.data.units
  }

  set units(units) {
    this.data.units = units
  }

  get processing() {
    return this.data.processing
  }

  get loggedBy() {
    return this.data.logged_by
  }

  set loggedBy(val) {
    this.data.logged_by = val
  }

  get created() {
    return this.data.created
  }

  get updated() {
    return this.data.updated
  }
}

export default ProductUsage
