//基础功能
const BasisList = () => import('Ims/basis/BasisList') // 工艺列表
const basis = [
  {
    path: '/basis/list',
    name: 'basis-list',
    title: '工艺列表',
    component: BasisList
  }
]

export default basis
