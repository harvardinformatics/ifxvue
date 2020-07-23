import message from './modules/message'
import dialog from './modules/dialog'
import login from './modules/login'
import IFXMessage from '@/components/IFXMessage.vue'
import IFXDialog from "@/components/IFXDialog.vue"
import IFXButton from "@/components/IFXButton.vue"
import IFXNotFound from "@/components/IFXNotFound.vue"
import IFXForbidden from "@/components/IFXForbidden.vue"
import IFXPageHeader from "@/components/IFXPageHeader.vue"
import IFXLogin from "@/components/IFXLogin.vue"
import IFXLogout from "@/components/IFXLogout.vue"

export const ifxcomponents = {
  IFXMessage,
  IFXDialog,
  IFXButton,
  IFXNotFound,
  IFXForbidden,
  IFXPageHeader,
  IFXLogin,
  IFXLogout
}

export const ifxmodules = {
  message,
  dialog,
  login
}

export default function install(Vue, options ={}) {
  Object.keys(ifxcomponents).forEach(name => {
    Vue.component(name, ifxcomponents[name]);
  })

  Object.keys(ifxmodules).forEach(name => {
    options.store.registerModule(name, ifxmodules[name])
  })
}