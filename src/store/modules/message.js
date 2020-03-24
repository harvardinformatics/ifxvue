
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

const actions = {
  activate(context) {
    context.commit('activate')
  },
  deactivate(context) {
    context.commit('deactivate')
  },
  async showMessage(context, payload) {
    let { message } = payload
    // Check if payload has an error object
    if (Object.prototype.hasOwnProperty.call(payload, 'response')) {
      if (Object.prototype.hasOwnProperty.call(payload.response, 'non_field_errors')) {
        // payload.response.non_field_errors, usually from validation
        message = payload.response.non_field_errors
      } else if (
        Object.prototype.hasOwnProperty.call(payload.response, 'data') &&
        Object.prototype.hasOwnProperty.call(payload.response.data, 'error')
      ) {
        // Manually set 'error' in response data
        message = payload.response.data.error
      } else {
        switch (payload.response.status) {
          case 400:
            message = 'Malformed edit'
            break
          case 401:
            message = 'You are not authorized to use this application.'
            break
          case 403:
            message = 'You are not allowed to modify this record.'
            break
          case 404:
            message = 'Unable to find the URL you are looking for.'
            break
          case 500:
            message = 'REST API is malfunctioning. Please send a note to rchelp@rc.fas.harvard.edu'
            break
          default:
            message = 'Error accessing this URL: ' + JSON.stringify(payload)
        }
      }
    }
    if (!message) {
      message = 'Error'
      console.log(payload)
    }
    await context.commit('showMessage', message)
    await context.commit('activate')
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
