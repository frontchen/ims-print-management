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
            :right="searchRight"
            @on-right-change="rightChange"
            :values="searchValues"
            ref="search"
          >
          </app-search-bar>
          <div class="white-space"></div>
          <el-tabs v-model="checkedTab" type="card" @tab-click="changeTab">
            <el-tab-pane
              v-cloak
              :label="table.label"
              :name="table.name"
              v-for="(table, i) in tabPaneList"
              :key="i"
            >
              <el-table
                :data="table.data"
                style="width: 100%"
                v-loading="loading"
                height="400"
              >
                <el-table-column
                  v-for="(item, index) in table.columns"
                  :width="item.width"
                  :key="index"
                  :render-header="item.renderHeader"
                  :align="item.align"
                  show-overflow-tooltip
                  :label="item.text"
                  :prop="item.value"
                >
                  <template slot-scope="scope">
                    <Expand
                      v-if="item.render"
                      :row="scope.row || {}"
                      :index="scope.$index"
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
                    :current-page="table.pages.pageIndex"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="table.pages.total"
                  ></el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </app-card>
        <app-modal
          v-loading="modal1.isRequest"
          :loading="modal1.loading"
          :title="modal1.title"
          :labelWidth="modal1.labelWidth"
          :label-position="modal1.labelPosition"
          :width="modal1.width"
          :inline="modal1.inline"
          v-model="modal1.isOpen"
          @on-ok="addSure"
        >
          <el-table
            :data="modal1.data"
            style="width: 100%;margin-bottom:10px;border:1px solid #EBEEF5;"
            v-loading="loading"
            height="160"
          >
            <el-table-column
              v-for="(item, index) in modal1.columns"
              :width="item.width"
              :key="index"
              :render-header="item.renderHeader"
              :align="item.align"
              show-overflow-tooltip
              :label="item.text"
              :prop="item.value"
            >
              <template slot-scope="scope">
                <Expand
                  v-if="item.render"
                  :row="scope.row || {}"
                  :index="scope.$index"
                  :render="item.render"
                ></Expand>
                <span v-else>{{ scope.row[item.value] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-form
            class="work-form"
            :inline="true"
            :rules="modal1.ruleValidate"
            :model="modal1.formValidate"
            size="mini"
            :label-width="'80px'"
            ref="modal1"
          >
            <el-row justify="center" type="flex">
              <el-form-item label="员工" prop="staffName">
                <el-select
                  v-model="modal1.formValidate.staffName"
                  filterable
                  clearable
                  remote
                  v-loadmore="scrollStaffName"
                  :remote-method="queryStaffName"
                  placeholder="员工名称"
                >
                  <el-option
                    v-for="item in modal1.staffName.list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row justify="center" type="flex">
              <el-form-item label="报工数量" prop="renderNum">
                <el-input
                  v-model.trim="modal1.formValidate.renderNum"
                  placeholder="报工数量"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row justify="center" type="flex">
              <el-form-item label="生产日期" prop="renderTime">
                <el-date-picker
                  v-model="modal1.formValidate.renderTime"
                  :picker-options="modal1.pickerOptions"
                  type="date"
                  placeholder="选择生产日期"
                  style="width: 140px"
                >
                </el-date-picker>
              </el-form-item>
            </el-row>
            <el-row justify="center" type="flex">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model.trim="modal1.formValidate.remark"
                  placeholder="备注"
                ></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </app-modal>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import Expand from 'Components/GraphicText/expand'
import { VBtn } from 'vuetify/lib'
export default {
  components: {
    Submenu,
    Expand
  },

  data() {
    return {
      checkedTab: '0',
      isSelectAll: false,
      indeterminate: false,
      checkboxSelection: [],
      searchValues: {},
      searchData: {},
      loading: false,
      rightValue: '',
      searchList: [
        {
          type: 'select',
          name: 'customer',
          value: '',
          disabled: true,
          attr: {
            filterable: true,
            placeholder: '客户名称',
            clearable: true,
            options: [],
            size: 'mini',
            remote: true,
            remoteMethod: query => {
              this.searchBarQuery({
                name: 'customer',
                value: query
              })
            },
            loadMore: this.customerScroll
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
          label: '确认完成',
          name: 'confirmComplete',
          disabled: true,
          attr: {
            disabled: false,
            type: 'confirmComplete',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        },
        {
          type: 'button',
          label: '撤销完成',
          name: 'undoComplate',
          disabled: true,
          attr: {
            disabled: false,
            type: 'undoComplate',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        },
        {
          type: 'button',
          label: '报工',
          name: 'ol',
          disabled: true,
          attr: {
            disabled: false,
            type: 'ol',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        }
      ],
      searchRight: {
        values: {},
        data: [
          {
            type: 'select',
            label: '状态',
            name: 'status',
            width: 100,
            value: '',
            disabled: true,
            attr: {
              clearable: true,
              options: [
                {
                  label: '未完成',
                  value: '0'
                },
                {
                  label: '已完成',
                  value: '1'
                }
              ]
            }
          }
        ]
      },
      breadList: [
        {
          name: '首页',
          path: '/',
          icon: 'el-icon-s-home'
        },
        {
          name: '工单管理',
          path: ''
        },
        {
          name: '工作台',
          path: ''
        }
      ],
      // 新增
      modal1: {
        title: '新增',
        loading: false,
        isRequest: false,
        isOpen: false,
        inline: true,
        width: '540px',
        col: 1,
        labelWidth: '100px',
        labelPosition: 'right',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 86400000
          }
        },
        ruleValidate: {
          staffName: [
            {
              required: true,
              type: 'number',
              message: '员工不能为空',
              trigger: 'change'
            }
          ],
          renderTime: [
            {
              required: true,
              message: '生产日期不能为空',
              trigger: 'blur'
            }
          ],
          renderNum: [
            {
              required: true,
              message: '报工数量不能为空',
              trigger: 'blur'
            },
            {
              trigger: 'blur',
              validator: this.renderNumRule
            }
          ]
        },
        formValidate: {
          staffName: '',
          renderNum: '',
          renderTime: '',
          remark: ''
        },
        staffName: {
          list: []
        },
        data: [],
        columns: [
          {
            text: '员工姓名',
            align: 'center',
            value: 'staffName'
          },
          {
            text: '报工数量',
            align: 'center',
            value: 'renderNum'
          },
          {
            text: '报工时间',
            align: 'center',
            value: 'renderTime'
          },
          {
            text: '备注',
            align: 'center',
            value: 'remark'
          },
          {
            text: '操作',
            width: 80,
            align: 'center',
            render: (h, params) => {
              if (unit.isEmptyObject(params.row)) {
                return false
              }
              return h(
                'span',
                {
                  attrs: {
                    class: 'ims-btn'
                  },
                  on: {
                    click: () => {
                      this.revokeRenderOrderProduceTech(params.row)
                    }
                  }
                },
                '撤销'
              )
            }
          }
        ],
        sendData: {}
      },
      tabPaneList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 1
    }
  },
  async mounted() {
    await this.getTabsList()
    await this.getList()
    this.getCustomerList()
  },
  methods: {
    //搜索栏查询
    getSearch() {},
    // 搜索栏按钮点击
    showModal(type) {
      let vm = this
      if (!vm.checkboxSelection.length) {
        return vm.$message.warning('请勾选一项再操作')
      }
      //报工
      if (type === 'ol') {
        vm.modal1.isOpen = true
        vm.$nextTick(() => {
          vm.$refs.modal1.resetFields()
          vm.getStaffNameList()
          vm.orderProduceTechRenderDetails()
          vm.modal1.sendData = vm.checkboxSelection[0]
        })
      }
      if (['confirmComplete', 'undoComplate'].includes(type)) {
        let content = vm.rightValue === '0' ? '确认完成' : '撤销完成'
        vm.$confirm(`是否${content}该项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.finishOrderProduceTech({
            finishFlag: vm.rightValue === '0' ? 1 : 0
          })
        })
      }
    },
    // 搜索栏select cascader切换事件
    changeSearchList(item) {
      if (item.name === 'customer') {
        this.searchData.customerName = ''
        this.searchData.customerId = item.value
        this.getList(1)
      }
    },
    // 搜索栏select cascader模糊搜索
    searchBarQuery(item) {
      if (item.name === 'customer') {
        this.searchData.customerName = item.value
        if (item.value) {
          this.getCustomerList(1, {
            customerName: item.value
          })
        }
      }
    },
    // 搜索栏客户名称 滚动下拉
    customerScroll() {
      let params = {}
      if (this.searchData.customerName) {
        params.customerName = this.searchData.customerName
      }
      this.getCustomerList(1, params)
    },
    //搜索栏-公司名称下拉列表
    getCustomerList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          pageNo: page,
          pageSize: vm.pageSize,
          technologyId: vm.checkedTab,
          finishFlag: vm.rightValue ? Number(vm.rightValue) : -1,
          ...param
        }
      }
      vm.api.work.orderProduceTeches(params).then(
        res => {
          if (!res) return false
          let list = res.item || []
          let index = vm.searchList.findIndex(v => v.name === 'customer')
          if (index === -1) return
          list = list.map(v => {
            v.label = v.customerName
            v.value = v.customerId
            return v
          })
          list = unit.objectArrayReduce(list, 'value')
          if (page > 1) {
            list = [...vm.searchList[index].attr.options, ...list]
          }
          vm.$set(vm.searchList[index].attr, 'options', list)
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    async rightChange(item) {
      if (item.name === 'status') {
        this.rightValue = item.value
      }
      this.indeterminate = false
      this.isSelectAll = false
      this.checkboxSelection = []
      await this.getTabsList()
      await this.getList()
    },
    changeTab() {
      this.indeterminate = false
      this.isSelectAll = false
      this.checkboxSelection = []
      this.getList(1)
    },
    async getTabsList(param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { ...param }
      }

      vm.loading = true
      let res = await vm.api.basis.technologys(params).catch(err => {
        vm.loading = false
        vm.$message.error(err)
      })
      vm.loading = false
      if (!res) return false
      let list = res.item || []
      let columns = [
        {
          text: '工单号',
          align: 'center',
          sortable: false,
          value: 'orderNo'
        },
        { text: '客户名称', align: 'center', value: 'customerName' },
        {
          text: '印件名称',
          align: 'center',
          value: 'printName'
        },
        {
          text: '刀版',
          align: 'center',
          value: 'knifePlate'
        },
        {
          text: '制版人',
          align: 'center',
          value: 'plateMaker'
        },
        {
          text: '部件',
          align: 'center',
          value: 'producePartName'
        },
        {
          text: '物料',
          align: 'center',
          value: 'materialName'
        },
        {
          text: '开料尺寸',
          align: 'center',
          value: 'cutSizeName'
        },
        {
          text: '工艺',
          value: 'technologyName',
          align: 'center'
        },
        {
          text: '工艺数量',
          value: 'tecNum',
          align: 'center'
        },

        { text: '工艺备注', align: 'center', value: 'tecRemark' },

        {
          text: '审核时间',
          value: 'checkTime',
          align: 'center',
          render: (h, params) => {
            return h('span', unit.formatDate(params.row.checkTime))
          }
        },

        {
          text: '交货日期',
          value: 'deliveryTime',
          align: 'center',
          render: (h, params) => {
            return vm.renderDeliveryTime(h, params)
          }
        },

        {
          text: '操作',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return vm.renderBtn(h, params)
          }
        }
      ]
      if (vm.rightValue) {
        columns.unshift({
          text: '',
          align: 'center',
          width: 55,
          // renderHeader: (h, params) => {
          //   return this.renderCheckedAll(h, params)
          // },
          render: (h, params) => {
            return this.renderCheckedItem(h, params)
          }
        })
      }
      vm.tabPaneList = list.map(item => {
        let tab = {
          label: item.technologyName,
          name: item.id,
          loading: false,
          columns: columns,
          data: [],
          pages: {
            pageIndex: 1,
            total: 0
          }
        }
        return tab
      })
      vm.checkedTab = list[0].id
    },
    async getList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          pageNo: page,
          pageSize: vm.pageSize,
          technologyId: vm.checkedTab,
          finishFlag: vm.rightValue ? Number(vm.rightValue) : -1,
          ...param
        }
      }
      if (vm.searchData.customerId) {
        params.bizContent.customerId = vm.searchData.customerId
      }
      if (vm.searchData.customerName) {
        params.bizContent.customer = vm.searchData.customerName
      }
      if (vm.searchData.startDate) {
        params.bizContent.startDate = vm.searchData.startDate
      }
      if (vm.searchData.endDate) {
        params.bizContent.endDate = vm.searchData.endDate
      }
      vm.loading = true
      switch (vm.rightValue) {
        case '0':
          vm.$refs.search.disableSearch(['undoComplate'])
          break
        case '1':
          vm.$refs.search.disableSearch(['confirmComplete', 'ol'])
          break
        default:
          vm.$refs.search.disableSearch([
            'confirmComplete',
            'undoComplate',
            'ol'
          ])
          break
      }
      let res = await vm.api.work.orderProduceTeches(params).catch(err => {
        vm.loading = false
        vm.$message.error(err)
      })
      vm.loading = false
      if (!res) return false
      let index = vm.tabPaneList.findIndex(v => v.name === vm.checkedTab)
      let list = res.item || []
      list = list.map(v => {
        v._checked = false
        return v
      })
      let pages = {
        total: res.total || 1,
        pageIndex: res.pageNo
      }
      vm.$set(vm.tabPaneList[index], 'data', list)
      vm.$set(vm.tabPaneList[index], 'pages', pages)
    },
    // 条件查询
    goSearch() {},
    getDetail(row) {
      this.$router.push({
        name: 'work-edit',
        params: {
          type: 'edit',
          disabled: true,
          ...row
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.getList(val)
    },
    //确认完成
    async finishOrderProduceTech(param = {}) {
      let vm = this
      let row = vm.checkboxSelection[0]
      let params = {
        reqTime: null,
        bizContent: { produceTechnologyId: row.produceTechnologyId, ...param }
      }
      let res = await vm.api.work.finishOrderProduceTech(params).catch(err => {
        vm.$message.error(err)
      })
      await vm.getList()
      vm.checkboxSelection = []
      vm.isSelectAll = false
      let content = vm.rightValue === '0' ? '确认完成' : '撤销完成'
      vm.$message.success(res.msg || `${content}成功!`)
    },
    scrollStaffName() {},
    queryStaffName() {},
    //新增弹框 获取员工列表
    async getStaffNameList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      let res = await vm.api.basis.staffs(params).catch(err => {
        vm.$message.error(err)
      })
      if (!res) return false
      let list = res.item || []

      list = list.map(v => {
        v.label = v.staffName
        v.value = v.id
        return v
      })
      if (page > 1) {
        list = [...vm.modal1.staffName.list, ...list]
      }
      vm.modal1.staffName.list = list
    },
    // 根据工单工艺id获取工艺报工明细
    orderProduceTechRenderDetails() {
      let vm = this
      let row = vm.checkboxSelection[0]
      let params = {
        reqTime: null,
        bizContent: {
          produceTechnologyId: row.produceTechnologyId
        }
      }
      vm.api.work.orderProduceTechRenderDetails(params).then(
        res => {
          if (!res) return false
          vm.modal1.data = res.item || []
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    renderNumRule(rule, value, callback) {
      if (!unit.posInt.test(value)) {
        return callback(new Error('报工数量为正整数!'))
      }
      let checked = this.checkboxSelection
      if (checked.length) {
        let row = checked[0]
        if (value > row.tecNum) {
          return callback(new Error(`报工数量不能超过${row.tecNum || ''}!`))
        }
      }
      callback()
    },
    //报工
    addSure() {
      let vm = this
      console.log(['123333'])
      vm.$refs.modal1.validate(valid => {
        if (!valid) return false
        let row = vm.checkboxSelection[0]
        let forms = vm.modal1.formValidate
        let staffItem =
          vm.modal1.staffName.list.find(v => v.value === forms.staffName) || {}
        let params = {
          reqtime: unit.formatDate(new Date()),
          bizContent: {
            produceTechnologyId: row.produceTechnologyId, //工单工艺id
            producePartId: row.producePartId, //工单部件id
            produceId: row.produceId, //工单id
            renderNum: forms.renderNum, //本次报工数量
            renderTime: unit.formatDate(forms.renderTime), //报工时间
            staffId: staffItem.value, //员工id
            staffName: staffItem.label, //员工名
            remark: forms.remark //备注
          }
        }
        vm.modal1.loading = true
        vm.api.work.renderOrderProduceTech(params).then(
          res => {
            vm.getList()
            vm.checkboxSelection = []
            vm.isSelectAll = false
            vm.$message.success(res.msg || `报工成功!`)
            vm.modal1.loading = false
            vm.modal1.isOpen = false
          },
          err => {
            vm.modal1.loading = false
            vm.modal1.isOpen = false
            vm.$message.error(err)
          }
        )
      })
    },
    //撤销报工
    revokeRenderOrderProduceTech(row) {
      let vm = this
      let params = {
        reqtime: unit.formatDate(new Date()),
        bizContent: {
          id: row.id //报工明细id
        }
      }
      vm.api.work.revokeRenderOrderProduceTech(params).then(
        () => {
          vm.orderProduceTechRenderDetails()
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    // 列表标题勾选框 （全选）
    renderCheckedAll(h) {
      let vm = this
      return h('el-checkbox', {
        props: {
          value: vm.isSelectAll,
          disabled: false,
          indeterminate: vm.indeterminate
        },
        on: {
          change: checked => {
            vm.isSelectAll = checked
            let index = vm.tabPaneList.findIndex(v => v.name === vm.checkedTab)
            let data = unit.cloneDeep(vm.tabPaneList[index].data)
            let checkedArr = []
            data.forEach(v => {
              if (!unit.isEmptyObject(v)) {
                v._checked = checked
                if (checked) {
                  checkedArr.push(v)
                }
              }
            })
            vm.checkboxSelection = checkedArr
            vm.$set(vm.tabPaneList[index], 'data', data)
          }
        }
      })
    },
    // 列表显示勾选框
    renderCheckedItem(h, params) {
      let vm = this
      if (unit.isEmptyObject(params.row)) {
        return false
      }
      let index = vm.tabPaneList.findIndex(v => v.name === vm.checkedTab)
      let tableData = vm.tabPaneList[index].data

      return h('el-checkbox', {
        props: {
          value: params.row._checked,
          disabled: params.row._disabled
        },
        on: {
          change: checked => {
            let data = unit.cloneDeep(tableData)
            data = data.map(v => {
              if (!unit.isEmptyObject(v)) {
                v._checked = false
              }
              return v
            })
            data[params.index]._checked = checked
            let checkedArr = []
            data.forEach(v => {
              if (!unit.isEmptyObject(v)) {
                if (v._checked) {
                  checkedArr.push(v)
                }
              }
            })
            vm.checkboxSelection = checkedArr
            vm.isSelectAll = false
            vm.indeterminate = false
            if (checkedArr.length) {
              vm.indeterminate = true
            }
            if (
              checkedArr.length ===
              data.filter(v => !unit.isEmptyObject(v)).length
            ) {
              vm.isSelectAll = true
              vm.indeterminate = false
            }
            vm.$set(vm.tabPaneList[index], 'data', data)
          }
        }
      })
    },
    // 列表显示发货时间
    renderDeliveryTime(h, params) {
      let row = params.row
      if (unit.isEmptyObject(row)) {
        return false
      }
      return h('span', unit.formatDate(row.deliveryDate || ''))
    },

    renderBtn(h, params) {
      let vm = this
      let row = params.row
      if (unit.isEmptyObject(row)) {
        return false
      }
      // let btnList=['确认完成','报工','工单']

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
                span: 24
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
                      vm.getDetail(row)
                    }
                  }
                },
                '工单'
              )
            ]
          )
        ]
      )
    }
  }
}
</script>
