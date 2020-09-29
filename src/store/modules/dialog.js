const getDefaultState = () => ({
  isDialogOpen: false
})

const state = getDefaultState()

const getters = {
  isDialogOpen: state => state.isDialogOpen
}

const actions = {
  async openDialog({ commit, dispatch }, data) {
    if (data) await dispatch('loadRequest', data)
    await commit('openDialog')
  },
  closeDialog({ commit }) {
    commit('close')
  }
}

const mutations = {
  openDialog(state) {
    state.isDialogOpen = true
  },
  close(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
