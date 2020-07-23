import axios from 'axios'
const LOGIN_URL = 'placeholder'

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
  authHeaderValue: state => 'Token ' + state.authToken,
  isAuthenticated: state => state.username && state.authToken,
  isAdmin: state => state.isAdmin,
  isDjangoStaff: state => state.Admin,
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
  async fetchToken({commit}) {
    const token = await axios.get(LOGIN_URL).then(response => response.data.token ? response.data.token : '')
    await commit('setAuthToken', token)
  },
  setAuthHeaderValue({getters}) {
    axios.defaults.headers.common['Authorization'] = getters.AuthHeaderValue
  },
  checkAuthentication({getters, commit}) {
    if (getters.isAuthenticated) {
      commit('setAuthHeaderValue')
    }
  },
  logout({commit}) {
    commit('destroyUser')
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

export {
  state,
  getters,
  actions,
  mutations
}
