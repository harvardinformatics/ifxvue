
const getDefaultState = () => {
  return {
    isLoggedIn: false
  }
}

const state = getDefaultState()

const getters = {
  isLoggedIn: state => {
    return state.isLoggedIn
  }
}

const actions = {
  login: ({commit}) => commit('login'),
  logout: ({commit}) => commit('logout')
}

const mutations = {
  login: state => state.isLoggedIn = true,
  logout: state => state.isLoggedIn = false
}

export default {
  state,
  getters,
  actions,
  mutations
}