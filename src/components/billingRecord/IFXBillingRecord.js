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

  get rate() {
    return this.data.rate
  }

  set rate(rate) {
    this.data.rate = rate
  }

  get dollarValue() {
    return (this.data.charge / 100).toFixed(2)
  }

  set dollarValue(charge) {
    this.data.charge = Math.round(charge * 100)
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

  set productUsage(product_usage) {
    this.data.product_usage = product_usage
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

  set currentState(current_state) {
    this.data.current_state = current_state
  }

  get billingRecordStates() {
    return this.data.billing_record_states
  }

  set billingRecordStates(billing_record_states) {
    this.data.billing_record_states = billing_record_states
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

  addTransaction(transaction) {
    this.data.transactions.push(transaction)
  }
}
