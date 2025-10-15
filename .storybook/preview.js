import { setup } from '@storybook/vue3'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import IFXMixin from '../src/mixins/IFXMixin'
import IFXFilters from '../src/filters/IFXFilters'
import { createStore } from 'vuex'

const vuetify = createVuetify({
  components,
  directives,
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

const mockAPI = {
  user: {
    canEditField: () => true,
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
  }
}


setup((app) => {
  app.use(vuetify)
  app.use(store)  // ADD THIS

  // Use api mock
  app.config.globalProperties.$api = mockAPI
  // Add global mixin
  app.mixin(IFXMixin)

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