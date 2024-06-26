// Vuex module for tracking submitting state
// Namespaced to prevent collisions

const getDefaultState = () => ({
  submitting: false,
})

const state = getDefaultState()

const getters = {
  isSubmitting: (state) => state.submitting,
}

const actions = {
  setSubmitting({ commit }, payload) {
    commit('submitting', payload)
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
