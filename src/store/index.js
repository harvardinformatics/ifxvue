import message from './modules/message'
import dialog from './modules/dialog'
import auth from './modules/auth'
import IFXMessage from '@/components/IFXMessage.vue'
import IFXDialog from "@/components/IFXDialog.vue"
import IFXButton from "@/components/IFXButton.vue"
import IFXNotFound from "@/components/IFXNotFound.vue"
import IFXForbidden from "@/components/IFXForbidden.vue"
import IFXPageHeader from "@/components/IFXPageHeader.vue"
import createPersistedState from "vuex-persistedstate";

// Create persistent storage for auth vuex module
const persist = createPersistedState({
  storage: window.sessionStorage,
  paths: ['auth']
})

export const ifxcomponents = {
  IFXMessage,
  IFXDialog,
  IFXButton,
  IFXNotFound,
  IFXForbidden,
  IFXPageHeader
}

export const ifxmodules = {
  message,
  dialog,
  auth
}

/**
 * Dynamically adds components to Vue instance calling this function,
 * registers Vuex modules in its store, and makes auth module persistent.
 */
export default function install(Vue, options ={}) {
  Object.keys(ifxcomponents).forEach(name => {
    Vue.component(name, ifxcomponents[name]);
  })

  Object.keys(ifxmodules).forEach(name => {
    options.store.registerModule(name, ifxmodules[name])
  })
  persist(options.store)
}