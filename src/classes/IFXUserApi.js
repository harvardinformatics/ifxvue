import {IFXStoreAPIService} from './IFXStoreApi'

/**
 * Base User class for use on the frontend of IFX applications
 * @param  {object} urls all of the static urls used by the installing ifx application
 */
export class IFXUserAPIService extends IFXStoreAPIService {
  constructor(store) {
    super(store)
  }

  get userObj() {
    return this.getters.userObj
  }
  get firstName() {
    return this.userObj.firstName
  }
  get lastName() {
    return this.userObj.lastName
  }
  get username() {
    return this.userObj.username
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
  get groups() {
    return this.userObj.groups
  }
  get isActive() {
    return this.userObj.isActive
  }
  get isStaff() {
    return this.userObj.isStaff
  }
  get isAdmin() {
    return this.isStaff
  }
  get isDjangoStaff() {
    return this.isStaff
  }
  hasGroup (group) {
    return group in this.groups
  }
  addToGroup (group) {
    if (!(group in this.groups)) {
      this.state.userObj.groups.push(group)
    }
  }
}