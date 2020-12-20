//基础功能
const BasisCraftList = () => import('Ims/basis/BasisCraftList') // 工艺列表
const BasisCustomerGroup = () => import('Ims/basis/BasisCustomerGroup') // 客户群组名称
const BasisCustomer = () => import('Ims/basis/BasisCustomer') // 客户列表
const BasisPaymentMethod = () => import('Ims/basis/BasisPaymentMethod') // 付款方式
const BasisCutSize = () => import('Ims/basis/BasisCutSize') // 开料尺寸
const BasisDepartment = () => import('Ims/basis/BasisDepartment') // 部门列表
const BasisKnifePlate = () => import('Ims/basis/BasisKnifePlate') // 刀版
const BasisMaterial = () => import('Ims/basis/BasisMaterial') // 物料
const BasisMaterialGroup = () => import('Ims/basis/BasisMaterialGroup') // 物料群组
const BasisSupplier = () => import('Ims/basis/BasisSupplier') // 供应商
const BasisSupplierGroup = () => import('Ims/basis/BasisSupplierGroup') // 供应商群组
const basis = [
  {
    path: '/basis/craftList',
    name: 'basis-craftList',
    title: '工艺列表',
    component: BasisCraftList
  },
  {
    path: '/basis/customerGroup',
    name: 'basis-customerGroup',
    title: '客户群组',
    component: BasisCustomerGroup
  },
  {
    path: '/basis/customer',
    name: 'basis-customer',
    title: '客户列表',
    component: BasisCustomer
  },
  {
    path: '/basis/paymentMethod',
    name: 'basis-paymentMethod',
    title: '付款方式列表',
    component: BasisPaymentMethod
  },
  {
    path: '/basis/cutSize',
    name: 'basis-cutSize',
    title: '开料尺寸',
    component: BasisCutSize
  },
  {
    path: '/basis/department',
    name: 'basis-department',
    title: '部门列表',
    component: BasisDepartment
  },
  {
    path: '/basis/knifePlate',
    name: 'basis-knifePlate',
    title: '刀版',
    component: BasisKnifePlate
  },
  {
    path: '/basis/material',
    name: 'basis-material',
    title: '物料',
    component: BasisMaterial
  },
  {
    path: '/basis/materialGroup',
    name: 'basis-materialGroup',
    title: '物料群组',
    component: BasisMaterialGroup
  },
  {
    path: '/basis/supplier',
    name: 'basis-supplier',
    title: '供应商列表',
    component: BasisSupplier
  },
  {
    path: '/basis/supplierGroup',
    name: 'basis-supplierGroup',
    title: '供应商群组',
    component: BasisSupplierGroup
  }
]

export default basis
