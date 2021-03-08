import IFXItemBase from '@/components/item/IFXItemBase'

// export class User extends Contactable {
export default class User extends IFXItemBase {
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
    return group in this.groups
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
    return `${this.data.fullName} - ${this.email}`
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
