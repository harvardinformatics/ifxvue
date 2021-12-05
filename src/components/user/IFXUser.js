import IFXItemBase from '@/components/item/IFXItemBase'

export class UserContact {
  constructor(data) {
    this.data.account = data
    this.role = data.role || 'Additional Contact'
  }

  get contact() {
    return this.data.account.contact
  }

  set contact(contact) {
    this.data.account.contact = contact
  }

  get role() {
    return this.data.account.role
  }

  set role(role) {
    this.data.account.role = role
  }

  get id() {
    return this.data.account.id
  }

  set id(id) {
    this.data.account.id = id
  }

  get name() {
    return this.data.account.contact.name
  }

  set name(name) {
    this.data.account.contact.name = name
  }

  get type() {
    return this.data.account.contact.type
  }

  set type(type) {
    this.data.account.contact.type = type
  }

  get detail() {
    return this.data.account.contact.detail
  }

  set detail(detail) {
    this.data.account.contact.detail = detail
  }

  get phone() {
    return this.data.account.contact.phone
  }

  set phone(phone) {
    this.data.account.contact.phone = phone
  }

  get address() {
    return this.data.account.contact.address
  }

  set address(address) {
    this.data.account.contact.address = address
  }

  get isValid() {
    return this.data.account.contact.is_valid
  }

  set isValid(isValid) {
    this.data.account.contact.is_valid = isValid
  }
}

export class UserAccount {
  get account() {
    return this.data.account.account
  }

  set account(account) {
    this.data.account.account = account
  }

  get isValid() {
    return this.data.account.is_valid
  }

  set isValid(isValid) {
    this.data.account.is_valid = isValid
  }

  get code() {
    return this.data.account.account.code
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
    this.data.account.primary_email = data.email
    // NOTE: values must be set here explicitly for nested forms to be reactive
    this.addresses = data.addresses || []
    this.contacts = data.contacts || []
  }

  get ifxid() {
    return this.data.account.ifxid
  }

  get username() {
    return this.data.account.username
  }

  get isAuthenticated() {
    return this.data.account.username && this.authToken
  }

  get dateJoined() {
    return this.data.account.date_joined
  }

  get lastUpdate() {
    return this.data.account.last_update
  }

  get firstName() {
    return this.data.account.first_name
  }

  set firstName(firstName) {
    this.data.account.first_name = firstName
  }

  get lastName() {
    return this.data.account.last_name
  }

  set lastName(lastName) {
    this.data.account.last_name = lastName
  }

  get fullName() {
    return this.data.account.full_name
  }

  set fullName(fullName) {
    this.data.account.full_name = fullName
  }

  get name() {
    return this.fullName
  }

  set name(name) {
    this.fullName = name
  }

  get email() {
    return this.data.account.primary_email
  }

  set email(email) {
    this.data.account.primary_email = email
  }

  get primaryEmail() {
    return this.data.account.primary_email
  }

  set primaryEmail(primaryEmail) {
    this.data.account.primary_email = primaryEmail
  }

  get primaryAffiliation() {
    return this.data.account.primary_affiliation
  }

  set primaryAffiliation(primaryAffiliation) {
    this.data.account.primary_affiliation = primaryAffiliation
  }

  get title() {
    return this.data.account.title
  }

  set title(title) {
    this.data.account.title = title
  }

  get groups() {
    return this.data.account.groups
  }

  set groups(groups) {
    this.data.account.groups = groups
  }

  get isActive() {
    return this.data.account.is_active
  }

  set isActive(isActive) {
    this.data.account.is_active = isActive
  }

  get isAdmin() {
    return this.data.account.is_staff
  }

  set isAdmin(isAdmin) {
    throw new Error('cannot do this yet')
  }

  get isDjangoStaff() {
    return this.data.account.is_staff
  }

  set isDjangoStaff(isDjangoStaff) {
    this.data.account.is_staff = isDjangoStaff
  }

  get changeComment() {
    return this.data.account.change_comment
  }

  set changeComment(changeComment) {
    this.data.account.change_comment = changeComment
  }

  get isEnabled() {
    return this.data.account.is_enabled
  }

  set isEnabled(isEnabled) {
    this.data.account.is_enabled = isEnabled
  }

  get addresses() {
    return this.data.account.addresses
  }

  set addresses(addresses) {
    this.data.account.addresses = addresses
  }

  get affiliations() {
    return this.data.account.affiliations
  }

  set affiliations(affiliations) {
    this.data.account.affiliations = affiliations
  }

  get accounts() {
    return this.data.account.accounts
  }

  set accounts(accounts) {
    this.data.account.accounts = accounts
  }

  get productAccounts() {
    return this.data.account.product_accounts
  }

  set productAccounts(productAccounts) {
    this.data.account.product_accounts = productAccounts
  }

  get logins() {
    return this.data.account.logins
  }

  set logins(logins) {
    this.data.account.logins = logins
  }

  get contacts() {
    return this.data.account.contacts
  }

  set contacts(contacts) {
    this.data.account.contacts = contacts
  }

  hasGroup(group) {
    return group in this.groups
  }

  addToGroup(group) {
    if (!(group in this.groups)) {
      this.data.account.groups.push(group)
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
