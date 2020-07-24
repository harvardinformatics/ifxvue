import axios from 'axios'

const getDefaultState = () => {
  return {
    authToken: null,
    isAdmin: false,
    username: '',
    groups: '',
    firstName: '',
    lastName: ''
  }
}

const state = getDefaultState()

const getters = {
  authToken: state => state.authToken,
  authHeaderValue: state => state.authToken ? `Token ${state.authToken}` : '',
  isAuthenticated: state => state.username && state.authToken,
  isAdmin: state => state.isAdmin,
  isDjangoStaff: state => state.isAdmin,
  firstName: state => state.firstName,
  lastName: state => state.lastName,
  fullName: state => `${state.firstName} ${state.lastName}`,
  username: state => state.username,
  hasGroup: state => group => {
    const groups = state.groups
    if (!groups) {
      return false
    }
    return groups.split(',').includes(group)
  }
}

const actions = {
  async initUser({commit}, payload) {
    await commit('initUser', payload)
    await commit('setAuthToken', payload.token)
  },
  // This is not used anywhere - do we need it?
  // async fetchToken({commit}) {
  //   const token = await axios.get(LOGIN_URL).then(response => response.data.token ? response.data.token : '')
  //   await commit('setAuthToken', token)
  // },
  setAuthHeaderValue({getters}) {
    axios.defaults.headers.common['Authorization'] = getters.authHeaderValue
  },
  checkAuthentication({getters, dispatch}) {
    if (getters.isAuthenticated) {
      dispatch('setAuthHeaderValue')
    }
  },
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
      await dispatch('showMessage', {error})
      return error
    }
  },
  async logout({commit}) {
    commit('destroyUser')
    return 'success'
  }
}

const mutations = {
  initUser(state, payload) {
    const {is_staff, username, groups, first_name, last_name} = payload
    if (!is_staff || !username || !groups || !first_name || !last_name) {
      console.error('Payload for initUser missing required attributes.')
      return
    }
    state.isAdmin = is_staff
    state.username = username
    state.groups = groups
    state.firstName = first_name
    state.lastName = last_name
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
