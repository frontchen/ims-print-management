import http from '../services/http'
import config from '../config'

// 公共接口
const services = config.apiConfig.commonBase
// body主体
const servicesRaw = JSON.parse(JSON.stringify(services))
servicesRaw.raw = true

const account = {
  // 注册
  register: params => {
    return http.post('users/register/', params, services)
  },
  // 登录
  login: params => {
    return http.post('api/common/system/login', params, { raw: true })
  },
  // 退出
  loginOut: params => {
    return http.post('api/common/system/loginOut', params, { raw: true })
  }
}

export default account
