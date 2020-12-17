//基础功能
const BasisList = () => import('Ims/basis/BasisList') // 工艺列表
const BasisGroup = () => import('Ims/basis/BasisGroup') // 群组名称
const BasisCustomer = () => import('Ims/basis/BasisCustomer') // 客户列表
const BasisPaymentMethod = () => import('Ims/basis/BasisPaymentMethod') // 付款方式
const BasisCutSize = () => import('Ims/basis/BasisCutSize') // 开料尺寸
const BasisDepartment = () => import('Ims/basis/BasisDepartment') // 部门列表
const BasisKnifePlate = () => import('Ims/basis/BasisKnifePlate') // 刀版
const BasisMaterial = () => import('Ims/basis/BasisMaterial') // 物料
const basis = [
  {
    path: '/basis/list',
    name: 'basis-list',
    title: '工艺列表',
    component: BasisList
  },
  {
    path: '/basis/group',
    name: 'basis-group',
    title: '客户群组',
    component: BasisGroup
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
  }
]

export default basis
