import unit from '@/services/unit'
const processFlagOptions = [
  {
    label: '加工商',
    value: '1'
  },
  {
    label: '供应商',
    value: '0'
  }
]
//材料表头
const materialName = [
  {
    text: '时间',
    align: 'center',
    sortable: false,
    width: 100,
    value: 'id',
    render: (h, params) => {
      if (unit.isEmptyObject(params.row)) {
        return false
      }
      return h('span', unit.formatDate(params.row.createTime))
    }
  },

  {
    text: '物料编号',
    align: 'center',
    value: 'materialNo'
  },
  {
    text: '物料',
    align: 'center',
    value: 'materialName'
  },
  {
    text: '物料群组',
    align: 'center',
    value: 'materialGroup'
  }
]

//开料尺寸表头
const cutSizeName = [
  {
    text: '时间',
    align: 'center',
    sortable: false,
    width: 100,
    value: 'id',
    render: (h, params) => {
      if (unit.isEmptyObject(params.row)) {
        return false
      }
      return h('span', unit.formatDate(params.row.createTime))
    }
  },

  {
    text: '开料尺寸',
    align: 'center',
    value: 'cutSize'
  }
]
//供应商、加工商表头
const supplierName = [
  {
    text: '供应商编号',
    width: 100,
    align: 'center',
    sortable: false,
    value: 'supplierNo'
  },
  { text: '公司名称', align: 'center', value: 'company' },
  {
    text: '公司地址',
    align: 'center',
    value: 'companyAddress'
  },
  {
    text: '仓库地址',
    align: 'center',
    value: 'depotAddress'
  },
  {
    text: '联系人',
    align: 'center',
    value: 'contact'
  },
  {
    text: '电话',
    align: 'center',
    value: 'telephone'
  },
  {
    text: '备注',
    align: 'center',
    value: 'remark'
  },
  {
    text: '类型',
    align: 'center',
    render: (h, params) => {
      if (unit.isEmptyObject(params.row)) {
        return false
      }
      let processFlag = params.row.processFlag ? '1' : '0'
      let item = processFlagOptions.find(v => v.value === processFlag) || {}
      return h('span', item.label || '')
    }
  },
  // {
  // 	text: '付款方式',
  // 	value: 'paymentMethod',
  // },
  {
    text: '供应商分组',
    align: 'center',
    width: 100,
    value: 'supplierGroup'
  }
]
//工艺表头
const technologyName = [
  {
    text: '时间',
    width: 100,
    align: 'center',
    sortable: false,
    value: 'id',
    render: (h, params) => {
      let row = params.row
      if (unit.isEmptyObject(row)) {
        return false
      }
      return h('span', unit.formatDate(row.createTime || ''))
    }
  },
  { text: '工艺编号', align: 'center', value: 'technologyNo' },
  {
    text: '工艺名称',
    align: 'center',
    value: 'technologyName'
  }
]

export { materialName, cutSizeName, supplierName, technologyName }
