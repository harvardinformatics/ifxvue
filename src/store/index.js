import IFXMessage from '@/components/IFXMessage'
import IFXDialog from '@/components/IFXDialog'
import IFXButton from '@/components/IFXButton'
import IFXNotFound from '@/components/IFXNotFound'
import IFXForbidden from '@/components/IFXForbidden'
import IFXPageHeader from '@/components/IFXPageHeader'
import IFXDataTableSlot from '@/components/IFXDataTableSlot'
import IFXPageErrorDisplay from '@/components/IFXPageErrorDisplay'
import IFXUserAPIService from '@/classes/IFXUserAPI'
import IFXStoreAPIService from '@/classes/IFXStoreAPI'
import IFXRequestAPIService from '@/classes/IFXRequestAPI'
import VCurrencyField from 'v-currency-field'
import createPersistedState from 'vuex-persistedstate';
import ifxmixins from './modules/mixins'
import { humanDatetime, centsToDollars, capitalizeFirstLetter, emailDisplay } from './modules/filters'
import dialog from './modules/dialog'
import message from './modules/message'
import ifxmailing from './modules/ifxmailing'
import ifxtemplates from './modules/templates'

export const ifxclasses = {
  IFXUserAPIService,
  IFXStoreAPIService,
  IFXRequestAPIService
}

export const ifxfilters = {
  humanDatetime,
  centsToDollars,
  capitalizeFirstLetter,
  emailDisplay
}

export const ifxcomponents = {
  IFXMessage,
  IFXDialog,
  IFXButton,
  IFXNotFound,
  IFXForbidden,
  IFXPageHeader,
  IFXDataTableSlot,
  IFXPageErrorDisplay
}

export const ifxmodules = {
  message,
  dialog,
  ifxmailing
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
    key: `${options.APIStore.vars.appKey}_ifxmailing`,
    paths: ['ifxmailing']
  }
  const sessionPersist = createPersistedState(sessionConfig)

  // Add plugin before module is registered
  sessionPersist(options.vuexStore)

  Object.keys(ifxmodules).forEach(name => {
    // Check if module state has been initialized. If not, do not preserve it.
    const preserveState = !!options.vuexStore[name]
    options.vuexStore.registerModule(name, ifxmodules[name], { preserveState })
  })

  Object.keys(ifxfilters).forEach(name => {
    Vue.filter(name, ifxfilters[name])
  })

  Vue.mixin(ifxmixins)

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

  options.APIStore.templates.IFXMESSAGE = ifxtemplates.IFXMESSAGE
  options.APIStore.templates.IFXMAILING = ifxtemplates.IFXMAILING
}
