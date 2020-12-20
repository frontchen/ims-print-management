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
						<el-table
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
		Expand,
	},

	data() {
		return {
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
					},
				},
				{
					type: 'datepicker',
					name: 'date',
					value: [],
					disabled: true,
					attr: {
						placeholder: '请选择',
						type: 'daterange',
						size: 'mini',
					},
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
						icon: 'el-icon-edit',
					},
				},
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
					icon: 'el-icon-s-home',
				},
				{
					name: '基础功能',
					path: '',
				},
				{
					name: '部门',
					path: '',
				},
			],
			headers: [
				{
					text: '时间',
					align: 'left',
					sortable: false,
					width: 100,
					value: 'id',
					render: (h, params) => {
						if (unit.isEmptyObject(params.row)) {
							return false
						}
						return h('span', unit.formatDate(params.row.creteTime))
					},
				},
				{ text: '创建人', value: 'creator' },
				{
					text: '部门',
					value: 'departmentName',
				},

				{
					text: '操作',
					align: 'center',
					width: 100,
					render: (h, params) => {
						return this.renderBtn(h, params)
					},
				},
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
							trigger: 'blur',
						},
					],
					departmentName: [
						{
							required: true,
							type: 'string',
							message: '部门不能为空',
							trigger: 'blur',
						},
					],
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
							disabled: false,
						},
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
							disabled: false,
						},
					},
				],
			},
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		//搜索栏查询
		getSearch() {},
		// 搜索栏按钮点击
		showModal(type, row) {
			let vm = this
			if (type === 'add') {
				vm.modal1.title = '新增'
			}
			if (type === 'modify') {
				vm.modal1.sendData = row
				vm.modal1.title = '修改'
				vm.modal1.values = {
					departmentName: row.departmentName,
				}
			}
			vm.modal1.isOpen = true
			vm.$nextTick(() => {
				vm.$refs.modal1.resetFields()
			})
		},
		// 搜索栏select cascader切换事件
		changeSearchList() {},
		getList(page = 1) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize },
			}
			vm.api.basis.departments(params).then(
				(res) => {
					if (!res) return false
					let list = res.item || []
					vm.items = list
					vm.total = res.total || 1
					vm.pageIndex = res.pageNo
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		delDepartment(row) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { id: row.id },
			}
			vm.api.basis.delDepartment(params).then(
				() => {
					vm.getList()
					vm.$message.success('删除成功!')
				},
				(err) => {
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
			vm.$refs.modal1.validate((valid) => {
				if (!valid) return false
				let params = {
					departmentName: values.departmentName,
					departmentNo: values.departmentNo,
				}
				let row = vm.modal1.sendData
				let path = 'createPaymentMethod'
				if (vm.modal1.title === '新增') {
					path = 'createPaymentMethod'
				}
				if (vm.modal1.title === '修改') {
					path = 'updateDepartment'
					params.id = row.id
				}
				vm.api.basis[path](params).then(
					() => {
						vm.getList()
						vm.$message.success('操作成功!')
						vm.modal1.isOpen = false
					},
					(err) => {
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
						justify: 'space-between',
					},
				},
				[
					h(
						'el-col',
						{
							props: {
								span: 12,
							},
						},
						[
							h(
								VBtn,
								{
									props: {
										small: true,
										color: '#0099FF',
										dark: true,
									},
									on: {
										click: () => {
											vm.delDepartment(row)
										},
									},
								},
								'删除'
							),
						]
					),
					h(
						'el-col',
						{
							props: {
								span: 12,
							},
						},
						[
							h(
								VBtn,
								{
									props: {
										small: true,
										color: '#0099FF',
										dark: true,
									},
									on: {
										click: () => {
											vm.updateDepartment('modify', row)
										},
									},
								},
								'编辑'
							),
						]
					),
				]
			)
		},
	},
}
</script>
<style lang="less" scoped>
@import '../../../components/styles/colors.less';
.basis-container {
	width: 100%;
}
</style>