import axios from 'axios'
import querystring from 'querystring'
import store from '../store/index'
// 错误提示
const networkErr = '网络请求超时'

const apiBaseURL = process.env.VUE_APP_API_BASEURL
// const baseURL = process.env.VUE_APP_API_BASEURL  // 代理模式
const baseURL = `${process.env.VUE_APP_API}:${process.env.VUE_APP_API_PORT}${process.env.VUE_APP_API_BASEURL}`

let instance = axios.create({
  timeout: 15 * 1000, // 请求超时时间设置 15s
  withCredentials: false, //  带cookie请求
  baseURL: baseURL
  // headers: { 'Content-Type': '' }
})

// request 拦截器
instance.interceptors.request.use(
  config => {
    let token = store.state.account.token || ''
    if (token) {
      config.headers.token = `${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// response 拦截器
instance.interceptors.response.use(
  res => {
    return res
  },
  err => {
    if (err.response) {
      if (err.response.status === -1) {
        // 无权限，超时
        store.dispatch('account/logout')
      }
    }
    const data = err.response.data
    let msg = data.detail
    if (!msg) {
      msg = data.non_field_errors.join(' ')
    }
    if (!msg) {
      msg = err.msg
    }
    return Promise.reject(msg)
  }
)

const http = {
  formatData: res => {
    return new Promise((resolve, reject) => {
      if (res.status === 200) {
        let data = res.data.data || res.data
        if (res.data.code * 1 === 200) {
          return resolve(data)
        }
        return reject(res.data.msg || networkErr)
      } else {
        return reject(res.statusText)
      }
    })
  },
  get: (path, params, config) => {
    return new Promise((resolve, reject) => {
      if (!config) {
        config = { url: '', port: 80 }
      }
      let apiUrl = path
      if (config.url) {
        apiUrl = `${config.url}:${config.port}${apiBaseURL}${path}`
      }
      instance.get(apiUrl, { params }).then(
        res => {
          http.formatData(res).then(resolve, reject)
        },
        err => {
          return reject(err || networkErr)
        }
      )
    })
  },
  methods: (method, path, params, config) => {
    return new Promise((resolve, reject) => {
      if (!config) {
        config = { url: '', port: 80, raw: false, file: false }
      }
      let data = params
      let headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
      if (config.file) {
        headers['Content-type'] = 'multipart/form-data;'
      } else if (!config.raw) {
        data = querystring.stringify(params)
        headers['Content-type'] = 'application/x-www-form-urlencoded'
      }
      let apiUrl = path
      if (config.url) {
        apiUrl = `${config.url}:${config.port}${apiBaseURL}${path}`
      }
      instance[method](apiUrl, data, { headers }).then(
        res => {
          http.formatData(res).then(resolve, reject)
        },
        err => {
          return reject(err || networkErr)
        }
      )
    })
  },
  patch: (path, params, config) => {
    return http.methods('patch', path, params, config)
  },
  post: (path, params, config) => {
    return http.methods('post', path, params, config)
  }
}

export default http
