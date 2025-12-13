import { setup } from '@storybook/vue3'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import IFXMixin from '../src/mixins/IFXMixin'
import IFXFilters from '../src/filters/IFXFilters'
import { createStore } from 'vuex'
import IFXDataTableCell from '../src/components/IFXDataTableCell.vue'
import IFXButton from '../src/components/IFXButton.vue'
import IFXPageHeader from '../src/components/page/IFXPageHeader.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

// Create a mock Vuex store for Storybook
const store = createStore({
  state: {
    message: '',
    isMessageActive: false,
    isActionRequired: false,
  },
  getters: {
    message: (state) => state.message,
    isMessageActive: (state) => state.isMessageActive,
    isActionRequired: (state) => state.isActionRequired,
  },
  mutations: {
    SHOW_MESSAGE(state, payload) {
      state.message = payload.message
      state.isMessageActive = true
      state.isActionRequired = payload.isActionRequired || false
    },
    DEACTIVATE_MESSAGE(state) {
      state.isMessageActive = false
      state.message = ''
      state.isActionRequired = false
    },
  },
  actions: {
    showMessage({ commit }, payload) {
      commit('SHOW_MESSAGE', payload)
    },
    deactivateMessage({ commit }) {
      commit('DEACTIVATE_MESSAGE')
    },
  },
})

// Mock storage
const mockStorage = {
  getItem: (key) => {
    return localStorage.getItem(key) ? parseInt(localStorage.getItem(key)) : null
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value.toString())
  },
}

const mockAPI = {
  user: {
    canEditField: () => false,
  },
  vars: {
    appName: 'ifxvue',
    appNameFormatted: 'IFXVue',
  },
  organization: {
    getValidRankByValue: (rank) => {
      // Mock organization ranks
      const ranks = {
        university: { text: 'University', value: 'university' },
        faculty: { text: 'Faculty', value: 'faculty' },
        department: { text: 'Department', value: 'department' },
        lab: { text: 'Lab', value: 'lab' },
      }
      return ranks[rank] || { text: rank, value: rank }
    }
  },
  storage: mockStorage,
  billingSummary: {
    getList: async () => [
      { id: 1, organization: 'Neuroscience Lab', totalDecimalCharge: 15000, usageHours: 50 },
      { id: 2, organization: 'Psychology Department', totalDecimalCharge: 8500, usageHours: 28 },
    ]
  },
}

// Mock Router
const mockRouter = {
  push: (location) => {
    console.log('Router push:', location)
  },
  replace: (location) => {
    console.log('Router replace:', location)
  },
  back: () => {
    console.log('Router back')
  },
  forward: () => {
    console.log('Router forward')
  },
  go: (n) => {
    console.log('Router go:', n)
  },
}

// Mock Route
const mockRoute = {
  query: { next: 'previous-page' },
  params: {},
  path: '/storybook',
  name: 'storybook',
  meta: {},
  hash: '',
  fullPath: '/storybook',
}


setup((app) => {
  app.use(vuetify)
  app.use(store)

  // Add global properties
  app.config.globalProperties.$api = mockAPI
  app.config.globalProperties.$router = mockRouter
  app.config.globalProperties.$route = mockRoute

  // Add global mixin
  app.mixin(IFXMixin)
  app.component('IFXDataTableCell', IFXDataTableCell)
  app.component('IFXButton', IFXButton)
  app.component('IFXPageHeader', IFXPageHeader)

  // Add filters as global properties
  Object.keys(IFXFilters).forEach((name) => {
    app.config.globalProperties[`$${name}`] = IFXFilters[name]
  })
})

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}