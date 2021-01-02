<template>
  <div style="padding-top: 24px">
    <v-container fluid grid-list-xl py-0>
      <v-layout row wrap>
        <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <Submenu :breadList="breadList" />
          <div class="white-space"></div>
          <app-search-bar
            :data="searchList"
            @on-search="getSearch"
            @on-button="showModal"
            @on-change="changeSearchList"
            :values="searchValues"
          >
          </app-search-bar>
          <div class="white-space"></div>
          <div class="basis-container">
            <div class="left">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                node-key="id"
                @node-click="nodeClickItem"
                empty-text="暂无数据"
                :expand-on-click-node="true"
                :render-content="renderContent"
              >
              </el-tree>
            </div>
            <div class="right">
              <el-table
                v-loading="loading"
                :data="items"
                style="width: 100%"
                height="400"
              >
                <el-table-column
                  v-for="(item, index) in headers"
                  :width="item.width"
                  :key="index"
                  :align="item.align"
                  show-overflow-tooltip
                  :label="item.text"
                  :prop="item.value"
                >
                  <template slot-scope="scope">
                    <Expand
                      v-if="item.render"
                      :row="scope.row || {}"
                      :index="scope.index"
                      :render="item.render"
                    ></Expand>
                    <span v-else>{{ scope.row[item.value] }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex">
                <el-col :span="13"></el-col>
                <el-col :span="11">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination>
                </el-col>
              </el-row>
            </div>
          </div>
        </app-card>
        <!-- 新增 -->
        <app-modal
          v-loading="modal1.isRequest"
          :loading="modal1.loading"
          :title="modal1.title"
          :labelWidth="modal1.labelWidth"
          :label-position="modal1.labelPosition"
          :width="modal1.width"
          :inline="modal1.inline"
          v-model="modal1.isOpen"
          :col="modal1.col"
          :data="modal1.data"
          :values="modal1.values"
          @on-ok="addSure"
          @on-change="selectChange"
          :ruleValidate="modal1.ruleValidate"
          ref="modal1"
        ></app-modal>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import Expand from 'Components/GraphicText/expand'
import { VBtn } from 'vuetify/lib'
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
export default {
  components: {
    Submenu,
    Expand
  },

  data() {
    return {
      loading: false,
      searchValues: {},
      searchData: {},
      searchList: [
        {
          type: 'select',
          name: 'company',
          value: '',
          disabled: true,
          attr: {
            filterable: true,
            placeholder: '供应商名称',
            clearable: true,
            options: [],
            size: 'mini',
            hasMore: false,
            pageIndex: 1,
            remote: true,
            remoteMethod: query => {
              this.searchBarQuery({
                name: 'company',
                value: query
              })
            },
            loadMore: this.companyScroll
          }
        },
        {
          type: 'datepicker',
          name: 'date',
          value: [],
          disabled: true,
          attr: {
            placeholder: '请选择',
            type: 'daterange',
            size: 'mini'
          }
        },
        {
          type: 'button',
          label: '新增',
          name: 'add',
          disabled: true,
          attr: {
            disabled: false,
            type: 'add',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        }
        // {
        // 	type: 'button',
        // 	label: '审批',
        // 	name: 'approval',
        // 	disabled: true,
        // 	attr: {
        // 		disabled: false,
        // 		type: 'approval',
        // 		buttonType: 'primary',
        // 		icon: 'el-icon-edit',
        // 	},
        // },
      ],

      breadList: [
        {
          name: '首页',
          path: '/',
          icon: 'el-icon-s-home'
        },
        {
          name: '基础功能',
          path: ''
        },
        {
          name: '供应商列表',
          path: ''
        }
      ],
      headers: [
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
            let item =
              processFlagOptions.find(v => v.value === processFlag) || {}
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
        },
        // {
        // 	text: '账期天数',
        // 	value: 'accountDays',
        // },
        // {
        // 	text: '邮箱',
        // 	value: 'email',
        // },
        {
          text: '操作',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return this.renderBtn(h, params)
          }
        }
      ],
      items: [],
      defaultProps: {
        children: 'sonGroups',
        label: 'groupName'
      },
      treeData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 1,
      // 新增
      modal1: {
        title: '新增',
        loading: false,
        isRequest: false,
        isOpen: false,
        inline: true,
        width: '600px',
        col: 2,
        labelWidth: '100px',
        labelPosition: 'right',
        values: {},
        ruleValidate: {
          processFlag: [
            {
              required: true,
              type: 'string',
              message: '类型不能为空',
              trigger: 'change'
            }
          ],
          supplierGroup: [
            {
              required: true,
              type: 'array',
              message: '群组名称不能为空',
              trigger: 'change',
              min: 1
            }
          ],
          telephone: [
            {
              required: true,
              type: 'string',
              message: '电话不能为空',
              trigger: 'blur'
            },
            {
              pattern: unit.mobile,
              type: 'string',
              message: '电话格式不正确',
              trigger: 'blur'
            }
          ],
          company: [
            {
              required: true,
              type: 'string',
              message: '公司名称不能为空',
              trigger: 'blur'
            }
          ],
          contact: [
            {
              required: true,
              type: 'string',
              message: '联系人不能为空',
              trigger: 'blur'
            }
          ],
          companyAddress: [
            {
              type: 'string',
              message: '公司地址不能为空',
              trigger: 'blur'
            }
          ]
          // paymentMethod: [
          // 	{
          // 		required: true,
          // 		type: 'number',
          // 		message: '付款方式不能为空',
          // 		trigger: 'change',
          // 	},
          // ],
          // email: [
          // 	{
          // 		type: 'email',
          // 		message: '邮箱格式不正确',
          // 		trigger: 'blur',
          // 	},
          // ],
          // accountDays: [
          // 	{
          // 		pattern: unit.posInt,
          // 		type: 'number',
          // 		message: '账期天数格式不正确',
          // 		trigger: 'blur',
          // 	},
          // ],
        },
        sendData: {}, // 修改联系信息暂存数据
        data: [
          {
            type: 'cascader',
            label: '群组名称',
            name: 'supplierGroup',
            value: [],
            attr: {
              clearable: true,
              placeholder: '请选择群组名称',
              data: [],
              filterable: true,
              disabled: false,
              showAllLevels: false,
              props: {
                label: 'groupName',
                children: 'sonGroups',
                value: 'id',
                checkStrictly: true
              }
            }
          },
          {
            type: 'input',
            label: '公司名称',
            name: 'company',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入公司名称',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'input',
            label: '供应商编号',
            name: 'supplierNo',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入供应商编号',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'select',
            label: '类型',
            name: 'processFlag',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请选择类型',
              filterable: true,
              disabled: false,
              options: processFlagOptions
            }
          },
          {
            type: 'input',
            label: '电话',
            name: 'telephone',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入电话',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'input',
            label: '联系人',
            name: 'contact',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入联系人',
              filterable: true,
              disabled: false
            }
          },
          // {
          // 	type: 'select',
          // 	label: '付款方式',
          // 	name: 'paymentMethod',
          // 	value: '',
          // 	attr: {
          // 		clearable: true,
          // 		placeholder: '请选择付款方式',
          // 		options: [],
          // 		filterable: true,
          // 		disabled: false,
          // 	},
          // },
          {
            type: 'input',
            label: '公司地址',
            name: 'companyAddress',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入公司地址',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'input',
            label: '仓库地址',
            name: 'depotAddress',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入仓库地址',
              filterable: true,
              disabled: false
            }
          },
          // {
          // 	type: 'input',
          // 	label: '账期天数',
          // 	name: 'accountDays',
          // 	value: '',
          // 	attr: {
          // 		clearable: true,
          // 		placeholder: '请输入账期天数',
          // 		filterable: true,
          // 		disabled: false,
          // 	},
          // },
          // {
          // 	type: 'input',
          // 	label: '邮箱',
          // 	name: 'email',
          // 	value: '',
          // 	attr: {
          // 		clearable: true,
          // 		placeholder: '请输入邮箱',
          // 		filterable: true,
          // 		disabled: false,
          // 	},
          // },

          {
            type: 'input',
            label: '备注',
            name: 'remark',
            value: '',
            attr: {
              type: 'textarea',
              maxlength: 120,
              minlength: 1,
              clearable: true,
              placeholder: '请输入备注',
              filterable: true,
              disabled: false
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getList()
    this.getSupplierGroup()
    this.getCompanyList()
  },
  methods: {
    //搜索栏查询
    getSearch(val) {
      if (val) {
        let [startDate, endDate] = val.date
        startDate = startDate ? unit.formatDate(startDate) : ''
        endDate = endDate ? unit.formatDate(endDate) : ''
        this.searchData.startDate = startDate
        this.searchData.endDate = endDate
        this.searchData.companyId = val.company
        this.getList(1)
      }
    },
    // 搜索栏按钮点击
    showModal(type, row) {
      let vm = this
      if (type === 'add' || type === 'modify') {
        vm.showAddModifyModal(type, row)
      }
    },
    async showAddModifyModal(type, row) {
      let vm = this
      if (type === 'add') {
        vm.modal1.title = '新增'
      }
      vm.modal1.isOpen = true
      await vm.getSupplierGroupList()
      vm.$nextTick(() => {
        vm.$refs.modal1.resetFields()
        if (type === 'add') {
          vm.modal1.values = {
            supplierGroup: '',
            supplierNo: '', //供应商编号
            company: '', //公司名
            telephone: '', //电话
            contact: '', //联系人
            remark: '', //备注
            companyAddress: '', //公司地址
            depotAddress: '', //仓库地址
            processFlag: '0'
          }
        }
        if (type === 'modify') {
          vm.modal1.sendData = row
          vm.modal1.title = '修改'
          //客户群组
          let customerGroupData = vm.modal1.data.find(
            v => v.name === 'supplierGroup'
          )
          customerGroupData = customerGroupData
            ? customerGroupData.attr.data
            : []
          let customerGroupChecked = unit.getCascaderValue(
            customerGroupData,
            row.customerGroupId,
            {
              children: 'sonGroups',
              value: 'id'
            }
          )
          //类型
          let processFlag = row.processFlag ? '1' : '0'
          let processFlagItem =
            processFlagOptions.find(v => v.value === processFlag) || {}
          vm.modal1.values = {
            //客户分组
            supplierGroup: customerGroupChecked,
            supplierNo: row.supplierNo, //供应商编号
            company: row.company, //公司名
            telephone: row.telephone, //电话
            contact: row.contact, //联系人
            remark: row.remark, //备注
            companyAddress: row.companyAddress, //公司地址
            depotAddress: row.depotAddress, //仓库地址
            processFlag: processFlagItem.value
            // paymentMethod: row.paymentId, //付款方式
            // accountDays: row.accountDays, //账期天数
            // email: row.email, //邮箱
          }
        }
      })
    },
    //新增弹框 获取群组名称下拉列表
    async getSupplierGroupList(param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          ...param
        }
      }
      let res = await vm.api.basis.supplierGroups(params).catch(err => {
        vm.$message.error(err)
      })
      if (!res) {
        return false
      }
      let index = vm.modal1.data.findIndex(v => v.name === 'supplierGroup')
      if (index === -1) return false
      vm.$nextTick(() => {
        vm.$set(vm.modal1.data[index].attr, 'data', res.item || [])
      })
    },

    // 搜索栏select cascader切换事件
    changeSearchList(item) {
      if (item.name === 'company') {
        this.searchData.companyName = ''
        this.searchData.companyId = item.value
        this.getList(1)
      }
    },
    // 搜索栏select cascader模糊搜索
    searchBarQuery(item) {
      if (item.name === 'company') {
        this.searchData.companyName = item.value
        this.getCompanyList(1, {
          company: item.value
        })
      }
    },
    // 搜索栏客户名称 滚动下拉
    companyScroll() {
      let params = {}
      let index = this.searchList.findIndex(v => v.name === 'company')
      let select = this.searchList[index]
      if (!select) return false
      if (!select.attr.hasMore) {
        return false
      }
      select.attr.pageIndex += 1
      if (this.searchData.companyName) {
        params.company = this.searchData.companyName
      }
      this.getCompanyList(select.attr.pageIndex, params)
    },
    //点击tree节点 每一级触发
    nodeClickItem(data) {
      this.getList(1, {
        supplierGroupId: data.id
      })
    },
    //列表查询
    getList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          pageNo: page,
          pageSize: vm.pageSize,
          processFlag: -1,
          ...param
        }
      }
      if (vm.searchData.companyId) {
        params.bizContent.id = vm.searchData.companyId
      }
      if (vm.searchData.companyName) {
        params.bizContent.company = vm.searchData.companyName
      }
      if (vm.searchData.startDate) {
        params.bizContent.startDate = vm.searchData.startDate
      }
      if (vm.searchData.endDate) {
        params.bizContent.endDate = vm.searchData.endDate
      }
      vm.loading = true
      vm.api.basis.suppliers(params).then(
        res => {
          vm.loading = false
          if (!res) return false
          let list = res.item || []
          vm.items = list
          vm.total = res.total || 1
          vm.pageIndex = res.pageNo
        },
        err => {
          vm.loading = false
          vm.$message.error(err)
        }
      )
    },
    //搜索栏-公司名称下拉列表
    getCompanyList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      vm.api.basis.suppliers(params).then(
        res => {
          if (!res) return false
          let list = res.item || []
          let index = vm.searchList.findIndex(v => v.name === 'company')
          if (index === -1) return
          list = list.map(v => {
            v.label = v.company
            v.value = v.id
            return v
          })
          list = unit.objectArrayReduce(list, 'value')
          let hasMore = res.total < res.pageSize ? false : true
          if (page > 1) {
            list = [...vm.searchList[index].attr.options, ...list]
          }
          vm.$set(vm.searchList[index].attr, 'options', list)
          vm.$set(vm.searchList[index].attr, 'hasMore', hasMore)
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    async getSupplierGroup(param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          ...param
        }
      }
      let res = await vm.api.basis.supplierGroups(params).catch(err => {
        vm.$message.error(err)
      })
      if (!res) {
        return false
      }
      vm.$nextTick(() => {
        vm.treeData = res.item || []
      })
    },
    delSupplier(row) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { id: row.id }
      }
      vm.api.basis.delSupplier(params).then(
        () => {
          vm.getList()
          vm.$message.success('删除成功!')
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.getList(val)
    },
    addSure(values) {
      let vm = this
      vm.$refs.modal1.validate(valid => {
        if (!valid) return false
        //客户群组
        let supplierGroupData = vm.modal1.data.find(
          v => v.name === 'supplierGroup'
        )
        supplierGroupData = supplierGroupData ? supplierGroupData.attr.data : []
        let supplierGroupItem = unit.getCascaderData(
          values.supplierGroup,
          supplierGroupData,
          {
            children: 'sonGroups',
            value: 'id'
          }
        )
        supplierGroupItem = supplierGroupItem.length
          ? supplierGroupItem[supplierGroupItem.length - 1]
          : {}

        let params = {
          reqtime: unit.formatDate(new Date()),
          bizContent: {
            supplierGroupId: supplierGroupItem.id, //供应商分组
            supplierGroup: supplierGroupItem.groupName,
            supplierNo: values.supplierNo, //供应商编号
            company: values.company, //公司名
            telephone: values.telephone, //电话
            contact: values.contact, //联系人
            remark: values.remark, //备注
            companyAddress: values.companyAddress, //公司地址
            depotAddress: values.depotAddress, //仓库地址
            processFlag: Number(values.processFlag) //类别
            // paymentId: paymentMethodItem.value, //付款方式
            // paymentMethod: paymentMethodItem.label,
            // accountDays: values.accountDays, //账期天数
            // email: values.email, //邮箱
          }
        }
        let row = vm.modal1.sendData
        let path = 'createSupplier'
        if (vm.modal1.title === '新增') {
          path = 'createSupplier'
        }
        if (vm.modal1.title === '修改') {
          path = 'updateSupplier'
          params.bizContent.id = row.id
        }
        vm.api.basis[path](params).then(
          () => {
            vm.getList()
            vm.$message.success('操作成功!')
            vm.modal1.isOpen = false
          },
          err => {
            vm.$message.error(err)
          }
        )
      })
    },
    selectChange() {},

    renderBtn(h, params) {
      let vm = this
      let row = params.row
      if (unit.isEmptyObject(row)) {
        return false
      }
      return h(
        'el-row',
        {
          props: {
            type: 'flex',
            align: 'middle',
            justify: 'space-between'
          }
        },
        [
          h(
            'el-col',
            {
              props: {
                span: 12
              }
            },
            [
              h(
                VBtn,
                {
                  props: {
                    small: true,
                    color: '#0099FF',
                    dark: true
                  },
                  on: {
                    click: () => {
                      vm.$confirm('是否删除该项?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      })
                        .then(() => {
                          vm.delSupplier(row)
                        })
                        .catch(() => {
                          vm.$message({
                            type: 'info',
                            message: '已取消删除'
                          })
                        })
                    }
                  }
                },
                '删除'
              )
            ]
          ),
          h(
            'el-col',
            {
              props: {
                span: 12
              }
            },
            [
              h(
                VBtn,
                {
                  props: {
                    small: true,
                    color: '#0099FF',
                    dark: true
                  },
                  on: {
                    click: () => {
                      vm.showModal('modify', row)
                    }
                  }
                },
                '编辑'
              )
            ]
          )
        ]
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import './css/container.less';
</style>
