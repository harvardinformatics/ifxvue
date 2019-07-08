import message from '../store/modules/message'
import dialog from '../store/modules/dialog'
import Message from "./Message.vue";
import Dialog from "./Dialog.vue";

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
