// This is the entrypoint file when ifxvue is imported into the host application, i.e. all imports should be done from this dir
// All exports must be done explicitly

import IFXAPIService from '@/api/IFXAPI'

import IFXMessageDisplay from '@/components/IFXMessageDisplay'
import IFXButton from '@/components/IFXButton'
// Page
import IFXNotFound from '@/components/page/IFXNotFound'
import IFXForbidden from '@/components/page/IFXForbidden'
import IFXPageHeader from '@/components/page/IFXPageHeader'
import IFXPageErrorDisplay from '@/components/page/IFXPageErrorDisplay'

// Item
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'
import IFXItemBase from '@/components/item/IFXItemBase'

// Contactable
import IFXContactable from '@/components/contactable/IFXContactable'

// Mailing
import IFXMailingCompose from '@/components/mailing/IFXMailingCompose'
import IFXMailingDetail from '@/components/mailing/IFXMailingDetail'
import IFXMailingList from '@/components/mailing/IFXMailingList'
import IFXMailingMixin from '@/components/mailing/IFXMailingMixin'
import IFXMailing from '@/components/mailing/IFXMailing'

// Message
import IFXMessageCreateEdit from '@/components/message/IFXMessageCreateEdit'
import IFXMessageDetail from '@/components/message/IFXMessageDetail'
import IFXMessageList from '@/components/message/IFXMessageList'
import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXMessage from '@/components/message/IFXMessage'

// Action
import IFXActionSelect from '@/components/action/IFXActionSelect'

// AuthUser
import IFXAuthUser from '@/components/authUser/IFXAuthUser'

// Organization
import IFXOrganizationCreateEdit from '@/components/organization/IFXOrganizationCreateEdit'
import IFXOrganizationDetail from '@/components/organization/IFXOrganizationDetail'
import IFXOrganizationList from '@/components/organization/IFXOrganizationList'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXOrganization from '@/components/organization/IFXOrganization'

// Contact
import IFXContactCreateEdit from '@/components/contact/IFXContactCreateEdit'
import IFXContactDetail from '@/components/contact/IFXContactDetail'
import IFXContactList from '@/components/contact/IFXContactList'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXContact from '@/components/contact/IFXContact'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXContactCard from '@/components/contact/IFXContactCard'

// User
import IFXUserEdit from '@/components/user/IFXUserEdit'
import IFXUserDetail from '@/components/user/IFXUserDetail'
import IFXUserList from '@/components/user/IFXUserList'
import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXUser from '@/components/user/IFXUser'
import IFXSelectableUser from '@/components/user/IFXSelectableUser'

// Affiliation
import IFXAffiliation from '@/components/affiliation/IFXAffiliation'
import IFXSelectableAffiliation from '@/components/affiliation/IFXSelectableAffiliation'

// Affiliation
import IFXAddress from '@/components/address/IFXAddress'
import IFXSelectableAddress from '@/components/address/IFXSelectableAddress'

// Account
import IFXAccount from '@/components/account/IFXAccount'
import IFXAccountList from '@/components/account/IFXAccountList'
import IFXAccountMixin from '@/components/account/IFXAccountMixin'

import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXEnabledIcon from '@/components/IFXEnabledIcon'
import IFXDataTableCell from '@/components/IFXDataTableCell'
import VCurrencyField from 'v-currency-field'
import createPersistedState from 'vuex-persistedstate';
import IFXTextEditor from '@/components/IFXTextEditor'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMixin from '@/mixins/IFXMixin'
import IFXFilters from '@/filters/IFXFilters'
import message from '@/vuex/message'
import mailing from '@/vuex/mailing'

// These components/mixins must be import individually in host application
export {
  IFXAPIService,
  IFXTextEditor,
  IFXSearchField,
  IFXItemSelectList,
  IFXItemCreateEditMixin,
  IFXItemDetailMixin,
  IFXItemListMixin,
  IFXItemSelectableMixin,
  IFXItemHistoryDisplay,
  IFXItemDataTable,
  IFXMailingCompose,
  IFXMailingDetail,
  IFXMailingList,
  IFXMailingMixin,
  IFXActionSelect,
  IFXDeleteItemButton,
  IFXMailing,
  IFXMessageDisplay,
  IFXMessage,
  IFXMessageCreateEdit,
  IFXMessageDetail,
  IFXMessageList,
  IFXMessageMixin,
  IFXItemBase,
  IFXAuthUser,
  IFXContactable,
  IFXLoginIcon,
  IFXEnabledIcon,
  IFXOrganization,
  IFXOrganizationCreateEdit,
  IFXOrganizationDetail,
  IFXOrganizationList,
  IFXOrganizationMixin,
  IFXContact,
  IFXContactCreateEdit,
  IFXContactDetail,
  IFXContactList,
  IFXContactMixin,
  IFXSelectableContact,
  IFXContactCard,
  IFXUser,
  IFXUserEdit,
  IFXUserDetail,
  IFXUserList,
  IFXUserMixin,
  IFXSelectableUser,
  IFXAffiliation,
  IFXSelectableAffiliation,
  IFXAddress,
  IFXSelectableAddress,
  IFXAccount,
  IFXAccountList,
  IFXAccountMixin
}

// Registered globally
export const ifxcomponents = {
  IFXButton,
  IFXNotFound,
  IFXForbidden,
  IFXPageHeader,
  IFXDataTableCell,
  IFXPageErrorDisplay,
}
export const ifxmodules = {
  message,
  mailing
}

/**
 * Dynamically adds components to Vue instance calling this function,
 * registers Vuex modules in its store, and makes auth module persistent.
 * @param {object} Vue the vue instance of the host application
 * @param {object} options the options for installation
 */
export default function install(Vue, options = {}) {
  // Loop through all components to be registered globally and registers them
  Object.keys(ifxcomponents).forEach(name => {
    Vue.component(name, ifxcomponents[name]);
  })

  // Making Vuex mailing module persistent
  const sessionConfig = {
    storage: window.sessionStorage,
    key: `${options.APIStore.vars.appKey}_mailing`,
    paths: ['mailing']
  }
  const sessionPersist = createPersistedState(sessionConfig)

  // Add plugin before module is registered
  sessionPersist(options.vuexStore)

  // Loop through all Vuex modules and register them
  Object.keys(ifxmodules).forEach(name => {
    // Check if module state has been initialized. If not, do not preserve it.
    const preserveState = !!options.vuexStore[name]
    options.vuexStore.registerModule(name, ifxmodules[name], { preserveState })
  })

  // Add filters
  Object.keys(IFXFilters).forEach(name => {
    Vue.filter(name, IFXFilters[name])
  })

  // Add top-level mixin
  Vue.mixin(IFXMixin)

  // Add currencyField package
  Vue.use(VCurrencyField, {
    locale: 'usd',
    decimalLength: 2,
    autoDecimalMode: true,
    min: null,
    max: null,
    defaultValue: null,
    valueAsInteger: true,
    allowNegative: false,
    prefix: '$'
  })
}