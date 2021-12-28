// Vuex module for Mailing
// This is where data for mailing is stored during the composition process
// Namespaced to prevent collisions
// Should be combined with persistentState package to ensure this data is stored in localstorage

const getDefaultState = () => ({
  ifxmailingObj: null,
  // If user selects previous mailing or message, their content will be loaded
  to: [],
  from: [],
  cc: [],
  bcc: [],
  organizations: [],
  subject: '',
  message: '',
  ifxmessage: null,
})

const state = getDefaultState()

const getters = {
  mailingData: (state) => state.mailingData,
  messageData: (state) => state.messageData,
  to: (state) => state.to,
  tostr: (state) => state.to.map((item) => (item.email ? item.email : item)).join(', '),
  from: (state) => state.from,
  fromstr: (state) => state.from,
  cc: (state) => state.cc,
  ccstr: (state) => state.cc.map((item) => (item.email ? item.email : item)).join(', '),
  bcc: (state) => state.bcc,
  bccstr: (state) => state.bcc.map((item) => (item.email ? item.email : item)).join(', '),
  subject: (state) => state.subject,
  message: (state) => state.message,
  ifxmessage: (state) => state.ifxmessage,
  organizations: (state) => state.organizations,
  serializedMailing: (state, gtrs) => {
    // Serialize any organizations
    const mailing = {
      tostr: gtrs.tostr,
      fromstr: gtrs.fromstr,
      ccstr: gtrs.ccstr,
      bccstr: gtrs.bccstr,
      subject: gtrs.subject,
      message: gtrs.message,
    }
    return mailing
  },
}

const actions = {
  loadMailing({ commit }, payload) {
    commit('loadMailing', payload)
  },
  loadMessage({ commit }, payload) {
    commit('loadMessage', payload)
  },
  setValue({ commit }, payload) {
    commit('setValue', payload)
  },
  appendValue({ commit }, payload) {
    commit('appendValue', payload)
  },
  appendValues({ commit }, { key, values }) {
    values.forEach((v) => {
      commit('appendValue', { key, value: v })
    })
  },
  deleteValue({ commit }, payload) {
    commit('deleteValue', payload)
  },
  clearField({ commit }, payload) {
    commit('clearField', payload)
  },
  clearAllFields({ commit }) {
    commit('resetState')
  },
}

const mutations = {
  loadMailing(state, payload) {
    const { tostr, fromstr, ccstr, bccstr, subject, message, ifxmessage } = payload
    state.ifxmailingObj = payload
    if (tostr) state.to = tostr.split(',')
    // if (fromstr) state.from = fromstr.split(',')
    if (fromstr) state.from = fromstr
    if (ccstr) state.cc = ccstr.split(',')
    if (bccstr) state.bcc = bccstr.split(',')
    if (subject) state.subject = subject
    if (message) state.message = message
    if (ifxmessage) state.ifxmessage = ifxmessage
  },
  loadMessage(state, payload) {
    const { message } = payload
    state.ifxmessage = payload
    state.message = message
  },
  setValue(state, { key, value }) {
    state[key] = value
  },
  appendValue(state, { key, value }) {
    state[key].push(value)
  },
  deleteValue(state, { key, value }) {
    const index = state[key].indexOf(value)
    state[key].splice(index, 1)
  },
  clearField(state, { key }) {
    const defaultState = getDefaultState()
    state[key] = defaultState[key]
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
