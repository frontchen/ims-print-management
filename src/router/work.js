//工单管理
const WorkList = () => import('Ims/work/WorkList') // 工单列表
const WorkAdd = () => import('Ims/work/WorkAdd') // 工单新增
const WorkBench = () => import('Ims/work/WorkBench') // 工作台
const work = [
  {
    path: '/work/list',
    name: 'work-list',
    title: '工单列表',
    component: WorkList
  },
  {
    path: '/work/add',
    name: 'work-add',
    title: '工单新增',
    component: WorkAdd
  },
  {
    path: '/work/edit',
    name: 'work-edit',
    title: '工单编辑',
    component: WorkAdd
  },
  {
    path: '/work/bench',
    name: 'work-bench',
    title: '工作台',
    component: WorkBench
  }
]

export default work
