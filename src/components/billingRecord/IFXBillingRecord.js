import IFXItemBase from '@/components/item/IFXItemBase'

export class BillingTransaction extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
  }

  get charge() {
    return this.data.charge
  }

  set charge(charge) {
    this.data.charge = charge
  }

  get decimalCharge() {
    return this.data.decimal_charge
  }

  set decimalCharge(decimalCharge) {
    this.data.decimal_charge = decimalCharge
  }

  get rate() {
    return this.data.rate
  }

  set rate(rate) {
    this.data.rate = rate
  }

  get description() {
    return this.data.description
  }

  set description(description) {
    this.data.description = description
  }

  get author() {
    return this.data.author
  }

  set author(author) {
    this.data.author = author
  }

  get created() {
    return this.data.created
  }

  set created(created) {
    this.data.created = created
  }
}

export default class BillingRecord extends IFXItemBase {
  constructor(data = {}) {
    super(data)
  }

  get account() {
    return this.data.account
  }

  set account(account) {
    this.data.account = account
  }

  get productUsage() {
    return this.data.product_usage
  }

  set productUsage(productUsage) {
    this.data.product_usage = productUsage
  }

  get productUsageLinkText() {
    return this.data.product_usage_link_text
  }

  set productUsageLinkText(productUsageLinkText) {
    this.data.product_usage_link_text = productUsageLinkText
  }

  get productUsageUrl() {
    return this.data.product_usage_url
  }

  set productUsageUrl(productUsageUrl) {
    this.data.product_usage_url = productUsageUrl
  }

  get productUser() {
    return this.data.product_usage.product_user
  }

  get product() {
    return this.data.product_usage.product
  }

  get charge() {
    return this.data.charge
  }

  set charge(charge) {
    this.data.charge = charge
  }

  get decimalCharge() {
    return this.data.decimal_charge
  }

  set decimalCharge(decimalCharge) {
    this.data.decimal_charge = decimalCharge
  }

  get description() {
    return this.data.description
  }

  set description(description) {
    this.data.description = description
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

  get currentState() {
    return this.data.current_state
  }

  set currentState(currentState) {
    this.data.current_state = currentState
  }

  get billingRecordStates() {
    return this.data.billing_record_states
  }

  set billingRecordStates(billingRecordStates) {
    this.data.billing_record_states = billingRecordStates
  }

  get transactions() {
    return this.data.transactions
  }

  set transactions(transactions) {
    this.data.transactions = Array.from(transactions)
  }

  get percent() {
    return this.data.percent
  }

  set precent(precent) {
    this.data.precent = precent
  }

  get rate() {
    return this.data.rate
  }

  set rate(rate) {
    this.data.rate = rate
  }

  get created() {
    return this.data.created
  }

  get updated() {
    return this.data.updated
  }

  get startDate() {
    return this.data.start_date
  }

  get endDate() {
    return this.data.end_date
  }

  addTransaction(transaction) {
    this.data.transactions.push(transaction)
  }
}
