import IFXItemBase from '@/components/item/IFXItemBase'

export default class ProductBillingSummary extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    this.data = data
  }

  get productName() {
    return this.data.product_name
  }

  set productName(productName) {
    this.data.product_name = productName
  }

  get totalDecimalQuantity() {
    return this.data.total_decimal_quantity
  }

  set totalDecimalQuantity(totalDecimalQuantity) {
    this.data.total_decimal_quantity = totalDecimalQuantity
  }

  get totalDecimalCharge() {
    return this.data.total_decimal_charge
  }

  set totalDecimalCharge(totalDecimalCharge) {
    this.data.total_decimal_charge = totalDecimalCharge
  }
}
