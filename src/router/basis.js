//基础功能
const BasisList = () => import('Ims/basis/BasisList') // 工艺列表
const BasisGroup = () => import('Ims/basis/BasisGroup') // 群组名称
const BasisCustomer = () => import('Ims/basis/BasisCustomer') // 客户列表
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
  }
]

export default basis
