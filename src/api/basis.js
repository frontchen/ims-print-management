import http from '../services/http'
import config from '../config'

// 公共接口
const services = config.apiConfig.commonBase
// body主体
const servicesRaw = JSON.parse(JSON.stringify(services))
servicesRaw.raw = true
const basisPrefix = 'api/common/basic'
const basis = {
  /************************* 审核状态 *************************/
  //获取所有审核状态接口
  checkStatus: params => {
    return http.post(`${basisPrefix}/checkStatus`, params, servicesRaw)
  },
  //获取单个审核状态接口
  checkStatusSingle: params => {
    return http.post(`${basisPrefix}/checkStatusSingle`, params, servicesRaw)
  },
  /************************* 客户信息 *************************/
  //获取所有客户信息接口
  customers: params => {
    return http.post(`${basisPrefix}/customers`, params, servicesRaw)
  },
  //获取单个客户信息接口
  customerSingle: params => {
    return http.post(`${basisPrefix}/customerSingle`, params, servicesRaw)
  },
  //新建客户信息接口
  createCustomer: params => {
    return http.post(`${basisPrefix}/createCustomer`, params, servicesRaw)
  },
  //修改客户信息接口
  updateCustomer: params => {
    return http.post(`${basisPrefix}/updateCustomer`, params, servicesRaw)
  },

  //删除客户信息接口
  delCustomer: params => {
    return http.post(`${basisPrefix}/delCustomer`, params, servicesRaw)
  },
  //审核客户信息接口
  checkCustomer: params => {
    return http.post(`${basisPrefix}/checkCustomer`, params, servicesRaw)
  },
  /************************* 客户分组 *************************/
  //获取所有客户分组接口
  customerGroups: params => {
    return http.post(`${basisPrefix}/customerGroups`, params, servicesRaw)
  },
  //获取单个客户分组接口
  customerGroupSingle: params => {
    return http.post(`${basisPrefix}/customerGroupSingle`, params, servicesRaw)
  },
  //新建客户分组信息接口
  createCustomerGroup: params => {
    return http.post(`${basisPrefix}/createCustomerGroup`, params, servicesRaw)
  },

  //修改客户分组信息接口
  updateCustomerGroup: params => {
    return http.post(`${basisPrefix}/updateCustomerGroup`, params, servicesRaw)
  },
  //删除客户分组信息接口
  delCustomerGroup: params => {
    return http.post(`${basisPrefix}/delCustomerGroup`, params, servicesRaw)
  },
  //审核客户分组信息接口
  checkCustomerGroup: params => {
    return http.post(`${basisPrefix}/checkCustomerGroup`, params, servicesRaw)
  },
  /************************* 开料尺寸 *************************/
  //获取所有开料尺寸接口
  cutSizes: params => {
    return http.post(`${basisPrefix}/cutSizes`, params, servicesRaw)
  },
  //获取单个开料尺寸接口
  cutSizeSingle: params => {
    return http.post(`${basisPrefix}/cutSizeSingle`, params, servicesRaw)
  },
  //新建开料尺寸信息接口
  createCutSize: params => {
    return http.post(`${basisPrefix}/createCutSize`, params, servicesRaw)
  },

  //修改开料尺寸信息接口
  updateCutSize: params => {
    return http.post(`${basisPrefix}/updateCutSize`, params, servicesRaw)
  },
  //删除开料尺寸信息接口
  delCutSize: params => {
    return http.post(`${basisPrefix}/delCutSize`, params, servicesRaw)
  },
  //审核开料尺寸信息接口
  checkCutSize: params => {
    return http.post(`${basisPrefix}/checkCutSize`, params, servicesRaw)
  },
  /************************* 发货方式 *************************/
  //获取所有发货方式接口
  deliveryMethods: params => {
    return http.post(`${basisPrefix}/deliveryMethods`, params, servicesRaw)
  },
  //获取单个发货方式接口
  deliveryMethodSingle: params => {
    return http.post(`${basisPrefix}/deliveryMethodSingle`, params, servicesRaw)
  },
  //新建发货方式信息接口
  createDeliveryMethod: params => {
    return http.post(`${basisPrefix}/createDeliveryMethod`, params, servicesRaw)
  },

  //修改发货方式信息接口
  updateDeliveryMethod: params => {
    return http.post(`${basisPrefix}/updateDeliveryMethod`, params, servicesRaw)
  },
  //删除发货方式信息接口
  delDeliveryMethod: params => {
    return http.post(`${basisPrefix}/delDeliveryMethod`, params, servicesRaw)
  },
  //审核发货方式信息接口
  checkDeliveryMethod: params => {
    return http.post(`${basisPrefix}/checkDeliveryMethod`, params, servicesRaw)
  },
  /************************* 部门 *************************/
  //获取所有部门信息接口
  departments: params => {
    return http.post(`${basisPrefix}/departments`, params, servicesRaw)
  },
  //获取单个部门信息接口
  departmentSingle: params => {
    return http.post(`${basisPrefix}/departmentSingle`, params, servicesRaw)
  },
  //新建部门信息接口
  createDepartment: params => {
    return http.post(`${basisPrefix}/createDepartment`, params, servicesRaw)
  },

  //修改部门信息接口
  updateDepartment: params => {
    return http.post(`${basisPrefix}/updateDepartment`, params, servicesRaw)
  },
  //删除部门信息接口
  delDepartment: params => {
    return http.post(`${basisPrefix}/delDepartment`, params, servicesRaw)
  },
  //审核部门信息接口
  checkDepartment: params => {
    return http.post(`${basisPrefix}/checkDepartment`, params, servicesRaw)
  },
  /************************* 刀版 *************************/
  //获取所有刀版信息接口
  knifePlates: params => {
    return http.post(`${basisPrefix}/knifePlates`, params, servicesRaw)
  },
  //获取单个刀版信息接口
  knifePlateSingle: params => {
    return http.post(`${basisPrefix}/knifePlateSingle`, params, servicesRaw)
  },
  //新建刀版信息接口
  createKnifePlate: params => {
    return http.post(`${basisPrefix}/createKnifePlate`, params, servicesRaw)
  },
  //修改刀版信息接口
  updateKnifePlate: params => {
    return http.post(`${basisPrefix}/updateKnifePlate`, params, servicesRaw)
  },

  //删除刀版信息接口
  delKnifePlate: params => {
    return http.post(`${basisPrefix}/delKnifePlate`, params, servicesRaw)
  },
  //审核刀版信息接口
  checkKnifePlate: params => {
    return http.post(`${basisPrefix}/checkKnifePlate`, params, servicesRaw)
  },
  /************************* 物料 *************************/
  //获取所有物料信息接口
  materials: params => {
    return http.post(`${basisPrefix}/materials`, params, servicesRaw)
  },
  //获取单个物料信息接口
  materialSingle: params => {
    return http.post(`${basisPrefix}/materialSingle`, params, servicesRaw)
  },
  //新建物料信息接口
  createMaterial: params => {
    return http.post(`${basisPrefix}/createMaterial`, params, servicesRaw)
  },
  //修改物料信息接口
  updateMaterial: params => {
    return http.post(`${basisPrefix}/updateMaterial`, params, servicesRaw)
  },

  //删除物料信息接口
  delMaterial: params => {
    return http.post(`${basisPrefix}/delMaterial`, params, servicesRaw)
  },
  //审核物料信息接口
  checkMaterial: params => {
    return http.post(`${basisPrefix}/checkMaterial`, params, servicesRaw)
  },
  /************************* 物料分组 *************************/
  //获取所有物料分组信息接口
  materialGroups: params => {
    return http.post(`${basisPrefix}/materialGroups`, params, servicesRaw)
  },
  //获取单个物料分组信息接口
  materialGroupSingle: params => {
    return http.post(`${basisPrefix}/materialGroupSingle`, params, servicesRaw)
  },
  //新建物料分组信息接口
  createMaterialGroup: params => {
    return http.post(`${basisPrefix}/createMaterialGroup`, params, servicesRaw)
  },
  //修改物料分组信息接口
  updateMaterialGroup: params => {
    return http.post(`${basisPrefix}/updateMaterialGroup`, params, servicesRaw)
  },

  //删除物料分组信息接口
  delMaterialGroup: params => {
    return http.post(`${basisPrefix}/delMaterialGroup`, params, servicesRaw)
  },
  //审核物料分组信息接口
  checkMaterialGroup: params => {
    return http.post(`${basisPrefix}/checkMaterialGroup`, params, servicesRaw)
  },
  /************************* 支付方式 *************************/
  //获取所有支付方式接口
  paymentMethods: params => {
    return http.post(`${basisPrefix}/paymentMethods`, params, servicesRaw)
  },
  //获取单个支付方式接口
  paymentMethodSingle: params => {
    return http.post(`${basisPrefix}/paymentMethodSingle`, params, servicesRaw)
  },
  //新建支付方式接口
  createPaymentMethod: params => {
    return http.post(`${basisPrefix}/createPaymentMethod`, params, servicesRaw)
  },
  //修改支付方式接口
  updatePaymentMethod: params => {
    return http.post(`${basisPrefix}/updatePaymentMethod`, params, servicesRaw)
  },

  //删除支付方式接口
  delPaymentMethod: params => {
    return http.post(`${basisPrefix}/delPaymentMethod`, params, servicesRaw)
  },
  //审核支付方式接口
  checkPaymentMethod: params => {
    return http.post(`${basisPrefix}/checkPaymentMethod`, params, servicesRaw)
  },
  /************************* 员工 *************************/
  //获取所有员工信息接口
  staffs: params => {
    return http.post(`${basisPrefix}/staffs`, params, servicesRaw)
  },
  //获取单个员工接口
  staffSingle: params => {
    return http.post(`${basisPrefix}/staffSingle`, params, servicesRaw)
  },
  //新建员工信息接口
  createStaff: params => {
    return http.post(`${basisPrefix}/createStaff`, params, servicesRaw)
  },
  //修改员工信息接口
  updateStaff: params => {
    return http.post(`${basisPrefix}/updateStaff`, params, servicesRaw)
  },

  //删除员工信息接口
  delStaff: params => {
    return http.post(`${basisPrefix}/delStaff`, params, servicesRaw)
  },
  //审核员工信息接口
  checkStaff: params => {
    return http.post(`${basisPrefix}/checkStaff`, params, servicesRaw)
  },
  /************************* 供应商 *************************/
  //获取所有供应商信息接口
  suppliers: params => {
    return http.post(`${basisPrefix}/suppliers`, params, servicesRaw)
  },
  //获取单个供应商接口
  supplierSingle: params => {
    return http.post(`${basisPrefix}/supplierSingle`, params, servicesRaw)
  },
  //新建供应商信息接口
  createSupplier: params => {
    return http.post(`${basisPrefix}/createSupplier`, params, servicesRaw)
  },
  //修改供应商信息接口
  updateSupplier: params => {
    return http.post(`${basisPrefix}/updateSupplier`, params, servicesRaw)
  },

  //删除供应商信息接口
  delSupplier: params => {
    return http.post(`${basisPrefix}/delSupplier`, params, servicesRaw)
  },
  //审核供应商信息接口
  checkSupplier: params => {
    return http.post(`${basisPrefix}/checkSupplier`, params, servicesRaw)
  },
  /************************* 供应商分组*************************/
  //获取所有供应商分组接口
  supplierGroups: params => {
    return http.post(`${basisPrefix}/supplierGroups`, params, servicesRaw)
  },
  //获取单个供应商分组接口
  supplierGroupSingle: params => {
    return http.post(`${basisPrefix}/supplierGroupSingle`, params, servicesRaw)
  },
  //新建供应商信息接口
  createSupplierGroup: params => {
    return http.post(`${basisPrefix}/createSupplierGroup`, params, servicesRaw)
  },
  //修改供应商信息接口
  updateSupplierGroup: params => {
    return http.post(`${basisPrefix}/updateSupplierGroup`, params, servicesRaw)
  },

  //删除供应商信息接口
  delSupplierGroup: params => {
    return http.post(`${basisPrefix}/delSupplierGroup`, params, servicesRaw)
  },
  //审核供应商信息接口
  checkSupplierGroup: params => {
    return http.post(`${basisPrefix}/checkSupplierGroup`, params, servicesRaw)
  },
  /************************* 工艺*************************/
  //获取所有工艺信息接口
  technologys: params => {
    return http.post(`${basisPrefix}/technologys`, params, servicesRaw)
  },
  //获取单个工艺信息接口
  technologySingle: params => {
    return http.post(`${basisPrefix}/technologySingle`, params, servicesRaw)
  },
  //新建工艺信息接口
  createTechnology: params => {
    return http.post(`${basisPrefix}/createTechnology`, params, servicesRaw)
  },
  //修改工艺信息接口
  updateTechnology: params => {
    return http.post(`${basisPrefix}/updateTechnology`, params, servicesRaw)
  },

  //删除工艺信息接口
  delTechnology: params => {
    return http.post(`${basisPrefix}/delTechnology`, params, servicesRaw)
  },
  //审核工艺信息接口
  checkTechnology: params => {
    return http.post(`${basisPrefix}/checkTechnology`, params, servicesRaw)
  }
}

export default basis
