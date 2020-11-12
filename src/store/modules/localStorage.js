import Vue from 'vue'

function isNumeric(val) {
  return !Number.isNaN(parseFloat(val)) && Number.isFinite(val);
}

function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const getDefaultState = () => ({})

const state = getDefaultState()

const getters = {
  getItem: (state) => (key) => {
    const value = state[key]
    if (isNumeric(value)) {
      return parseFloat(value)
    }
    if (isJSONString(value)) {
      return JSON.parse(value)
    }
    return value
  }
}

const actions = {
  setItem({ commit }, payload) {
    commit('setItem', payload)
  },
  removeItem({ commit }, payload) {
    commit('removeItem', payload)
  }
}

const mutations = {
  setItem(state, { key, value }) {
    state[key] = value
  },
  removeItem(state, key) {
    Vue.delete(state, key);
  },
  clear(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
