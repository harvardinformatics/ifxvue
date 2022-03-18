import Vue from 'vue'
/* eslint-disable import/no-extraneous-dependencies */
import IFXFilters from '@/filters/IFXFilters'
import IFXMixin from '@/mixins/IFXMixin'
import VCurrencyField from 'v-currency-field'

import MockAdapter from 'axios-mock-adapter'
import APIService from './api/IFXAPI'
import App from './App.vue'
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
Vue.prototype.$mock = mock

Vue.prototype.$api = Vue.observable(api)
api.auth.initAuthUser()

// Add filters
Object.keys(IFXFilters).forEach((name) => {
  Vue.filter(name, IFXFilters[name])
})

// Add top-level mixin
Vue.mixin(IFXMixin)

// Add currencyField package
Vue.use(VCurrencyField, {
  locale: 'usd',
  decimalLength: 2,
  autoDecimalMode: true,
  min: null,
  max: null,
  defaultValue: null,
  valueAsInteger: true,
  allowNegative: false,
  prefix: '$',
})

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  components: { App },
  render: (h) => h(App),
})
