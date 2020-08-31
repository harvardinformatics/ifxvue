import axios from 'axios'

const getDefaultState = () => {
  return {
    authToken: null,
    user: null
  }
}

const state = getDefaultState()

const getters = {
  authToken: state => state.authToken,
  authHeaderValue: state => state.authToken ? `Token ${state.authToken}` : '',
  user: state => state.user,
  isAuthenticated: state => state.username && state.authToken,
}

const actions = {
  async initUser({commit}, payload) {
    await commit('initUser', payload)
    await commit('setAuthToken', payload.token)
  },
  setAuthHeaderValue({getters}) {
    axios.defaults.headers.common['Authorization'] = getters.authHeaderValue
  },
  checkAuthentication({getters, dispatch}) {
    if (getters.isAuthenticated) {
      dispatch('setAuthHeaderValue')
    }
  },
  /**
   * Logs user into the system. Retrieves token and sets user information if successful.
   */
  async login({dispatch}, payload) {
    try {
      console.log('login payload ')
      console.log(payload)
      let userClassName = 'User'
      if (payload.hasOwnProperty('userClassName')) {
        userClassName = payload.userClassName
      }
      const response = await axios.get(payload.LOGIN_URL)
      if (!response.data || !response.data.token) {
        // failure
        const message = 'Malformed user data.'
        throw new Error(message)
      } else {
        // If response has data and token, then it is successful
        let userObj
        if (payload.hasOwnProperty('createUser')) {
          userObj = payload['createUser'](response.data)
        } else {
          userObj = (Function(`return new ${userClassName}`))(response.data)
        }
        console.log('User obj')
        console.log(userObj)
        await dispatch('initUser', userObj)
        const message = 'Login successful.'
        return message
      }
    } catch(error) {
      console.log(error)
      let message = 'Login failure.'
      if (error.hasOwnProperty('response') && error.response && error.response.status == 401) {
        console.log(error.response)
        let info = ''
        if (error.response.hasOwnProperty('data') && error.response.data && error.response.data.hasOwnProperty('error')) {
          info = error.response.data.error
        }
        message = `Not authorized. ${info}`
      }
      throw new Error(message)
    }
  },
  logout({commit}) {
    commit('destroyUser')
    const message = 'Logout successful.'
    return message
  }
}

const mutations = {
  initUser(state, payload) {
    const {user} = payload
    if (!user) {
      console.error('Payload for initUser missing required attributes.')
      return
    }
    state.user = user
  },
  destroyUser(state) {
    Object.assign(state, getDefaultState())
  },
  setAuthToken(state, token) {
    if (token) {
      state.authToken = token
    } else {
      state.authToken = ''
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
