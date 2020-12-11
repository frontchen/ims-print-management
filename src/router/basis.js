//基础功能
const BasisList = () => import('Ims/basis/BasisList') // 工艺列表
const BasisGroup = () => import('Ims/basis/BasisGroup') // 群组名称
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
  }
]

export default basis
