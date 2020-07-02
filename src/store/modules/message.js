
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
    let { error, message } = payload
    // Check if payload has an error object
    if (error && error instanceof Error) {
      if (!error.hasOwnProperty('response')) {
        message = error
      // Check if error is related to field errors
      } else if (error.response && error.response.hasOwnProperty('non_field_errors')) {
        message = error.response.hasOwnProperty('data') ? error.response.data : error
      } else if (error.response && error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('error')) {
        message = error.response.data.error
        // Otherwise generate default error message based on status
      } else if (!message) {
          switch (error.response.status) {
            case 400:
              message = 'Malformed edit: ' + JSON.stringify(error.response.data)
              break
            case 401:
              if (error.response && error.response.hasOwnProperty('data')){
                message = error.response.data.error
              } else {
                message = 'You are not authorized to use this application.'
              }
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
              message = 'Error accessing this URL: ' + JSON.stringify(error.response)
          }
      }
    //   // Check if payload has response object and no message
    } else if (payload.hasOwnProperty('response') && !message) {
      message = payload.response.data
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
