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

import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXDataTableCell from '@/components/IFXDataTableCell'

import VCurrencyField from 'v-currency-field'
import createPersistedState from 'vuex-persistedstate';
import IFXTextEditor from '@/components/IFXTextEditor'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMixins from '@/mixins/IFXMixins'
import IFXFilters from '@/filters/IFXFilters'
import message from '@/vuex/message'
import mailing from '@/vuex/mailing'

// These components/mixins must be import individually in host application
export {
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
  IFXContactable
}

// Registered globally
export const ifxcomponents = {
  IFXButton,
  IFXNotFound,
  IFXForbidden,
  IFXPageHeader,
  IFXDataTableCell,
  IFXPageErrorDisplay,
  IFXLoginIcon,
}

export const ifxmodules = {
  message,
  mailing
}

/**
 * Dynamically adds components to Vue instance calling this function,
 * registers Vuex modules in its store, and makes auth module persistent.
 */
export default function install(Vue, options = {}) {
  Object.keys(ifxcomponents).forEach(name => {
    Vue.component(name, ifxcomponents[name]);
  })

  const sessionConfig = {
    storage: window.sessionStorage,
    key: `${options.APIStore.vars.appKey}_mailing`,
    paths: ['mailing']
  }
  const sessionPersist = createPersistedState(sessionConfig)

  // Add plugin before module is registered
  sessionPersist(options.vuexStore)

  Object.keys(ifxmodules).forEach(name => {
    // Check if module state has been initialized. If not, do not preserve it.
    const preserveState = !!options.vuexStore[name]
    options.vuexStore.registerModule(name, ifxmodules[name], { preserveState })
  })

  Object.keys(IFXFilters).forEach(name => {
    Vue.filter(name, IFXFilters[name])
  })

  Vue.mixin(IFXMixins)

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
