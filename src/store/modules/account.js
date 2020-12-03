// initial state
const state = {
  currentRefresh: true, // 页面是否刷新
  token: '', // 权限列表
  userInfo: {} // 用户基本信息
}

const getters = {}

const actions = {
  logout({ commit }) {
    commit({ type: 'logout' })
    commit({ type: 'clearAllData' }, { root: true })
  },
  token({ commit }, data) {
    commit('setToken', data)
  },
  userInfo({ commit }, data) {
    commit('setUserInfo', data)
  },
  // 修改页面状态
  refresh({ commit }, data) {
    commit('refresh', data)
  }
}

const mutations = {
  logout: state => {
    state.token = ''
    state.userInfo = {}
  },
  setToken(state, data) {
    state.token = data
  },
  setUserInfo(state, data) {
    state.userInfo = data
  },
  refresh(state, data) {
    state.currentRefresh = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
