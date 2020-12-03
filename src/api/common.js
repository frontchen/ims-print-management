import http from '../services/http'
import config from '../config'

// 公共接口
const services = config.apiConfig.commonBase

const common = {
  // 上传文件
  upload: params => {
    return http.post(
      'api/uploadList',
      params,
      Object.assign({}, services, { file: true })
    )
  }
}

export default common
