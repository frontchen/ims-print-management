import _ from 'lodash'
import CryptoJS from 'crypto-js'

const unit = {
  // des加密
  desEncrypt: (str, key) => {
    return CryptoJS.DES.encrypt(str, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
  },
  // des 解密
  desDecrypt: (str, key) => {
    return CryptoJS.DES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)
  },
  // 对象拷贝
  cloneDeep: obj => {
    if (!obj) {
      return ''
    }
    return _.cloneDeep(obj)
  },

  // 判断是否空对象
  isEmptyObject: val => {
    let obj = unit.cloneDeep(val)
    delete obj._index
    delete obj._rowKey
    for (let key in obj) {
      return false
    }
    return true
  },
  // 平级数据递归树结构
  getTreeData(
    list,
    { expand = true, title = 'title', id = 'id', pid = 'parentId' }
  ) {
    // 删除 所有 children,以防止多次调用
    list.forEach(v => {
      delete v.children
    })
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    let map = {}

    list.forEach(v => {
      if (typeof title === 'string') {
        v.title = title
      } else {
        let name = title
          .map(key => {
            return v[key]
          })
          .join(' ')
        v.title = name
      }
      v.expand = expand
      map[v[id]] = v
    })
    let val = []
    list.forEach(v => {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      let parent = map[v[pid]]
      if (parent) {
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        parent.children = parent.children || []
        parent.children.push(v)
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(v)
      }
    })
    return val
  },
  // 级联数据，select多选 label in value
  getCheckListData: (checkList, dataList, type) => {
    // 递归级联数据
    let values = []

    function getList(clist, dlist) {
      for (let i = 0; i < clist.length; i++) {
        let index = dlist.findIndex(val => {
          return val.value === clist[i]
        })
        if (index >= 0) {
          values.push(dlist[index])
          clist.splice(i, 1)
          if (type === 'cascader') {
            dlist = dlist[index].children
          }
          if (dlist && dlist.length > 0) {
            getList(clist, dlist)
          }
          return false
        }
      }
    }
    getList(checkList, dataList)
    return values
  },
  // 级联数据 label in value
  getCascaderData: (checkList, dataList) => {
    let clist = unit.cloneDeep(checkList)
    let dlist = unit.cloneDeep(dataList)
    return unit.getCheckListData(clist, dlist, 'cascader')
  },
  // select多选 label in value
  getSelectData: (checkList, dataList) => {
    let clist = unit.cloneDeep(checkList)
    let dlist = unit.cloneDeep(dataList)
    return unit.getCheckListData(clist, dlist, 'select')
  },
  // 根据选中的最后一项，获取选中的值
  getCascaderValue: (list, value) => {
    let clist = unit.cloneDeep(list)
    let find = false
    let checked = []
    function getList(list, depth) {
      for (let i = 0; i < list.length; i++) {
        if (find) {
          return false
        }
        let v = list[i]
        checked[depth] = v.value
        if (v.value === value) {
          find = true
          checked = checked.slice(0, depth + 1)
          return false
        }
        if (v.children && v.children.length) {
          getList(v.children, depth + 1)
        }
      }
    }
    getList(clist, 0)
    return checked
  }
}
export default unit
