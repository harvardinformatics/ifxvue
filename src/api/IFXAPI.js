/* eslint-disable no-param-reassign */
import axios from 'axios'
import has from 'lodash/has'
import forEach from 'lodash/forEach'
import cloneDeep from 'lodash/cloneDeep'
import Contact from '@/components/contact/IFXContact'
import { User, UserContact, UserAccount } from '@/components/user/IFXUser'
import Address from '@/components/address/IFXAddress'
import Affiliation from '@/components/affiliation/IFXAffiliation'
import { Organization, OrganizationContact, OrganizationUser } from '@/components/organization/IFXOrganization'
import IFXMailing from '@/components/mailing/IFXMailing'
import IFXMessage from '@/components/message/IFXMessage'
import IFXAuthUser from '@/components/authUser/IFXAuthUser'
import { Account, UserProductAccount } from '@/components/account/IFXAccount'
import ProductAccount from '@/components/account/IFXProductAccount'
import Facility from '@/components/facility/IFXFacility'
import BillingRecord, { BillingTransaction } from '@/components/billingRecord/IFXBillingRecord'
import { Product, ProductRate, ProductUsage, Processing } from '@/components/product/IFXProduct'

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

  get userContact() {
    const createFunc = (data = {}) => {
      if (!data.contact) {
        data.contact = this.contact.create()
      }
      return new UserContact(data)
    }
    return this.genericAPI(null, UserContact, createFunc, null)
  }

  get userAccount() {
    const createFunc = (data = {}) => {
      if (!data.account) {
        data.account = this.account.create()
      }
      return new UserAccount(data)
    }
    return this.genericAPI(null, UserAccount, createFunc, null)
  }

  get user() {
    const baseURL = this.urls.USERS
    const createFunc = (userData, decompose = false) => {
      const newUserData = cloneDeep(userData) || {}
      newUserData.contacts = []
      newUserData.affiliations = []
      newUserData.accounts = []
      newUserData.product_accounts = []

      if (userData.contacts && userData.contacts.length) {
        const contactDataObjs = userData.contacts.map(({ active, id, role, contact }) => {
          // contact.data.id = 1
          const newContactData = {
            active,
            id,
            role,
            contact: decompose ? contact.data : this.contact.create(contact),
          }
          return decompose ? newContactData : this.userContact.create(newContactData)
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
        const accountDataObjs = userData.accounts.map(({ id, is_valid, account }) => {
          const newAccountData = {
            id,
            is_valid,
            account: decompose ? account : this.account.create(account),
          }
          return decompose ? newAccountData : this.userAccount.create(newAccountData)
        })
        newUserData.accounts = accountDataObjs
      }

      if (userData.product_accounts && userData.product_accounts.length) {
        const productAccountDataObjs = userData.product_accounts.map((pa) => (decompose ? pa : this.productAccount.create(pa)))
        newUserData.product_accounts = productAccountDataObjs
      }
      return decompose ? newUserData : new User(newUserData)
    }
    const decomposeFunc = (userData) => createFunc(userData, true)
    const api = this.genericAPI(baseURL, User, createFunc, decomposeFunc)
    api.userRoles = [
      {
        value: 'pi',
        text: 'PI',
      },
      {
        value: 'member',
        text: 'Member',
      },
      {
        value: 'lab_manager',
        text: 'Lab Manager',
      },
      {
        value: 'approver',
        text: 'Approver',
      },
    ]
    api.canEditField = (field, obj = this.authUser) => {
      if (this.auth.isAdmin) return true
      const USER_EDITABLE_FIELDS = ['firstName', 'lastName', 'primaryEmail', 'fullName']
      // field name should be class.field
      const [className, fieldName] = field.split('.')
      if (className === 'User' && USER_EDITABLE_FIELDS.includes(fieldName)) {
        if (obj.username === this.authUser.username) {
          return true
        }
      }
      return false
    }
    api.getByID = async (id, includeDisabled = true) => {
      const params = includeDisabled ? { include_disabled: true } : {}
      const url = `${baseURL}${id}/`
      return this.axios.get(url, { params }).then((res) => createFunc(res.data))
    }

    return api
  }

  get skinnyUser() {
    const baseUrl = this.urls.SKINNY_USERS
    return this.genericAPI(baseUrl, User)
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
        const organizationContactDataObjs = orgData.contacts.map(({ role, active, contact }) => {
          const newContactData = {
            id: contact.id,
            active,
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
        const organizationUserDataObjs = orgData.users.map(({ role, user, active }) => {
          const newUserData = {
            id: user.id,
            role,
            active,
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
      getList: async (params) => {
        const url = this.urls.CONTACTABLES
        if (params && params.org_slugs) {
          params.org_slugs = params.org_slugs.join(',')
        }
        const contactables = await this.axios
          .post(url, params)
          .then((response) => response.data)
          .catch((error) => {
            throw new Error(error)
          })
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
      ICON_FOR_GROUP: { Admin: { icon: 'mdi-key', color: '#fafad2' } },
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
    const createFunc = (accountData, decompose = false) => {
      const newAccountData = cloneDeep(accountData)
      // Initialize contacts and users as empty arrays - will be filled in if incoming orgData has contacts or users
      newAccountData.user_accounts = []
      newAccountData.user_product_accounts = []

      // Check if incoming accountData has user_accounts, user_product_accounts
      if (accountData.user_accounts?.length) {
        const userAccountDataObjs = accountData.user_accounts.map(({ id, user, is_valid }) => {
          const newUserAccountData = {
            id,
            is_valid,
            // If decomposing, do not create dynamic contact object
            // TODO: why isn't type defined here? Role is not type
            user: decompose ? user.data : this.user.create(user),
          }
          // If decomposing, do not create dynamic organization contact object
          return decompose ? newUserAccountData : new UserProductAccount(newUserAccountData)
        })
        newAccountData.user_accounts = userAccountDataObjs
      }

      // Check if incoming accountData has user product accounts
      if (accountData.user_product_accounts?.length) {
        const userProductAccountDataObjs = accountData.user_product_accounts.map(
          ({ id, is_valid, user, product, percent }) => {
            const newProductAccountData = {
              id,
              is_valid,
              product,
              percent,
              // If decomposing, do not create a dynamic user object
              user: decompose ? user.data : this.user.create(user),
            }
            // If decomposing, do not create a dynamic organization user object
            return decompose ? newProductAccountData : new UserProductAccount(newProductAccountData)
          }
        )
        newAccountData.user_product_accounts = userProductAccountDataObjs
      }
      // If decomposing, do not create a dynamic organization object
      return decompose ? newAccountData : new Account(newAccountData)
    }
    const decomposeFunc = (accountData) => createFunc(accountData, true)
    return this.genericAPI(baseURL, null, createFunc, decomposeFunc)
  }

  get productAccount() {
    const createFunc = (productAccountData, decompose = false) => {
      const newProductAccountData = cloneDeep(productAccountData) || {}

      // Check if incoming productAccountData has account or product
      if (productAccountData.account) {
        // If decomposing, do not create dynamic account object
        newProductAccountData.account = decompose
          ? productAccountData.account.data
          : this.account.create(productAccountData.account)
      }

      if (productAccountData.product) {
        // If decomposing, do not create dynamic product object
        newProductAccountData.product = decompose
          ? productAccountData.product.data
          : this.product.create(productAccountData.product)
      }

      // If decomposing, do not create a dynamic product object
      return decompose ? newProductAccountData : new ProductAccount(newProductAccountData)
    }
    const decomposeFunc = (newProductAccountData) => createFunc(newProductAccountData, true)
    const api = this.genericAPI(null, ProductAccount, createFunc, decomposeFunc)
    return api
  }

  get expenseCodeRequest() {
    return {
      create: (params = {}) => this.axios.post(this.urls.EXPENSE_CODE_REQUEST, params).then((res) => res.data),
    }
  }

  get product() {
    const baseUrl = this.urls.PRODUCTS
    const createFunc = (productData, decompose = false) => {
      const newProductData = cloneDeep(productData) || {}
      // Initialize product rates empty arrays - will be filled in if incoming productData has rates
      newProductData.rates = []

      // Check if incoming productData has rates
      if (productData.rates && productData.rates.length) {
        // If decomposing, do not create dynamic rate object
        const productRateDataObjs = productData.rates.map((rate) => (decompose ? rate.data : this.productRate.create(rate)))
        newProductData.rates = productRateDataObjs
      }

      // If decomposing, do not create a dynamic product object
      return decompose ? newProductData : new Product(newProductData)
    }
    const decomposeFunc = (newProductData) => createFunc(newProductData, true)
    const api = this.genericAPI(baseUrl, null, createFunc, decomposeFunc)
    return api
  }

  get productRate() {
    return this.genericAPI(null, ProductRate)
  }

  get processing() {
    return this.genericAPI(null, Processing)
  }

  get productUsage() {
    const baseUrl = this.urls.PRODUCT_USAGES
    const createFunc = (productUsageData, decompose = false) => {
      const newProductUsageData = cloneDeep(productUsageData) || {}
      if (productUsageData.product) {
        newProductUsageData.product = decompose
          ? productUsageData.product.data
          : this.product.create(productUsageData.product)
      }
      if (productUsageData.product_user) {
        newProductUsageData.product_user = decompose
          ? productUsageData.productUser.data
          : this.user.create(productUsageData.product_user)
      }
      if (newProductUsageData.processing?.length) {
        newProductUsageData.processing = decompose
          ? newProductUsageData.processing.data
          : this.processing.create(newProductUsageData.processing[0]) // There should be only one of these
      }

      // If decomposing, do not create a dynamic product object
      return decompose ? newProductUsageData : new ProductUsage(newProductUsageData)
    }
    const decomposeFunc = (newProductUsageData) => createFunc(newProductUsageData, true)
    return this.genericAPI(baseUrl, ProductUsage, createFunc, decomposeFunc)
  }

  get facility() {
    const baseUrl = this.urls.FACILITIES
    const api = this.genericAPI(baseUrl, Facility)
    api.isDecimalFacility = (facility_name) => {
      const result = ['Research Computing Storage', 'Center for Brain Science Neuroimaging'].includes(facility_name)
      return result
    }
    api.isFacilityWithDates = (facility_name) => {
      const result = ['Center for Brain Science Neuroimaging'].includes(facility_name)
      console.log(`result of date check is ${result}`)
      return result
    }
    return api
  }

  get billingRecord() {
    const baseURL = `${this.urls.BILLING_RECORDS}`
    const createFunc = (data, decompose = false) => {
      const newBillingData = cloneDeep(data) || {}
      newBillingData.transactions = []

      if (data.transactions && data.transactions.length) {
        // If decomposing, do not create dynamic rate object
        const transactionDataObjs = data.transactions.map((transaction) => (decompose ? transaction.data : this.billingTransaction.create(transaction)))
        newBillingData.transactions = transactionDataObjs
      }

      newBillingData.organization = data.account?.organization

      return decompose ? newBillingData : new BillingRecord(newBillingData)
    }
    const decomposeFunc = (billingRecord) => createFunc(billingRecord, true)
    const api = this.genericAPI(baseURL, null, createFunc, decomposeFunc)

    api.getList = async (invoice_prefix, month = null, year = null, organization = null) => {
      const params = { invoice_prefix, month, year, organization }
      const url = this.urls.BILLING_RECORD_LIST
      return this.axios.get(url, { params }).then((res) => Promise.all(res.data.map((data) => createFunc(data))))
    }
    api.getByID = async (facilityPrefix, id) => {
      const url = `${baseURL}${id}/`
      return this.axios.get(url).then((res) => createFunc(res.data))
    }
    api.delete = () => ({ status: 501, message: 'Not implemented' })
    // eslint-disable-next-line no-unused-vars
    api.bulkUpdate = async (recs, app = null) => {
      const url = `${baseURL}bulk_update/`
      const newData = []
      recs.forEach((rec) => {
        newData.push(createFunc(rec.data, true))
      })
      return this.axios.post(url, newData, { headers: { 'Content-Type': 'application/json' } })
    }

    api.calculateBillingMonth = (facility, year, month, recalculate = false) => {
      if (!facility.invoicePrefix) {
        throw new Error(`Facility ${facility.name} is missing an invoice prefix`)
      }
      const url = `${this.urls.CALCULATE_BILLING_MONTH}${facility.invoicePrefix}/${year}/${month}/`
      return this.axios.post(url, { recalculate })
    }
    api.billingRecordReviewNotification = (ifxorg_ids, test = [], facility, year, month) => {
      const url = `${this.urls.BILLING_RECORD_REVIEW_NOTIFICATION}${facility.invoicePrefix}/${year}/${month}/`
      return this.axios.post(url, { ifxorg_ids, test }, { headers: { 'Content-Type': 'application/json' } })
    }
    api.getUsagesForFacility = (facility, year, month) => {
      if (facility.name === 'Liquid Nitrogen Service') {
        return this.nitrogenLog.getList(null, year, month)
      }
      throw new Error(`Do not understand facility ${facility.name}`)
    }

    return api
  }

  get billingTransaction() {
    return this.genericAPI(null, BillingTransaction)
  }

  mockError(code) {
    let url = this.urls.MOCK_ERRORS
    if (code) {
      url += `${code}/`
    }
    return this.axios.get(url)
  }

  getLabManagerNotificationMessageName(facility) {
    return `${this.vars.appName}_${facility.invoicePrefix}_lab_manager_billing_record_notification`
  }

  async notifyLabManagers(organizationSlugs, facility, year, month, recipientField, router) {
    const messageName = this.getLabManagerNotificationMessageName(facility)
    const messages = await this.message.getList({ name: messageName })
    let message = ''
    let subject = ''
    if (messages.length) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      const link = `https://fiine.rc.fas.harvard.edu/fiine/billing/billing-records/list/?year=${year}&month=${month}&facility=${facility.name}`
      message = messages[0].message
        .replaceAll('{link}', link)
        .replaceAll('{month}', months[month - 1])
        .replaceAll('{year}', year)
      subject = messages[0].subject
    }

    router.push({
      name: 'MailingCompose',
      params: {
        labManagerOrgSlugs: organizationSlugs,
        message: message,
        subject: subject,
        recipientField: recipientField,
      },
    })
  }

  async reviewLabManagerNotifications(organizationSlugs, selectedContactables, facility, year, month) {
    let orgIFXIDs = []
    let emails = []
    if (selectedContactables.length) {
      emails = selectedContactables.map((contact) => contact.detail)
    }
    if (organizationSlugs.length) {
      // There are no test email addresses so create the array of org ids
      const orgs = await this.organization.getList()
      orgIFXIDs = organizationSlugs.map((org) => {
        const fullOrg = orgs.find((anOrg) => org === anOrg.slug)
        if (fullOrg) {
          return fullOrg.ifxOrg
        }
        return ''
      })
    }
    const response = await this.billingRecord.billingRecordReviewNotification(orgIFXIDs, emails, facility, year, month)
    return response
  }

  updateAuthorizations(ifxids) {
    const url = this.urls.UPDATE_USER_ACCOUNTS
    const data = {}
    if (ifxids && ifxids.length) {
      data.ifxids = ifxids
    }
    return this.axios.post(url, data, { headers: { 'Content-Type': 'application/json' } })
  }
}
