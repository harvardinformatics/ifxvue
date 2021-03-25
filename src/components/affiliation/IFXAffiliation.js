import IFXItemBase from '@/components/item/IFXItemBase'

export default class Affiliation extends IFXItemBase {
  get organization() {
    return this.data.organization
  }

  set organization(organization) {
    this.data.organization = organization
  }

  get role() {
    return this.data.role
  }

  set role(role) {
    this.data.role = role
  }
}
