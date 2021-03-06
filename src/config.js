// 发布版本
const version = '1.0.0'
// 发布日期
const bundleVersion = '20191201'

// 服务接口地址
const services = {
  commonBase: {
    url: process.env.VUE_APP_API,
    port: process.env.VUE_APP_API_PORT
  }
}

export default {
  bundleVersion: bundleVersion,
  version: version,
  apiUrl: process.env.VUE_APP_API,
  apiConfig: services
}
