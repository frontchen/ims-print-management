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
					name: 'cutSize',
					value: '',
					disabled: true,
					attr: {
						filterable: true,
						placeholder: '开料尺寸名称',
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
					name: '开料尺寸',
					path: '',
				},
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
					},
				},

				{
					text: '开料尺寸',
					align: 'center',
					value: 'cutSize',
				},

				{
					text: '操作',
					align: 'center',
					width: 140,
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
					cutSize: [
						{
							required: true,
							type: 'string',
							message: '开料尺寸不能为空',
							trigger: 'blur',
						},
					],
				},
				sendData: {}, // 修改联系信息暂存数据
				data: [
					{
						type: 'input',
						label: '开料尺寸',
						name: 'cutSize',
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
		this.getCutsizeList()
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
				this.searchData.cutSizeId = val.cutSize
				this.getList(1)
			}
		},
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
					cutSize: row.cutSize,
				}
			}
			vm.modal1.isOpen = true
			vm.$nextTick(() => {
				vm.$refs.modal1.resetFields()
			})
		},
		// 搜索栏select cascader切换事件
		changeSearchList(item) {
			if (item.name === 'cutSize') {
				this.searchData.cutSize = ''
				this.searchData.id = item.value
				this.getList(1)
			}
		},
		// 搜索栏select cascader模糊搜索
		searchBarQuery(item) {
			if (item.name === 'cutSize') {
				this.searchData.cutSize = item.value
				this.getCutsizeList(1, {
					cutSize: item.value,
				})
			}
		},
		getList(page = 1) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize },
			}
			if (vm.searchData.cutSizeId) {
				params.bizContent.id = vm.searchData.cutSizeId
			}
			if (vm.searchData.cutSize) {
				params.bizContent.cutSize = vm.searchData.cutSize
			}
			if (vm.searchData.startDate) {
				params.bizContent.startDate = vm.searchData.startDate
			}
			if (vm.searchData.endDate) {
				params.bizContent.endDate = vm.searchData.endDate
			}
			vm.api.basis.cutSizes(params).then(
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
		//搜索栏-开料尺寸下拉列表
		getCutsizeList(page = 1, param = {}) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize, ...param },
			}
			vm.api.basis.cutSizes(params).then(
				(res) => {
					if (!res) return false
					let list = res.item || []
					let index = vm.searchList.findIndex((v) => v.name === 'cutSize')
					if (index === -1) return
					list = list.map((v) => {
						v.label = v.cutSize
						v.value = v.id
						return v
					})
					vm.$set(vm.searchList[index].attr, 'options', list)
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		delCutSize(row) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { id: row.id },
			}
			vm.api.basis.delCutSize(params).then(
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
					reqtime: unit.formatDate(new Date()),
					bizContent: { cutSize: values.cutSize },
				}
				let row = vm.modal1.sendData
				let path = 'createCutSize'
				if (vm.modal1.title === '新增') {
					path = 'createCutSize'
				}
				if (vm.modal1.title === '修改') {
					path = 'updateCutSize'
					params.bizContent.id = row.id
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
											vm.$confirm('是否删除该项?', '提示', {
												confirmButtonText: '确定',
												cancelButtonText: '取消',
												type: 'warning',
											})
												.then(() => {
													vm.delCutSize(row)
												})
												.catch(() => {
													vm.$message({
														type: 'info',
														message: '已取消删除',
													})
												})
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
											vm.showModal('modify', row)
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