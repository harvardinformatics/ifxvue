/* Separate definition from IFXContactAPI because it's defined by the OrganizationContact serializer */

// TODO: extend ItemBase
// import IFXItemBase from '@/components/item/IFXItemBase'
export class OrganizationContact {
  constructor(data) {
    this.data = data
    this.role = data.role || 'Additional Contact'
  }

  get contact() {
    return this.data.contact
  }

  set contact(contact) {
    this.data.contact = contact
  }

  get role() {
    return this.data.role
  }

  set role(role) {
    this.data.role = role
  }

  get id() {
    return this.data.id
  }

  set id(id) {
    this.data.id = id
  }

  get name() {
    return this.data.contact.name
  }

  set name(name) {
    this.data.contact.name = name
  }

  get type() {
    return this.data.contact.type
  }

  set type(type) {
    this.data.contact.type = type
  }

  get detail() {
    return this.data.contact.detail
  }

  set detail(detail) {
    this.data.contact.detail = detail
  }

  get phone() {
    return this.data.contact.phone
  }

  set phone(phone) {
    this.data.contact.phone = phone
  }

  get address() {
    return this.data.contact.address
  }

  set address(address) {
    this.data.contact.address = address
  }

  get isValid() {
    return this.data.contact.is_valid
  }

  set isValid(isValid) {
    this.data.contact.is_valid = isValid
  }
}

export class OrganizationUser {
  constructor(data) {
    this.data = data
    this.role = data.role || 'Member'
  }

  get id() {
    return this.data.id
  }

  get role() {
    return this.data.role
  }

  set role(role) {
    this.data.role = role
  }

  get active() {
    return this.data.active
  }

  set active(active) {
    this.data.active = active
  }

  get user() {
    return this.data.user
  }

  set user(user) {
    this.data.user = user
  }

  get userId() {
    return this.data.user.id
  }

  get ifxid() {
    return this.data.user.ifxid
  }

  get firstName() {
    return this.data.user.firstName
  }

  set firstName(firstName) {
    this.data.user.firstName = firstName
  }

  get lastName() {
    return this.data.user.lastName
  }

  set lastName(lastName) {
    this.data.user.lastName = lastName
  }

  get fullName() {
    return this.data.user.fullName
  }

  set fullName(fullName) {
    this.data.user.fullName = fullName
  }

  get email() {
    return this.data.user.email
  }

  set email(email) {
    this.data.user.email = email
  }
}

export class Organization {
  constructor(data) {
    this.data = data
    this.contacts = data.contacts || []
    this.users = data.users || []
  }

  get id() {
    return this.data.id
  }

  get ifxOrg() {
    return this.data.ifxorg
  }

  get slug() {
    return this.data.slug
  }

  get name() {
    return this.data.name
  }

  set name(name) {
    this.data.name = name
  }

  get rank() {
    return this.data.rank
  }

  set rank(rank) {
    this.data.rank = rank
  }

  get orgTree() {
    return this.data.org_tree
  }

  set orgTree(orgTree) {
    this.data.org_tree = orgTree
  }

  get parents() {
    return this.data.parents
  }

  set parents(parents) {
    this.data.parents = parents
  }

  get code() {
    return this.data.code
  }

  set code(code) {
    this.data.code = code
  }

  get applicationKey() {
    return this.data.applicationKey
  }

  set applicationKey(applicationKey) {
    this.data.application_key = applicationKey
  }

  get contacts() {
    return this.data.contacts
  }

  set contacts(contacts) {
    this.data.contacts = contacts
  }

  get users() {
    return this.data.users
  }

  set users(users) {
    this.data.users = users
  }

  // Does function caller know they can only add organization users? Or should this function take in a User/userData and convert?
  addUser(user) {
    this.data.users.push(user)
  }

  get color() {
    return '#27AE60'
  }

  get icon() {
    return 'account_balance'
  }

  get text() {
    return this.name
  }

  get recipients() {
    return [this.contacts, this.users].flat().map(contactable => contactable.email)
  }

  // get recipientEmails() {
  //   return this.recipients.map(contactable => contactable.email)
  // }

  get canEdit() {
    return !this.data.ifxOrg
  }
}
