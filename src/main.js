import Vue from 'vue'
import vuetify from './plugins/vuetify'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { RotateSquare2 } from 'vue-loading-spinner'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import fullscreen from 'vue-fullscreen'
import App from './App.vue'
import router from './router'
import store from './store'
import * as Api from './api'
import { storeKey } from './data'

import loadmore from 'Components/directive/loadmore'
// global components
import GlobalComponents from './globalComponents'

// api接口
Vue.prototype.api = Api
// 每页多少条数据
Vue.prototype.pageSize = 20

Vue.config.productionTip = false

// 解决防止刷新页面 vuex store 丢失的问题
function resetStore() {
  // 在页面加载时读取sessionStorage里的状态信息
  const sessionStore = window.sessionStorage.getItem(storeKey.vuexStore)
  if (sessionStore) {
    let vuexStore = {}
    Object.assign(vuexStore, store.state, JSON.parse(sessionStore))
    store.replaceState(vuexStore)
    window.sessionStorage.removeItem(storeKey.vuexStore)
  }

  // 在页面刷新时将vuex里的信息保存到sessionStorage里
  // ie、谷歌、360 页面刷新执行顺序 onbeforeunload -> onunload -> onload，关闭执行顺序 onbeforeunload -> onunload
  // firefox 页面刷新只执行 onunload，页面关闭只执行 onbeforeunload
  let eventName = 'beforeunload'
  const fireFox = navigator.userAgent.indexOf('Firefox') !== -1
  if (fireFox) {
    eventName = 'unload'
  }
  window.addEventListener(eventName, () => {
    // 根据 currentRefresh 判断是退出还是刷新
    const currentRefresh = store.state.account.currentRefresh
    if (currentRefresh) {
      window.sessionStorage.setItem(
        storeKey.vuexStore,
        JSON.stringify(store.state)
      )
    }
  })
  // console.log(JSON.stringify(this.$store.state))
}
resetStore()

Vue.component('rotateSquare2', RotateSquare2)
Vue.component('vuePerfectScrollbar', VuePerfectScrollbar)
Vue.use(ElementUI)
Vue.use(loadmore)
// 注册全局钩子拦截【登录】
router.beforeEach((to, from, next) => {
  // 404
  if (!to.matched.length && to.path !== '/404') {
    next({ path: '/404' })
    return false
  }
  if (!to.meta.requiresAuth) {
    const token = store.state.account.token
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 拦截异常(更新发布导致找不到chunk.js文件的问题)
// Loading chunk chunk-5b972512 failed
router.onError(err => {
  // console.warn(['onError', err.message])
  const pattern = /Loading chunk ([\s\S]*) failed/g
  const isChunkLoadFailed = err.message.match(pattern)
  if (isChunkLoadFailed) {
    const targetPath = router.history.pending.fullPath
    // console.warn(['onError', window.location.origin + targetPath])
    window.location.href = window.location.origin + targetPath
    // window.location.reload(true)
  }
})

// plugins
// Vue.use(Vuetify, {
// 	theme: store.getters.selectedTheme.theme
// });
// Vue.use(InstantSearch)
// Vue.use(VueI18n)
// Vue.use(AmCharts)
// Vue.use(AmSerial)
// Vue.use(VueTour)
// Vue.use(AmAngularGauge)
// Vue.use(Vue2Dragula)
// Vue.use(VueQuillEditor)
// Vue.use(VueResource)
// Vue.use(wysiwyg, {})
// Vue.use(VueBreadcrumbs)
// Vue.use(Notifications, { velocity })
Vue.use(fullscreen)
Vue.use(GlobalComponents)
// Vue.use(VueVideoPlayer)
// Vue.use(Croppa)
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk' // Add your here your google map api key
//   }
// })
Vue.config.silent = true
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
