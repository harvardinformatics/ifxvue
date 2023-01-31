import IFXItemBase from '@/components/item/IFXItemBase'

export class UserContact {
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

  get active() {
    return this.data.active
  }

  set active(active) {
    this.data.active = active
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

export class UserAccount extends IFXItemBase {
  get account() {
    return this.data.account
  }

  set account(account) {
    this.data.account = account
  }

  get isValid() {
    return this.data.is_valid
  }

  set isValid(isValid) {
    this.data.is_valid = isValid
  }

  get code() {
    return this.data.account.code
  }

  set code(val) {
    this.data.account.code = val
  }

  get name() {
    return this.data.account.name
  }

  set name(val) {
    this.data.account.name = val
  }

  get organization() {
    return this.data.account.organization
  }

  set organization(val) {
    this.data.account.organization = val
  }

  get accountType() {
    return this.data.account.account_type
  }

  set accountType(val) {
    this.data.account.account_type = val
  }

  get root() {
    return this.data.account.root
  }

  set root(val) {
    this.data.account.root = val
  }

  get active() {
    return this.data.account.active
  }

  set active(val) {
    this.data.account.active = val
  }

  get validFrom() {
    return this.data.account.valid_from
  }

  set validFrom(val) {
    this.data.account.valid_from = val
  }

  get expirationDate() {
    return this.data.account.expiration_date
  }

  set expirationDate(val) {
    this.data.account.expiration_date = val
  }

  get slug() {
    return this.data.account.slug
  }
}

// export class User extends Contactable {
export class User extends IFXItemBase {
  constructor(data) {
    super(data)
    // Setting primary email so that when updates are done, the correct Person field is updated
    this.data.primary_email = data.email
    // NOTE: values must be set here explicitly for nested forms to be reactive
    this.addresses = data.addresses || []
    this.contacts = data.contacts || []
  }

  get ifxid() {
    return this.data.ifxid
  }

  get username() {
    return this.data.username
  }

  get isAuthenticated() {
    return this.data.username && this.authToken
  }

  get dateJoined() {
    return this.data.date_joined
  }

  get lastUpdate() {
    return this.data.last_update
  }

  get firstName() {
    return this.data.first_name
  }

  set firstName(firstName) {
    this.data.first_name = firstName
  }

  get lastName() {
    return this.data.last_name
  }

  set lastName(lastName) {
    this.data.last_name = lastName
  }

  get fullName() {
    return this.data.full_name
  }

  set fullName(fullName) {
    this.data.full_name = fullName
  }

  get name() {
    return this.fullName
  }

  set name(name) {
    this.fullName = name
  }

  get email() {
    return this.data.primary_email
  }

  set email(email) {
    this.data.primary_email = email
  }

  get primaryEmail() {
    return this.data.primary_email
  }

  set primaryEmail(primaryEmail) {
    this.data.primary_email = primaryEmail
  }

  get primaryAffiliation() {
    return this.data.primary_affiliation
  }

  set primaryAffiliation(primaryAffiliation) {
    this.data.primary_affiliation = primaryAffiliation
  }

  get title() {
    return this.data.title
  }

  set title(title) {
    this.data.title = title
  }

  get groups() {
    return this.data.groups
  }

  set groups(groups) {
    this.data.groups = groups
  }

  get isActive() {
    return this.data.is_active
  }

  set isActive(isActive) {
    this.data.is_active = isActive
  }

  get isAdmin() {
    return this.data.is_staff
  }

  set isAdmin(isAdmin) {
    throw new Error('cannot do this yet')
  }

  get isDjangoStaff() {
    return this.data.is_staff
  }

  set isDjangoStaff(isDjangoStaff) {
    this.data.is_staff = isDjangoStaff
  }

  get changeComment() {
    return this.data.change_comment
  }

  set changeComment(changeComment) {
    this.data.change_comment = changeComment
  }

  get isEnabled() {
    return this.data.is_enabled
  }

  set isEnabled(isEnabled) {
    this.data.is_enabled = isEnabled
  }

  get addresses() {
    return this.data.addresses
  }

  set addresses(addresses) {
    this.data.addresses = addresses
  }

  get affiliations() {
    return this.data.affiliations
  }

  set affiliations(affiliations) {
    this.data.affiliations = affiliations
  }

  get accounts() {
    return this.data.accounts
  }

  set accounts(accounts) {
    this.data.accounts = accounts
  }

  get productAccounts() {
    return this.data.product_accounts
  }

  set productAccounts(productAccounts) {
    this.data.product_accounts = productAccounts
  }

  get logins() {
    return this.data.logins
  }

  set logins(logins) {
    this.data.logins = logins
  }

  get contacts() {
    return this.data.contacts
  }

  set contacts(contacts) {
    this.data.contacts = contacts
  }

  hasGroup(group) {
    return this.groups && this.groups.includes(group)
  }

  addToGroup(group) {
    if (!(group in this.groups)) {
      this.data.groups.push(group)
    }
  }

  disableLogin() {
    // UserList action
    this.isActive = false
  }

  enableLogin() {
    // UserList action
    this.isActive = true
  }

  disablePerson() {
    // UserList action
    this.isEnabled = false
  }

  enablePerson() {
    // UserList action
    this.isEnabled = true
  }

  get color() {
    return '#F39C12'
  }

  get icon() {
    return 'person'
  }

  get text() {
    return `${this.fullName} - ${this.email}`
  }

  get recipients() {
    return [this.email]
  }

  get recipientEmails() {
    return [this.email]
  }

  get slug() {
    return this.email
  }
}
