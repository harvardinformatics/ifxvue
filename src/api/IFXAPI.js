/* eslint-disable no-param-reassign */
import axios from 'axios'
import has from 'lodash/has'
import forEach from 'lodash/forEach'
import cloneDeep from 'lodash/cloneDeep'
import Contact from '@/components/contact/IFXContact'
import User from '@/components/user/IFXUser'
import Address from '@/components/address/IFXAddress'
import Affiliation from '@/components/affiliation/IFXAffiliation'
import { Organization, OrganizationContact, OrganizationUser } from '@/components/organization/IFXOrganization'
import IFXMailing from '@/components/mailing/IFXMailing'
import IFXMessage from '@/components/message/IFXMessage'
import IFXAuthUser from '@/components/authUser/IFXAuthUser'
import IFXContactable from '@/components/contactable/IFXContactable'
import Account from '@/components/account/IFXAccount'
// import IFXExpenseCodeRequest from '@/components/IFXExpenseCodeRequest'

function isNumeric(val) {
  return !Number.isNaN(parseFloat(val)) && Number.isFinite(val)
}

function isJSONString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export default class IFXAPIService {
  constructor(store) {
    this._store = store
    this._axios = axios.create()
    this._authUser = null
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

  get axios() {
    this._axios.interceptors.request.use((c) => {
      const config = c
      config.baseURL = this.urls.API_ROOT
      if (this.auth.headerValue.trim().split(' ').length === 2) {
        // Token is of the form "Token XXXXX" if the user has been authenticated
        config.headers.Authorization = this.auth.headerValue
      }
      return config
    })
    return this._axios
  }

  get storage() {
    const defaultType = 'local'
    return {
      getItem: (key, type = defaultType) => {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage
        const computedKey = `${this.vars.appKey}_${key}`
        const val = storage.getItem(computedKey)
        if (isNumeric(val)) {
          return parseFloat(val)
        }
        if (isJSONString(val)) {
          return JSON.parse(val)
        }
        return val
      },
      setItem: (key, value, type = defaultType) => {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage
        const computedKey = `${this.vars.appKey}_${key}`
        storage.setItem(computedKey, JSON.stringify(value))
      },
      removeItem: (key, type = defaultType) => {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage
        const computedKey = `${this.vars.appKey}_${key}`
        storage.removeItem(computedKey)
      },
      clear: (type = defaultType) => {
        const storage = type === 'session' ? window.sessionStorage : window.localStorage
        storage.clear()
      },
    }
  }

  genericAPI(baseURL = '', ItemClass = null, createFunc = null, decomposeFunc = null) {
    if (!baseURL) {
      // console.error('BaseURL should be set for most methods')
    }
    if (!ItemClass && !createFunc) {
      console.error('Either the item class or the createFunc must be defined')
    }
    if (!createFunc) {
      createFunc = (data) => new ItemClass(data)
    }
    if (!decomposeFunc) {
      decomposeFunc = (item) => item
    }
    return {
      // Create and decompose are synchronous - this is important for the more complex apis, like Organization
      // As organization creation is assumed to be sync, so if users, contacts creation is async, things break
      create: (data) => createFunc(data),
      decompose: (item) => decomposeFunc(item),
      getList: async (params = {}) => this.axios.get(baseURL, { params }).then((res) => res.data.map((item) => createFunc(item))),
      getByID: async (id) => {
        const url = `${baseURL}${id}/`
        return this.axios.get(url).then((res) => createFunc(res.data))
      },
      update: async (item) => {
        const url = `${baseURL}${item.id}/`
        const data = decomposeFunc(item.data)
        return this.axios.put(url, data, { headers: { 'Content-Type': 'application/json' } })
      },
      save: async (item) => {
        const data = decomposeFunc(item.data)
        return this.axios.post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
      },
      delete: async (item) => {
        const url = `${baseURL}${item.id}/`
        return this.axios.delete(url)
      },
    }
  }

  get authUser() {
    return this._authUser
  }

  set authUser(authUser) {
    this._authUser = authUser
    if (authUser.isAuthenticated) {
      this.storage.setItem('user', authUser.data)
    }
  }

  get auth() {
    return {
      headerValue: this.authUser && this.authUser.token ? `Token ${this.authUser.token}` : '',
      isAuthenticated: this.authUser ? this.authUser.isAuthenticated : false,
      isAdmin: this.authUser ? this.authUser.isAdmin : false,
      isStaff: this.authUser ? this.authUser.isStaff : false,
      // Returns the record for the user that is currently authenticated
      getCurrentUserRecord: async () => {
        const username = this.authUser.username
        const users = await this.user.getList({ username })
        // TODO switch from console errors to returned errors
        if (users.length > 1) {
          console.error('Cannot have more than one returned user')
        }
        if (users.length && users.length >= 1) {
          return users[0]
        }
        console.error('No user found')
        return null
      },
      initAuthUser: () => {
        let userData = this.storage.getItem('user')
        if (!userData) userData = {}
        // If a user object is found in storage, set it to the current user
        this.authUser = new IFXAuthUser(userData)
      },
      can(ability, user) {
        if (!user) {
          user = this.authUser
        }
        if (ability && this.isAdmin) {
          return true
        }
        return false
      },
      // Logs user into the system. Retrieves token and sets user information if successful.
      login: async () => {
        try {
          const response = await this.axios.get(this.urls.LOGIN_URL)
          if (!response.data || !response.data.token) {
            // failure
            const message = 'You are a known user, but your data is malformed.'
            throw new Error(message)
          } else {
            // If response has data and token, then it is successful
            const userData = response.data
            this.authUser = new IFXAuthUser(userData)
            return 'Login successful.'
          }
        } catch (error) {
          let message = 'Login failure.'
          if (has(error, 'response') && has(error.response, 'status') && error.response.status === 401) {
            let info = ''
            if (
              error.response.hasOwnProperty('data')
              && error.response.data
              && error.response.data.hasOwnProperty('error')
            ) {
              info = error.response.data.error
            }
            message = `Not authorized: ${info}`
          } else {
            message = `Login failed: ${error}`
          }
          throw Error(message)
        }
      },
      logout: async () => {
        const userData = {}
        this.authUser = new IFXAuthUser(userData)
        this.storage.removeItem('user')
        return 'You have been logged out successfully.'
      },
    }
  }

  get contact() {
    const baseUrl = this.urls.CONTACTS
    const api = this.genericAPI(baseUrl, Contact)
    // TODO: this getList method is defined here because the url is different than the baseurl
    api.getList = async (params) => {
      const url = this.urls.GET_CONTACT_LIST
      const contacts = await this.axios
        .get(url, { params })
        .then((res) => Promise.all(res.data.map((contactData) => api.create(contactData))))
        .catch((err) => {
          throw new Error(err)
        })
      return contacts || []
    }
    api.types = ['Email', 'Phone']
    return api
  }

  get user() {
    const baseURL = this.urls.USERS
    const createFunc = (userData, decompose = false) => {
      const newUserData = cloneDeep(userData) || {}
      newUserData.contacts = []
      newUserData.affiliations = []
      newUserData.accounts = []

      if (userData.contacts && userData.contacts.length) {
        const contactDataObjs = userData.contacts.map(({ id, role, contact }) => {
          // contact.data.id = 1
          const newContactData = {
            id,
            role,
            contact: decompose ? contact.data : this.contact.create(contact),
          }
          return newContactData
        })
        newUserData.contacts = contactDataObjs
      }

      if (userData.affiliations && userData.affiliations.length) {
        const affiliationDataObjs = userData.affiliations.map(({ id, organization, role, active }) => {
          const newAffiliationData = {
            id,
            role,
            organization,
            active,
          }
          return newAffiliationData
        })
        newUserData.affiliations = affiliationDataObjs
      }

      if (userData.accounts && userData.accounts.length) {
        const accountDataObjs = userData.accounts.map(({ id, account }) => {
          const newAccountData = {
            id,
            account: decompose ? account : this.account.create(account),
          }
          return newAccountData
        })
        newUserData.accounts = accountDataObjs
      }

      return decompose ? newUserData : new User(newUserData)
    }
    const decomposeFunc = (userData) => createFunc(userData, true)
    const api = this.genericAPI(baseURL, User, createFunc, decomposeFunc)
    api.canEditField = (field, obj) => {
      if (this.auth.isAdmin) return true
      const USER_EDITABLE_FIELDS = ['firstName', 'lastName']
      // field name should be class.field
      const [className, fieldName] = field.split('.')
      if (className === 'User' && fieldName in USER_EDITABLE_FIELDS) {
        if (obj.username === this.username) {
          return true
        }
      }
      return false
    }
    return api
  }

  get organization() {
    const baseUrl = this.urls.ORGANIZATIONS
    const createFunc = (orgData, decompose = false) => {
      const newOrgData = cloneDeep(orgData) || { org_tree: 'Local' }
      // Initialize contacts and users as empty arrays - will be filled in if incoming orgData has contacts or users
      newOrgData.contacts = []
      newOrgData.users = []

      // Check if incoming orgData has contacts
      if (orgData.contacts && orgData.contacts.length) {
        const organizationContactDataObjs = orgData.contacts.map(({ role, contact }) => {
          const newContactData = {
            id: contact.id,
            role,
            // If decomposing, do not create dynamic contact object
            // TODO: why isn't type defined here? Role is not type
            contact: decompose ? contact.data : this.contact.create(contact),
          }
          // If decomposing, do not create dynamic organization contact object
          return decompose ? newContactData : this.organizationContact.create(newContactData)
        })
        newOrgData.contacts = organizationContactDataObjs
      }

      // Check if incoming orgData has users
      if (orgData.users && orgData.users.length) {
        const organizationUserDataObjs = orgData.users.map(({ role, user }) => {
          const newUserData = {
            id: user.id,
            role,
            // If decomposing, do not create a dynamic user object
            user: decompose ? user.data : this.user.create(user),
          }
          // If decomposing, do not create a dynamic organization user object
          return decompose ? newUserData : this.organizationUser.create(newUserData)
        })
        newOrgData.users = organizationUserDataObjs
      }
      // If decomposing, do not create a dynamic organization object
      return decompose ? newOrgData : new Organization(newOrgData)
    }
    const decomposeFunc = (orgData) => createFunc(orgData, true)
    const api = this.genericAPI(baseUrl, null, createFunc, decomposeFunc)
    api.validRanks = [
      {
        value: 'school',
        text: 'School',
      },
      {
        value: 'department',
        text: 'Department',
      },
      {
        value: 'center',
        text: 'Center',
      },
      {
        value: 'lab',
        text: 'Laboratory',
      },
      {
        value: 'institute',
        text: 'Institute',
      },
      {
        value: 'museum',
        text: 'Museum',
      },
      {
        value: 'institution',
        text: 'Institution',
      },
      {
        value: 'facility',
        text: 'Facility',
      },
      {
        value: 'program',
        text: 'Program',
      },
      {
        value: 'division',
        text: 'Division',
      },
      {
        value: 'group',
        text: 'Group',
      },
      {
        value: 'office',
        text: 'Office',
      },
      {
        value: 'company',
        text: 'Company',
      },
    ]
    api.getValidRankByValue = (value) => api.validRanks.find((r) => r.value === value)
    api.getValidRankByText = (text) => api.validRanks.find((r) => r.text === text)

    api.getList = async (params = {}) => {
      const { orgTrees } = params
      if (orgTrees) {
        params.org_tree = orgTrees.join(',')
        delete params.orgTrees
      }
      const organizations = await this.axios
        .get(baseUrl, { params })
        .then((res) => Promise.all(res.data.map((orgData) => this.organization.create(orgData))))
        .catch((err) => {
          throw new Error(err)
        })
      return organizations || []
    }
    // this has been added to the object itelf
    api.canEdit = (organization) => !organization.ifxOrg
    api.getNames = async (selector = null) => {
      const url = this.urls.ORGANIZATION_NAMES
      const orgNames = await this.axios
        .get(url)
        .then((res) => res.data)
        .then((objs) => {
          if (selector) {
            return objs.map((o) => o[selector])
          }
          return objs
        })
      return orgNames
    }
    api.parseSlug = (slug) => {
      /* Splits an organization slug into name, org_tree, and rank */
      const result = {
        slug: slug,
      }
      if (slug) {
        const match = slug.match(/(.+?) \(a (.+?) (\S+)\)$/)
        if (match) {
          result.name = match[1]
          result.org_tree = match[2]
          const rank = match[3]
          forEach(api.validRanks, (e) => {
            if (e.text === rank) {
              result.rank = e.value
            }
          })
        }
      }
      return result
    }
    return api
  }

  get organizationContact() {
    const createFunc = (data = {}) => {
      if (!data.contact) {
        data.contact = this.contact.create()
      }
      return new OrganizationContact(data)
    }
    return this.genericAPI(null, OrganizationContact, createFunc, null)
  }

  get organizationUser() {
    const createFunc = (data = {}) => {
      if (!data.user) {
        data.user = this.user.create({})
      }
      return new OrganizationUser(data)
    }
    return this.genericAPI(null, OrganizationUser, createFunc, null)
  }

  // this.$api.contactables.getList(search)

  get contactables() {
    return {
      create: (data = null) => {
        console.error('Still need to implement contactable object')
        return new IFXContactable(data)
      },
      getList: async (search, orgTrees) => {
        const contacts = await this.contact.getList(search).catch((err) => {
          throw new Error(err)
        })

        const users = await this.user.getList(search).catch((err) => {
          throw new Error(err)
        })

        const organizations = await this.organization.getList({ search, orgTrees }).catch((err) => {
          throw new Error(err)
        })

        const contactables = [contacts, organizations, users].flat()
        return contactables
      },
    }
  }

  get address() {
    return {
      create: (data = {}) => new Address(data),
      types: ['Work', 'Home', 'Additional'],
    }
  }

  get group() {
    return {
      getList: async (p) => {
        let params = p
        if (!params) {
          params = {}
        }
        try {
          const response = await this.axios.get(this.urls.GROUPS, { params })
          return response.data
        } catch (error) {
          throw new Error(error)
        }
      },
      getNames: async () => {
        const response = await this.group.getList()
        return response.map((g) => g.name)
      },
      // TODO: better way to handle this
      COLOR_FOR_GROUP: { Admin: '#fafad2' },
      colorForGroup(group) {
        return group in this.COLOR_FOR_GROUP ? this.COLOR_FOR_GROUP[group] : '#efefef'
      },
      // TODO: better way to handle this
      ICON_FOR_GROUP: { Admin: 'mdi-key' },
      iconForGroup(group) {
        return group in this.ICON_FOR_GROUP ? this.ICON_FOR_GROUP[group] : 'mdi-check-decagram'
      },
    }
  }

  // Combine with address?
  get location() {
    return {
      getInfo: (params) => this.axios.get(this.urls.GET_LOCATION_INFO, { params }),
      getCountryList: async () => {
        const params = {
          target: 'country',
        }
        return this.location.getInfo(params).then((res) => res.data.location_info)
      },

      getStateList: async (country = null) => {
        const params = {
          target: 'state',
        }
        if (country) {
          params.country = country
        }
        return this.location.getInfo(params).then((res) => res.data.location_info)
      },

      getCityList: async (country = null, state = null) => {
        const params = {
          target: 'city',
        }
        if (country) {
          params.country = country
        }
        if (state) {
          params.state = state
        }
        return this.location.getInfo(params).then((res) => res.data.location_info)
      },
    }
  }

  get affiliation() {
    const api = this.genericAPI(null, Affiliation)
    return api
  }

  get mailing() {
    const baseURL = this.urls.MAILINGS
    const api = this.genericAPI(baseURL, IFXMailing)
    // TODO: extend api for sending
    api.sendIfxMailing = (mailing) => this.axios.post(this.urls.SEND_IFXMAILING, mailing).then((res) => res.data)
    return api
  }

  get message() {
    const baseURL = this.urls.MESSAGES
    return this.genericAPI(baseURL, IFXMessage)
  }

  get account() {
    const baseURL = this.urls.ACCOUNTS
    return this.genericAPI(baseURL, Account)
  }

  get expenseCodeRequest() {
    return {
      create: (params = {}) => this.axios.post(this.urls.EXPENSE_CODE_REQUEST, params).then((res) => res.data),
    }
  }

  mockError(code) {
    let url = this.urls.MOCK_ERRORS
    if (code) {
      url += `${code}/`
    }
    return this.axios.get(url)
  }
}
