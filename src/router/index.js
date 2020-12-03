import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/pages/ims/common/Main'
import MainHome from '@/pages/ims/common/MainHome' // 首页
import NotFound from '@/pages/ims/common/NotFound' // 404页面
import Login from 'Common/Login' // 登录页面
import ForgetPassword from 'Common/ForgetPassword' //忘记密码
import Work from './work' //账户相关
import Basis from './basis' //基础功能
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASEURL,
  routes: [
    {
      path: '/',
      // name: 'main',
      title: '供货商h系统',
      component: Main,
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '/',
          name: 'home',
          component: MainHome
        },
        ...Work,
        ...Basis,
        {
          path: '404',
          name: 'sign-in-404',
          component: NotFound
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/forgetPassword',
      component: ForgetPassword,
      meta: {
        requiresAuth: true
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 跳转后返回顶部，浏览器前进后退保留原来位置
    if (savedPosition) {
      return savedPosition
    }
    return {
      x: 0,
      y: 0
    }
  }
})
