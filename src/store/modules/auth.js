import axios from 'axios'

const getDefaultState = () => {
  return {
    userObj: {
      isStaff: null,
      isActive: null,
      firstName: '',
      lastName: '',
      username: '',
      groups: [],
    },
    authToken: null,
  }
}

const state = getDefaultState()

const getters = {
  userObj: state => state.userObj,
  authToken: state => state.authToken,
  authHeaderValue: state => state.authToken ? `Token ${state.authToken}` : '',
  isAuthenticated: state => state.userObj.username && state.authToken
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
  async login({dispatch, rootState}) {
    try {
      const response = await axios.get(rootState.constants.LOGIN_URL)
      if (!response.data || !response.data.token) {
        // failure
        const message = 'You are a known user, but your data is malformed. Please contact rchelp@rc.fas.harvard.edu.'
        throw new Error(message)
      } else {
        // If response has data and token, then it is successful
        await dispatch('initUser', response.data)
        const message = 'Login successful.'
        return message
      }
    } catch(error) {
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
  async logout({commit}) {
    commit('destroyUser')
    const message = 'You have been logged out successfully.'
    return message
  }
}

const mutations = {
  initUser(state, payload) {
    state.userObj.isStaff = payload.is_staff
    state.userObj.username = payload.username
    state.userObj.groups = payload.groups
    state.userObj.firstName = payload.first_name
    state.userObj.lastName = payload.last_name
    state.userObj.lastName = payload.is_active
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
