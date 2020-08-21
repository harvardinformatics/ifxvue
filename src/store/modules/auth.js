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
  async login({dispatch, rootGetters}) {
    try {
      const response = await axios.get(rootGetters.LOGIN_URL)
      if (!response.data || !response.data.token) {
        // failure
        const message = 'You are a known user, but your data is malformed. Please contact rchelp@rc.fas.harvard.edu.'
        await dispatch('showMessage', message)
        throw new Error(message)
      } else {
        // If response has data and token, then it is successful
        await dispatch('initUser', response.data)
        const message = 'Login successful. Now you can do whatever you want.'
        await dispatch('showMessage', message)
        return message
      }
    } catch(error) {
      await dispatch('showMessage', error)
      return error
    }
  },
  logout({commit, dispatch}) {
    commit('destroyUser')
    const message = 'You have been logged out successfully.'
    dispatch('showMessage', message)
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
