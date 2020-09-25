import { has } from 'lodash'

const getDefaultState = () => ({
  isMessageActive: false,
  isActionRequired: false,
  message: ''
})

const state = getDefaultState()

const getters = {
  isMessageActive: state => state.isMessageActive,
  isActionRequired: state => state.isActionRequired,
  message: state => state.message,
}

function getMessage(payload) {
  let message = ''
  let isActionRequired = false

  if (typeof payload === 'string' || payload instanceof String) {
    // Add custom string mappings here
    if (payload === 'Network Error') {
      message = 'Cannot connect to the application backend. It is probably down.'
    } else {
      message = payload
    }
    return { message, isActionRequired }
  }

  // If it is an axios error object
  if (has(payload, 'response') && has(payload, 'config') && has(payload, 'request')) {
    // If it's a non_field_errors object
    if (has(payload.response, 'non_field_errors')) {
      message = payload.response.non_field_errors
      return { message, isActionRequired }
    }
    // If payload is error object and not non-field error, then action is required
    isActionRequired = true

    if (has(payload.response, 'data') && has(payload.response.data, 'error')) {
      message = payload.response.data.error
      return { message, isActionRequired }
    }

    // Check status values
    if (has(payload.response, 'status')) {
      switch (payload.response.status) {
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
        case 405:
          message = 'This method is not allowed. Please try something else.'
          break;
        case 500:
          message = 'REST API is malfunctioning. Please send a note to rchelp@rc.fas.harvard.edu.'
          break;
        default:
          message = `Error accessing this URL: ${JSON.stringify(payload)}`
          break;
      }
      return { message, isActionRequired }
    }
  }
  // If all else fails, check for a message property
  if (has(payload, 'message')) {
    message = payload.message
  } else {
    message = `Unknown error${payload}`
  }
  return { message, isActionRequired }
}

const actions = {
  showMessage({ commit }, payload) {
    if (!payload) {
      console.error('showMessage must include a string or a payload object.')
      return
    }
    const res = getMessage(payload)
    commit('activateMessage', res)
  },
  deactivateMessage({ commit }) {
    commit('deactivateMessage')
  }
}

const mutations = {
  activateMessage(state, payload) {
    const { message, isActionRequired } = payload
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
