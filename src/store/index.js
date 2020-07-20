import message from './modules/message'
import dialog from './modules/dialog'
import Message from '@/components/Message.vue';
import Dialog from "@/components/Dialog.vue";

const Components = {
  Message,
  Dialog
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
