
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
    console.log('fuck you')
    console.log('payload')
    console.log(payload)
    let { message } = payload
    console.log(message)
    if (payload.hasOwnProperty('message')){
      console.log('message from payload')
      console.log(payload.message)
      if (payload.message === 'Network Error') {
        console.log('it is a network error')
      }
    }
    // Check if payload has an error object
    if (payload.hasOwnProperty('response') && payload.response) {
      console.log('It has a response')
      console.log(payload.response)
      if (payload instanceof Error) {
        console.log('Its an error')
        console.log(payload.name)
        console.log(payload.message)
      }
      if (payload.response instanceof Error) {
        console.log('The response is an error')
        console.log(payload.response.name)
        console.log(payload.response.message)
      }
      if (payload.response && payload.response.hasOwnProperty('non_field_errors')) {
        console.log('non field errors')
        // payload.response.non_field_errors, usually from validation
        message = payload.response.non_field_errors
      } else if (payload.response && payload.response.hasOwnProperty('data') && payload.response.data.hasOwnProperty('error')
      ) {
        // Manually set 'error' in response data
        console.log('There is a response.data.error property')
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
    } else {
      console.log('There is no response on the payload')
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
