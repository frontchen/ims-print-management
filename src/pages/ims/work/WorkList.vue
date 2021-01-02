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
          <el-tabs v-model="checkedTab" type="card" @tab-click="changeTab">
            <el-tab-pane
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
      checkboxSelection: [],
      searchValues: {},
      searchData: {},
      loading: false,
      searchList: [
        {
          type: 'select',
          name: 'customer',
          value: '',
          width: 140,
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
          label: '新增',
          name: 'add',
          disabled: true,
          attr: {
            disabled: false,
            type: 'add',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        },
        {
          type: 'button',
          label: '审批',
          name: 'approval',
          disabled: true,
          attr: {
            disabled: false,
            type: 'approval',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        },
        {
          type: 'button',
          label: '删除',
          name: 'del',
          disabled: true,
          attr: {
            disabled: false,
            type: 'del',
            buttonType: 'primary',
            icon: 'el-icon-edit'
          }
        }
      ],

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
          name: '工单列表',
          path: ''
        }
      ],

      tabPaneList: [
        {
          label: '待审批',
          name: '0',
          loading: false,
          columns: [
            {
              text: '',
              align: 'center',
              width: 55,
              renderHeader: (h, params) => {
                return this.renderCheckedAll(h, params)
              },
              render: (h, params) => {
                return this.renderCheckedItem(h, params)
              }
            },
            {
              text: '订单号',
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
              text: '订单数量',
              value: 'orderNum',
              align: 'center'
            },

            // { text: '出货数量', align: 'center', value: 'receiver_address' },
            {
              text: '交货日期',
              value: 'deliveryTime',
              align: 'center',
              render: (h, params) => {
                return this.renderDeliveryTime(h, params)
              }
            },

            {
              text: '操作',
              align: 'center',
              width: 140,
              render: (h, params) => {
                return this.renderBtn(h, params)
              }
            }
          ],
          data: [],
          pages: {
            pageIndex: 1,
            total: 0
          }
        },
        {
          label: '已批准',
          name: '1',
          loading: false,
          columns: [
            {
              text: '',
              align: 'center',
              width: 55,
              renderHeader: (h, params) => {
                return this.renderCheckedAll(h, params)
              },
              render: (h, params) => {
                return this.renderCheckedItem(h, params)
              }
            },
            {
              text: '订单号',
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
              text: '订单数量',
              value: 'orderNum',
              align: 'center'
            },

            // { text: '出货数量', align: 'center', value: 'receiver_address' },
            {
              text: '交货日期',
              value: 'deliveryTime',
              align: 'center',
              render: (h, params) => {
                return this.renderDeliveryTime(h, params)
              }
            },

            {
              text: '操作',
              align: 'center',
              width: 140,
              render: (h, params) => {
                return this.renderBtn(h, params)
              }
            }
          ],
          data: [],
          pages: {
            pageIndex: 1,
            total: 0
          }
        }
      ],
      pageIndex: 1,
      pageSize: 10,
      total: 1
    }
  },
  mounted() {
    this.getCustomerList()
    this.getList()
  },
  methods: {
    //搜索栏查询
    getSearch() {},
    // 搜索栏按钮点击
    showModal(type) {
      let vm = this
      if (type === 'add') {
        vm.$router.push({
          name: 'work-add',
          params: {
            type: 'add'
          }
        })
      }
      if (type === 'approval') {
        if (vm.checkboxSelection.length !== 1) {
          return vm.$message.warning('请勾选一项进行审批')
        }
        vm.$confirm('是否审批该项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            vm.checkOrderProduce(vm.checkboxSelection[0])
          })
          .catch(() => {
            vm.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
      }
      if (type === 'del') {
        if (vm.checkboxSelection.length !== 1) {
          return vm.$message.warning('请勾选一项进行删除')
        }
        vm.$confirm('是否删除该项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            vm.delOrderProduce(vm.checkboxSelection[0])
          })
          .catch(() => {
            vm.$message({
              type: 'info',
              message: '已取消删除'
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
        this.getCustomerList(1, {
          customerName: item.value
        })
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
    changeTab() {
      this.getList(1)
    },
    //列表查询
    async getList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          pageNo: page,
          pageSize: vm.pageSize,
          checkStatus: vm.checkedTab,
          ...param
        }
      }
      if (vm.searchData.customerId) {
        params.bizContent.customerId = vm.searchData.customerId
      }
      if (vm.searchData.customerName) {
        params.bizContent.customerName = vm.searchData.customerName
      }
      if (vm.searchData.startDate) {
        params.bizContent.startDate = vm.searchData.startDate
      }
      if (vm.searchData.endDate) {
        params.bizContent.endDate = vm.searchData.endDate
      }
      vm.loading = true
      let res = await vm.api.work.orderProduces(params).catch(err => {
        vm.loading = false
        vm.$message.error(err)
      })
      vm.loading = false
      if (!res) return false
      let index = vm.tabPaneList.findIndex(v => v.name === vm.checkedTab)
      let list = res.item || []
      if (list.length) {
        list = list.map(v => {
          v._checked = false
          return v
        })
      }
      let pages = {
        total: res.total || 1,
        pageIndex: res.pageNo
      }
      vm.$set(vm.tabPaneList[index], 'data', list)
      vm.$set(vm.tabPaneList[index], 'pages', pages)
    },
    getCustomerList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      vm.api.work.orderProduces(params).then(
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
          vm.$set(vm.searchList[index].attr, 'options', list)
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    // 条件查询
    goSearch() {},
    getDetail(row) {
      this.$router.push({
        name: 'work-edit',
        params: {
          type: 'edit',
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
    //审批
    async checkOrderProduce(row) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { id: row.id }
      }
      let res = await vm.api.work.checkOrderProduce(params).catch(err => {
        vm.$message.error(err)
      })
      await vm.getList()
      vm.checkboxSelection = []
      vm.isSelectAll = false
      vm.$message.success(res.msg || '审批成功')
    },
    //删除
    async delOrderProduce(row) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { id: row.id }
      }
      let res = await vm.api.work.delOrderProduce(params).catch(err => {
        vm.$message.error(err)
      })
      await vm.getList()
      vm.checkboxSelection = []
      vm.isSelectAll = false
      vm.$message.success(res.msg || '删除成功')
    },
    // 列表标题勾选框 （全选）
    renderCheckedAll(h) {
      let vm = this
      return h('el-checkbox', {
        props: {
          value: vm.isSelectAll,
          disabled: false
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
      console.log(params)
      return h('el-checkbox', {
        props: {
          value: params.row._checked,
          disabled: params.row._disabled
        },
        on: {
          change: checked => {
            let index = vm.tabPaneList.findIndex(v => v.name === vm.checkedTab)
            let data = unit.cloneDeep(vm.tabPaneList[index].data)
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
            if (
              checkedArr.length ===
              data.filter(v => !unit.isEmptyObject(v)).length
            ) {
              vm.isSelectAll = true
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
                      // vm.getDetail(row)
                    }
                  }
                },
                '查看'
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
                      vm.getDetail(row)
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
