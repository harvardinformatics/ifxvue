import IFXStoreAPIService from '@/classes/IFXStoreAPI'

export default class IFXUserAPIService extends IFXStoreAPIService {
  get firstName() {
    return this.user.first_name
  }

  get lastName() {
    return this.user.last_name
  }

  get username() {
    return this.user.username
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  get groups() {
    return this.user.groups
  }

  get isActive() {
    return this.user.is_active
  }

  get isStaff() {
    return this.user.is_staff
  }

  get isAdmin() {
    return this.user.is_staff
  }

  get isDjangoStaff() {
    return this.user.is_staff
  }

  get isAuthenticated() {
    return this.username && this.authToken
  }

  hasGroup(group) {
    return group in this.groups
  }

  addToGroup(group) {
    if (!(group in this.groups)) {
      this.user.groups.push(group)
    }
  }

  get authToken() {
    return this.user.token
  }

  get authHeaderValue() {
    return `Token ${this.authToken}`
  }

  get axios() {
    this._axios.interceptors.request.use(c => {
      const config = c
      config.baseURL = this.urls.API_ROOT
      config.headers.Authorization = this.authHeaderValue
      return config;
    })
    return this._axios
  }

  /**
   * Logs user into the system. Retrieves token and sets user information if successful.
   */
  async login() {
    try {
      const response = await this.axios.get(this.store.urls.LOGIN_URL)
      if (!response.data || !response.data.token) {
        // failure
        const message = 'You are a known user, but your data is malformed. Please contact rchelp@rc.fas.harvard.edu.'
        throw Error(message)
      } else {
        // If response has data and token, then it is successful
        this.user = response.data
        const message = 'Login successful.'
        return message
      }
    } catch (error) {
      let message = ''
      if (error.hasOwnProperty('response') && error.response && error.response.status == 401) {
        let info = ''
        if (error.response.hasOwnProperty('data') && error.response.data && error.response.data.hasOwnProperty('error')) {
          info = error.response.data.error
        }
        message = `Not authorized: ${info}`
      } else {
        message = `Login failed: ${error}`
      }
      throw Error(message)
    }
  }

  async logout() {
    this.user = this._store.templates.user
    sessionStorage.removeItem(`ifx_${this.vars.app_name}_user`)
    const message = 'You have been logged out successfully.'
    return message
  }
}
