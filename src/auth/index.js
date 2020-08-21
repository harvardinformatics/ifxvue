import store from '@/store/index'

/*
auth.js
An auth class with convenience methods for getting and setting auth tokens
Uses the auth store
*/


class TokenAuth {
  getAuthHeaderValue () {
    return store.getters.authHeaderValue
  }
  isAuthenticated () {
    return store.getters.isAuthenticated
  }
  getUser () {
    return store.getters.user
  }
}

let auth = new TokenAuth()
export default auth
