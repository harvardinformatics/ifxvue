import message from './modules/message'
import dialog from './modules/dialog'
import IFXMessage from '@/components/IFXMessage.vue';
import IFXDialog from "@/components/IFXDialog.vue";
import IFXButton from "@/components/IFXButton.vue";

const Components = {
  IFXMessage,
  IFXDialog,
  IFXButton
};

const Modules = {
  message,
  dialog
};

function install(Vue, options ={}) {
  Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
  });

  Object.keys(Modules).forEach(name => {
    options.store.registerModule(name, Modules[name])
  })
}

export default {
  install
}
