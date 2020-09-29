import axios from 'axios'

export default class IFXStoreAPIService {
  constructor(store) {
    this._store = store
    this._axios = axios.create()
  }

  get store() {
    return this._store
  }

  get urls() {
    return this._store.urls
  }

  get vars() {
    return this._store.vars
  }

  get user() {
    return this._store.user
  }

  set user(userObj) {
    sessionStorage.setItem('ifx_hers_user', JSON.stringify(userObj))
    this._store.user = userObj
  }
}
