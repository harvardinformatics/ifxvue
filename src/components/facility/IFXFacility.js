import IFXItemBase from '@/components/item/IFXItemBase'

export default class Facility extends IFXItemBase {
  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get applicationUsername() {
    return this.data.application_username
  }

  set applicationUsername(applicationUsername) {
    this.data.application_username = applicationUsername
  }

  get creditCode() {
    return this.data.credit_code
  }

  set creditCode(creditCode) {
    this.data.credit_code = creditCode
  }

  get invoicePrefix() {
    return this.data.invoice_prefix
  }

  set invoicePrefix(invoicePrefix) {
    this.data.invoice_prefix = invoicePrefix
  }
}
