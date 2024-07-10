// Vuex module for tracking submitting state
// Namespaced to prevent collisions

const getDefaultState = () => ({
  submitting: false,
  timer: null,
})

const DELAY = 333

const state = getDefaultState()

const getters = {
  isSubmitting: (state) => state.submitting,
  getTimer: (state) => state.timer,
}

const actions = {
  setSubmitting({ commit, state }, payload) {
    let timer = state.timer
    if (timer) {
      clearTimeout(timer)
      commit('setValue', { key: 'timer', value: null })
    }
    if (payload === false) {
      commit('submitting', payload)
      return
    }
    timer = setTimeout(() => {
      commit('submitting', payload)
    }, DELAY)
    commit('setValue', { key: 'timer', value: timer })
  },
  setValue({ commit }, payload) {
    commit('setValue', payload)
  },
  clearAllFields({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  submitting(state, payload) {
    state.submitting = payload
  },
  setValue(state, { key, value }) {
    state[key] = value
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
