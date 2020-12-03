import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // 日志调试
import modules from './modules/index' // 模块

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    ...modules
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  mutations: {
    clearAllData: () => {
      // console.log(state)
    }
  }
})
