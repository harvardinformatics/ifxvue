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
import IFXItemDataTable from '../src/components/item/IFXItemDataTable.vue'
import IFXSearchField from '../src/components/IFXSearchField.vue'


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
  mailing: {
    getList: async () => [
      {
        id: 1,
        sent: '2024-12-10 14:30:00',
        subject: 'Monthly Lab Newsletter - December 2024',
        fromstr: 'admin@cbsn.harvard.edu',
        tostr: 'lab-members@cbsn.harvard.edu, students@cbsn.harvard.edu',
        ccstr: 'faculty@cbsn.harvard.edu',
        bccstr: '',
        message: '<p>Dear lab members,<br><br>This month we have exciting updates about our new MRI protocols...</p>',
        status: 'Sent',
      },
      {
        id: 2,
        sent: '2024-12-08 09:15:00',
        subject: 'Urgent: Equipment Maintenance This Weekend',
        fromstr: 'facilities@cbsn.harvard.edu',
        tostr: 'all-users@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>The 7T MRI will be offline for scheduled maintenance from Saturday 8am to Sunday 6pm.</p>',
        status: 'Sent',
      },
      {
        id: 3,
        sent: '2024-12-05 16:45:00',
        subject: 'New Research Participant Recruitment Guidelines',
        fromstr: 'ethics@cbsn.harvard.edu',
        tostr: 'principal-investigators@cbsn.harvard.edu, research-coordinators@cbsn.harvard.edu',
        ccstr: 'compliance@harvard.edu',
        bccstr: '',
        message: '<p>Please review the updated IRB guidelines for participant recruitment. All active studies must comply by January 1st, 2025.</p>',
        status: 'Sent',
      },
      {
        id: 4,
        sent: '2024-11-30 11:20:00',
        subject: 'Holiday Schedule and Lab Access',
        fromstr: 'admin@cbsn.harvard.edu',
        tostr: 'lab-members@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>The lab will have limited access during the winter break. Please plan your experiments accordingly.</p>',
        status: 'Sent',
      },
      {
        id: 5,
        sent: '2024-11-25 13:00:00',
        subject: 'Billing Reminders for November',
        fromstr: 'billing@cbsn.harvard.edu',
        tostr: 'lab-managers@cbsn.harvard.edu, finance-contacts@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>November billing records are now available. Please review and submit expense codes by December 5th.</p>',
        status: 'Sent',
      },
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
  app.component('IFXSearchField', IFXSearchField)
  app.component('IFXDataTableCell', IFXDataTableCell)
  app.component('IFXButton', IFXButton)
  app.component('IFXPageHeader', IFXPageHeader)
  app.component('IFXItemDataTable', IFXItemDataTable)

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