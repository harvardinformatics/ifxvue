// Vuex module for tracking submitting state
// Namespaced to prevent collisions

const getDefaultState = () => ({
  submitting: false,
  timer: null,
})

const state = getDefaultState()

const getters = {
  isSubmitting: (state) => state.submitting,
  getTimer: (state) => state.timer,
}

const actions = {
  setSubmitting({ commit }, payload) {
    let timer = getters.getTimer
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      commit('submitting', payload)
    }, 333)
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
