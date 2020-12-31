import http from '../services/http'
import config from '../config'

// 工单管理
const services = config.apiConfig.commonBase
// body主体
const servicesRaw = JSON.parse(JSON.stringify(services))
servicesRaw.raw = true
const workPrefix = 'api/common/plan'
const work = {
  /************************* 工单管理 *************************/
  //获取所有工单信息接口
  orderProduces: params => {
    return http.post(`${workPrefix}/orderProduces`, params, servicesRaw)
  },
  //获取单个工单信息接口
  orderProduceSingle: params => {
    return http.post(`${workPrefix}/orderProduceSingle`, params, servicesRaw)
  },
  //新建工单信息信息接口
  createOrderProduce: params => {
    return http.post(`${workPrefix}/createOrderProduce`, params, servicesRaw)
  },

  //修改工单信息信息接口
  updateOrderProduce: params => {
    return http.post(`${workPrefix}/updateOrderProduce`, params, servicesRaw)
  },
  //删除工单信息信息接口
  delOrderProduce: params => {
    return http.post(`${workPrefix}/delOrderProduce`, params, servicesRaw)
  },
  //审核工单信息信息接口
  checkOrderProduce: params => {
    return http.post(`${workPrefix}/checkOrderProduce`, params, servicesRaw)
  },
  /************************* 工作台 *************************/
  //根据工艺获取工作台列表
  orderProduceTeches: params => {
    return http.post(`${workPrefix}/orderProduceTeches`, params, servicesRaw)
  },
  //完成工单、撤销工单 工艺信息 1完成 0撤销
  finishOrderProduceTech: params => {
    return http.post(
      `${workPrefix}/finishOrderProduceTech`,
      params,
      servicesRaw
    )
  },
  //获取工艺报工明细 参数 produceTechnologyId 工单工艺ID
  orderProduceTechRenderDetails: params => {
    return http.post(
      `${workPrefix}/orderProduceTechRenderDetails`,
      params,
      servicesRaw
    )
  },
  //汇报工单工艺信息
  renderOrderProduceTech: params => {
    return http.post(
      `${workPrefix}/renderOrderProduceTech`,
      params,
      servicesRaw
    )
  },
  //撤销汇报工单工艺信息 参数 "id":报工明细id
  revokeRenderOrderProduceTech: params => {
    return http.post(
      `${workPrefix}/revokeRenderOrderProduceTech`,
      params,
      servicesRaw
    )
  }
}

export default work
