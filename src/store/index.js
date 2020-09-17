import message from './modules/message'
import dialog from './modules/dialog'
import IFXMessage from '@/components/IFXMessage.vue'
import IFXDialog from "@/components/IFXDialog.vue"
import IFXButton from "@/components/IFXButton.vue"
import IFXNotFound from "@/components/IFXNotFound.vue"
import IFXForbidden from "@/components/IFXForbidden.vue"
import IFXPageHeader from "@/components/IFXPageHeader.vue"
import IFXDataTableSlot from "@/components/IFXDataTableSlot.vue"
import IFXPageErrorDisplay from "@/components/IFXPageErrorDisplay.vue"
import { humanDatetime, centsToDollars, capitalizeFirstLetter, emailDisplay } from './modules/filters'
import { IFXUserAPIService } from '@/classes/IFXUserApi'
import { IFXStoreAPIService } from '@/classes/IFXStoreApi'
import ifxmixins from './modules/mixins'
import VCurrencyField from 'v-currency-field'

export const ifxclasses = {
  IFXUserAPIService,
  IFXStoreAPIService
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
  dialog
}

/**
 * Dynamically adds components to Vue instance calling this function,
 * registers Vuex modules in its store, and makes auth module persistent.
 */
export default function install(Vue, options={}) {
  Object.keys(ifxcomponents).forEach(name => {
    Vue.component(name, ifxcomponents[name]);
  })

  Object.keys(ifxmodules).forEach(name => {
    options.store.registerModule(name, ifxmodules[name])
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

}