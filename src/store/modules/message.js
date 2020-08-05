import {has} from 'lodash'

const getDefaultState = () => {
  return {
    isMessageActive: false,
    isActionRequired: false,
    message: ""
  }
}

const state = getDefaultState()

const getters = {
  isMessageActive: state => {
    return state.isMessageActive
  },
  message: state => {
    return state.message
  },
}

const actions = {
  async showMessage({commit}, payload) {
    let message = ''
    if (typeof payload === 'string' || payload instanceof String) {
      message = payload
      // Check if user put message property on payload object
    } else if (has(payload, 'message') && payload.message) {
      // Add custom messages here
      if (payload.message === 'Network Error') {
        message = 'Cannot connect to the application backend. It is probably down.'
      }
    } else if (!payload) {
      console.error('showMessage must include a string or a payload object.')
    } else {
      message = JSON.stringify(payload)
    }
    await commit('activateMessage', {message})
  },
  async showError({commit}, payload) {
    let message = ''
    let isActionRequired = true
    // If payload is a string
    if (typeof payload === 'string' || payload instanceof String) {
      message = payload
    // If payload is an HTTP error object
    } else if (has(payload, 'response') && payload.response && has(payload, 'stack') && payload.stack) {
      // If HTTP error object is non_field_errors
      if (has(payload.response, 'non_field_errors')) {
        message = payload.response.non_field_errors
        isActionRequired = false
      // If HTTP error object
      } else if (has(payload.response, 'data') && payload.response.data && has(payload.response.data, 'error') && payload.response.data.error) {
        message = payload.response.data.error
      } else if (has(payload.response, 'status') && payload.response.status) {
        switch(payload.response.status) {
          case 400:
            message = 'Malformed edit.'
            break;
          case 401:
            message = 'You are not authorized to use this application.'
            break;
          case 403:
            message = 'You are not allowed to modify this record.'
            break;
          case 404:
            message = 'Unable to find the URL you are looking for.'
            break;
          case 500:
            message = 'REST API is malfunctioning. Please send a note to rchelp@rc.fas.harvard.edu'
            break;
          default:
            message = 'Error accessing this URL: ' + JSON.stringify(payload)
            break;
        }
      } else {
        return 'Error: ' + JSON.stringify(payload)
      }
      await commit('activateMessage', {message, isActionRequired})
    }
  },
  deactivateMessage({context}) {
    context.commit('deactivateMessage')
  }
}

const mutations = {
  activateMessage(state, payload) {
    const {message, isActionRequired} = payload
    state.message = message
    if (isActionRequired) {
      state.isActionRequired = isActionRequired
    }
    state.isMessageActive = true
  },
  deactivateMessage(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
