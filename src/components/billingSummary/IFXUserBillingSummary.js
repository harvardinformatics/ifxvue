import IFXItemBase from '@/components/item/IFXItemBase'

export default class UserBillingSummary extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    this.data = data
  }

  get productUserFullName() {
    return this.data.product_user_full_name
  }

  set productUserFullName(productUserFullName) {
    this.data.product_user_full_name = productUserFullName
  }

  get totalDecimalCharge() {
    return this.data.total_decimal_charge
  }

  set totalDecimalCharge(totalDecimalCharge) {
    this.data.total_decimal_charge = totalDecimalCharge
  }
}
