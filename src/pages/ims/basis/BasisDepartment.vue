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
            @on-blur="searchBarBlur"
            :values="searchValues"
          >
          </app-search-bar>
          <div class="white-space"></div>
          <div class="basis-container">
            <el-table
              v-loading="loading"
              :data="items"
              style="width: 100%"
              height="400"
              stripe
              header-row-class-name="basis-container-table-header"
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
          name: 'departmentName',
          value: '',
          disabled: true,
          attr: {
            filterable: true,
            placeholder: '部门名称',
            clearable: true,
            options: [],
            size: 'mini',
            hasMore: false,
            pageIndex: 1,
            remote: true,
            remoteMethod: query => {
              this.searchBarQuery({
                name: 'departmentName',
                value: query
              })
            },
            loadMore: this.departmentScroll
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
          name: '部门',
          path: ''
        }
      ],
      headers: [
        {
          text: '编号',
          align: 'center',
          sortable: false,
          width: 100,
          value: 'departmentNo'
        },

        {
          text: '部门',
          align: 'center',
          value: 'departmentName'
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
      items: [],

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
        width: '540px',
        col: 1,
        labelWidth: '100px',
        labelPosition: 'right',
        values: {},
        ruleValidate: {
          departmentNo: [
            {
              required: true,
              type: 'string',
              message: '部门编号不能为空',
              trigger: 'blur'
            }
          ],
          departmentName: [
            {
              required: true,
              type: 'string',
              message: '部门不能为空',
              trigger: 'blur'
            }
          ]
        },
        sendData: {}, // 修改联系信息暂存数据
        data: [
          {
            type: 'input',
            label: '部门编号',
            name: 'departmentNo',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入部门编号',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'input',
            label: '部门',
            name: 'departmentName',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入名称',
              filterable: true,
              disabled: false
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getDepartmentList()
    this.getList()
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
        this.searchData.departmentId = val.departmentName
        this.getList(1)
      }
    },
    // 搜索栏按钮点击
    showModal(type, row) {
      let vm = this
      if (type === 'add') {
        vm.modal1.title = '新增'
      }

      vm.modal1.isOpen = true
      vm.$nextTick(() => {
        vm.$refs.modal1.resetFields()
        if (type === 'modify') {
          vm.modal1.sendData = row
          vm.modal1.title = '修改'
          vm.modal1.values = {
            departmentNo: row.departmentNo,
            departmentName: row.departmentName
          }
        }
      })
    },
    // 搜索栏select cascader切换事件
    changeSearchList(item) {
      if (item.name === 'departmentName') {
        this.searchData.departmentName = ''
        this.searchData.departmentId = item.value
        this.getList(1)
      }
    },
    searchBarBlur() {
      this.searchData.departmentName = ''
    },
    // 搜索栏select cascader模糊搜索
    searchBarQuery(item) {
      if (item.name === 'departmentName') {
        this.searchData.departmentName = item.value
        this.getDepartmentList(1, {
          departmentName: item.value
        })
      }
    },
    // 搜索栏部门名称 滚动下拉
    departmentScroll() {
      let params = {}
      let index = this.searchList.findIndex(v => v.name === 'departmentName')
      let select = this.searchList[index]
      if (!select) return false
      if (!select.attr.hasMore) {
        return false
      }
      select.attr.pageIndex += 1
      if (this.searchData.departmentName) {
        params.departmentName = this.searchData.departmentName
      }
      this.getDepartmentList(select.attr.pageIndex, params)
    },
    getList(page = 1) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize }
      }
      if (vm.searchData.departmentId) {
        params.bizContent.id = vm.searchData.departmentId
      }
      if (vm.searchData.departmentName) {
        params.bizContent.departmentName = vm.searchData.departmentName
      }
      if (vm.searchData.startDate) {
        params.bizContent.startDate = vm.searchData.startDate
      }
      if (vm.searchData.endDate) {
        params.bizContent.endDate = vm.searchData.endDate
      }
      vm.loading = true
      vm.api.basis.departments(params).then(
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
    getDepartmentList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      vm.api.basis.departments(params).then(
        res => {
          if (!res) return false
          let list = res.item || []
          let index = vm.searchList.findIndex(v => v.name === 'departmentName')
          if (index === -1) return
          list = list.map(v => {
            v.label = v.departmentName
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
    delDepartment(row) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { id: row.id }
      }
      vm.api.basis.delDepartment(params).then(
        () => {
          vm.getList()
          vm.getDepartmentList()
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
        let params = {
          reqtime: unit.formatDate(new Date()),
          bizContent: {
            departmentName: values.departmentName,
            departmentNo: values.departmentNo
          }
        }
        let row = vm.modal1.sendData
        let path = 'createDepartment'
        if (vm.modal1.title === '新增') {
          path = 'createDepartment'
        }
        if (vm.modal1.title === '修改') {
          path = 'updateDepartment'
          params.bizContent.id = row.id
        }
        vm.api.basis[path](params).then(
          res => {
            vm.getList()
            vm.getDepartmentList()
            vm.$message.success(res.msg || '操作成功!')
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
                          vm.delDepartment(row)
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
@import '../../../components/styles/colors.less';
.basis-container {
  width: 100%;
}
</style>
