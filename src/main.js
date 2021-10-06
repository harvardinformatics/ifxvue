import Vue from 'vue'
import APIService from './api/IFXAPI'
import App from './App'
import vuetify from './plugins/vuetify-local'

// import 'vuetify/dist/vuetify.min.css'
// This file contains all application-specific to be used in ifxvue

const appName = 'ifxvue'
const appNameFormatted = 'IFXVue'
const urls = []

const vars = {
  appName,
  appNameFormatted,
  appKey: `ifx_${appName}`,
}

// Initialize with empty user template before authentication occurs
const APIStore = {
  urls,
  vars,
  ui: {},
}

const api = new APIService(APIStore)
Vue.prototype.$api = Vue.observable(api)
api.auth.initAuthUser()

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  components: { App },
  render: (h) => h(App),
})
