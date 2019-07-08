
const getDefaultState = () => {
  return {
    open: false
  }
}

const state = getDefaultState()

const getters = {
  open: state => {
    return state.open
  }
}

const actions = {
  async openDialog(context, request) {
    await context.dispatch('loadRequest', request)
    await context.commit('open')
  },
  closeDialog(context) {
    context.commit('close')
  }
}

const mutations = {
  open(state) {
    state.open = true
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