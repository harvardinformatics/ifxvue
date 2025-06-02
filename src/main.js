import { createApp, reactive } from 'vue'
/* eslint-disable import/no-extraneous-dependencies */
import IFXFilters from '@/filters/IFXFilters'
import IFXMixin from '@/mixins/IFXMixin'

import MockAdapter from 'axios-mock-adapter'
import APIService from './api/IFXAPI'
import App from './App'
import vuetify from './plugins/vuetify-local'

// import 'vuetify/dist/vuetify.min.css'
// This file contains all application-specific to be used in ifxvue

const appName = 'ifxvue'
const appNameFormatted = 'IFXVue'
const urls = {
  BILLING_RECORDS: 'billing/',
  CONTACTS: 'contacts/',
  ORGANIZATIONS: 'organizations/',
}

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

const mock = new MockAdapter(api.axios)

const app = createApp(App)

// Make API and mock available globally
app.config.globalProperties.$api = reactive(api)
app.config.globalProperties.$mock = mock

api.auth.initAuthUser()

// Add filters as global properties
Object.keys(IFXFilters).forEach((name) => {
  app.config.globalProperties[`$${name}`] = IFXFilters[name]
})

// Add top-level mixin
app.mixin(IFXMixin)

// Add vuetify plugin
app.use(vuetify)

app.mount('#app')
