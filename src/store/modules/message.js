
const getDefaultState = () => {
  return {
    active: false,
    message: ""
  }
}

const state = getDefaultState()

const getters = {
  active: state => {
    return state.active
  },
  message: state => {
    return state.message
  }
}

function getMessage(payload) {
  // If payload is a single string
  if (typeof payload === 'string' || payload instanceof String) {
    return payload
  }
  // Check if payload is an http error response object
  if (payload.hasOwnProperty('response') && payload.response && payload.hasOwnProperty('stack') && payload.stack) {
    // If error object includes non_field_errors
    if (payload.response.hasOwnProperty('non_field_errors')) {
      return payload.response.non_field_errors
    }
    // Check if error info has been set manually in response data
    if (payload.response.hasOwnProperty('data') &&
        payload.response.data &&
        payload.response.data.hasOwnProperty('error') &&
        payload.response.data.error)
    {
      return payload.response.data.error
    }
    switch (payload.response.status) {
      case 400:
        return 'Malformed edit.'
      case 401:
        return 'You are not authorized to use this application.'
      case 403:
        return 'You are not allowed to modify this record.'
      case 404:
        return 'Unable to find the URL you are looking for.'
      case 500:
        return 'REST API is malfunctioning. Please send a note to rchelp@rc.fas.harvard.edu'
      default:
        return 'Error accessing this URL: ' + JSON.stringify(payload)
    }
  }

  // Check if user put message property on payload object
  if (payload.hasOwnProperty('message') && payload.message){
    // Add custom messages here
    if (payload.message === 'Network Error') {
      return 'Cannot connect to the application backend. It is probably down.'
    }
    return payload.message
  }

  // Else
  return 'Error: ' + JSON.stringify(payload)
}

const actions = {
  activate(context) {
    context.commit('activate')
  },
  deactivate(context) {
    context.commit('deactivate')
  },
  async showMessage({commit}, payload) {
    const message = getMessage(payload)
    await commit('showMessage', message)
    await commit('activate')
  }
}

// mutations
const mutations = {
  activate(state) {
    state.active = true
  },
  deactivate(state) {
    Object.assign(state, getDefaultState())
  },
  showMessage(state, message) {
    state.message = message
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
