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
      searchValues: {},
      searchData: {},
      loading: false,
      searchList: [
        {
          type: 'select',
          name: 'materialName',
          value: '',
          disabled: true,
          attr: {
            filterable: true,
            placeholder: '物料名称',
            clearable: true,
            options: [],
            size: 'mini',
            hasMore: false,
            pageIndex: 1,
            remote: true,
            remoteMethod: query => {
              this.searchBarQuery({
                name: 'materialName',
                value: query
              })
            },
            loadMore: this.materialNameScroll
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
          name: '物料',
          path: ''
        }
      ],
      headers: [
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
        width: '540px',
        col: 1,
        labelWidth: '100px',
        labelPosition: 'right',
        values: {},
        ruleValidate: {
          materialGroup: [
            {
              type: 'array',
              min: 1,
              message: '物料群组不能为空',
              trigger: 'blur'
            }
          ],
          materialName: [
            {
              required: true,
              type: 'string',
              message: '物料不能为空',
              trigger: 'blur'
            }
          ],
          materialNo: [
            {
              required: true,
              type: 'string',
              message: '物料编号不能为空',
              trigger: 'blur'
            }
          ]
        },
        sendData: {}, // 修改联系信息暂存数据
        data: [
          {
            type: 'cascader',
            label: '物料群组',
            name: 'materialGroup',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请选择物料群组',
              filterable: true,
              data: [],
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
            label: '物料编号',
            name: 'materialNo',
            value: '',
            attr: {
              clearable: true,
              placeholder: '请输入物料编号',
              filterable: true,
              disabled: false
            }
          },
          {
            type: 'input',
            label: '物料',
            name: 'materialName',
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
    this.getMaterialNameList()
    this.getMaterialGroupList()
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
        this.searchData.materialId = val.materialName
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
      await vm.getMaterialNameGroup()
      vm.$nextTick(() => {
        vm.$refs.modal1.resetFields()
        if (type === 'modify') {
          vm.modal1.sendData = row
          vm.modal1.title = '修改'
          //客户群组
          let materialGroupData = vm.modal1.data.find(
            v => v.name === 'materialGroup'
          )
          materialGroupData = materialGroupData
            ? materialGroupData.attr.data
            : []
          let materialGroupChecked = unit.getCascaderValue(
            materialGroupData,
            row.materialGroupId,
            {
              children: 'sonGroups',
              value: 'id'
            }
          )
          vm.modal1.values = {
            //物料分组
            materialGroup: materialGroupChecked,
            materialNo: row.materialNo, //物料编号
            materialName: row.materialName
          }
        }
      })
    },
    //新增弹框 获取群组名称下拉列表
    async getMaterialNameGroup(param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          ...param
        }
      }
      let res = await vm.api.basis.materialGroups(params).catch(err => {
        vm.$message.error(err)
      })
      if (!res) {
        return false
      }
      let index = vm.modal1.data.findIndex(v => v.name === 'materialGroup')
      if (index === -1) return false
      vm.$nextTick(() => {
        vm.$set(vm.modal1.data[index].attr, 'data', res.item || [])
      })
    },
    // 搜索栏select cascader切换事件
    changeSearchList(item) {
      if (item.name === 'materialName') {
        this.searchData.materialName = ''
        this.searchData.materialId = item.value
        this.getList(1)
      }
    },
    // 搜索栏select cascader模糊搜索
    searchBarQuery(item) {
      if (item.name === 'materialName') {
        this.searchData.materialName = item.value
        this.getMaterialNameList(1, {
          materialName: item.value
        })
      }
    },
    // 搜索栏物料名称 滚动下拉
    materialNameScroll() {
      let params = {}
      let index = this.searchList.findIndex(v => v.name === 'materialName')
      let select = this.searchList[index]
      if (!select) return false
      if (!select.attr.hasMore) {
        return false
      }
      select.attr.pageIndex += 1
      if (this.searchData.materialName) {
        params.materialName = this.searchData.materialName
      }
      this.getMaterialNameList(1, params)
    },
    //点击tree节点 每一级触发
    nodeClickItem(data) {
      this.getList(1, {
        materialGroupId: data.id
      })
    },
    getList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      if (vm.searchData.materialId) {
        params.bizContent.id = vm.searchData.materialId
      }
      if (vm.searchData.materialName) {
        params.bizContent.materialName = vm.searchData.materialName
      }
      if (vm.searchData.startDate) {
        params.bizContent.startDate = vm.searchData.startDate
      }
      if (vm.searchData.endDate) {
        params.bizContent.endDate = vm.searchData.endDate
      }
      vm.loading = true
      vm.api.basis.materials(params).then(
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
    async getMaterialGroupList(param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: {
          ...param
        }
      }
      let res = await vm.api.basis.materialGroups(params).catch(err => {
        vm.$message.error(err)
      })
      if (!res) {
        return false
      }
      vm.$nextTick(() => {
        vm.treeData = res.item || []
      })
    },
    //搜索栏-物料名称下拉列表
    getMaterialNameList(page = 1, param = {}) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { pageNo: page, pageSize: vm.pageSize, ...param }
      }
      vm.api.basis.materials(params).then(
        res => {
          if (!res) return false
          let list = res.item || []
          let index = vm.searchList.findIndex(v => v.name === 'materialName')
          if (index === -1) return
          list = list.map(v => {
            v.label = v.materialName
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
    delMaterial(row) {
      let vm = this
      let params = {
        reqTime: null,
        bizContent: { id: row.id }
      }
      vm.api.basis.delMaterial(params).then(
        () => {
          vm.getList()
          vm.getMaterialNameList()
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
    //新增
    addSure(values) {
      let vm = this
      vm.$refs.modal1.validate(valid => {
        if (!valid) return false

        //客户群组
        let materialGroupData = vm.modal1.data.find(
          v => v.name === 'materialGroup'
        )
        materialGroupData = materialGroupData ? materialGroupData.attr.data : []
        let materialGroupItem = unit.getCascaderData(
          values.materialGroup,
          materialGroupData,
          {
            children: 'sonGroups',
            value: 'id'
          }
        )
        materialGroupItem = materialGroupItem.length
          ? materialGroupItem[materialGroupItem.length - 1]
          : {}
        let params = {
          reqtime: unit.formatDate(new Date()),
          bizContent: {
            materialName: values.materialName,
            materialNo: values.materialNo,
            materialGroup: materialGroupItem.groupName,
            materialGroupId: materialGroupItem.id
          }
        }
        let row = vm.modal1.sendData
        let path = 'createMaterial'
        if (vm.modal1.title === '新增') {
          path = 'createMaterial'
        }
        if (vm.modal1.title === '修改') {
          path = 'updateMaterial'
          params.bizContent.id = row.id
        }
        vm.api.basis[path](params).then(
          () => {
            vm.getList()
            vm.getMaterialNameList()
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
                          vm.delMaterial(row)
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
