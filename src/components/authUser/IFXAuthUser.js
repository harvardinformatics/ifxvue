export default class AuthUser {
  constructor(data) {
    this._data = data
  }

  get data() {
    return this._data
  }

  get id() {
    // Always return a string
    return `${this.data.id}`
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

  get isStaff() {
    return this.data.is_staff
  }

  set isStaff(isStaff) {
    this.data.is_staff = isStaff
  }

  get groups() {
    return this.data.groups
  }

  set groups(groups) {
    this.data.groups = groups
  }

  get token() {
    return this.data.token
  }

  set token(token) {
    this.data.token = token
  }

  get username() {
    return this.data.username
  }

  set username(username) {
    this.data.username = username
  }

  get isAuthenticated() {
    return !!this.token
  }

  get isAdmin() {
    return this.data.is_staff
  }
}
