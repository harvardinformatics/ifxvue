const getDefaultState = () => ({
  isDialogOpen: false
})

const _state = getDefaultState()

const _getters = {
  isDialogOpen: state => state.isDialogOpen
}

const _actions = {
  async openDialog({ commit, dispatch }, data) {
    if (data) await dispatch('loadRequest', data)
    await commit('openDialog')
  },
  closeDialog({ commit }) {
    commit('close')
  }
}

const _mutations = {
  openDialog(state) {
    state.isDialogOpen = true
  },
  close(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  _state,
  _getters,
  _actions,
  _mutations
}
