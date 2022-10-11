import Vue from 'vue'
import Vuex from 'vuex'
// import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'
import prod from './modules/prod'
import globalData from './modules/globalData'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    prod,
    globalData
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = ''
        // location.reload()
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
