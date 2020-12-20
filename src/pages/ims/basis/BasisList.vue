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
								:data="data"
								show-checkbox
								node-key="id"
								:default-expanded-keys="[2, 3]"
								:default-checked-keys="[5]"
								:props="defaultProps"
							>
							</el-tree>
						</div>
						<div class="right">
							<el-table
								:data="items"
								style="width: 100%"
								height="400"
								border
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
import filters from '@/services/filters'
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import Expand from 'Components/GraphicText/expand'
import { VBtn } from 'vuetify/lib'
export default {
	components: {
		Submenu,
		Expand,
	},
	filters: {
		price(val) {
			return filters.currency(val, { format: true, prefix: '' })
		},
	},
	data() {
		return {
			searchValues: {},
			searchData: {},
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
				{
					type: 'button',
					label: '审批',
					name: 'approval',
					disabled: true,
					attr: {
						disabled: false,
						type: 'approval',
						buttonType: 'primary',
						icon: 'el-icon-edit',
					},
				},
			],
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
							picker.$emit('pick', [start, end])
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
							picker.$emit('pick', [start, end])
						},
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
							picker.$emit('pick', [start, end])
						},
					},
				],
			},
			data: [
				{
					id: 1,
					label: '一级 1',
					children: [
						{
							id: 4,
							label: '二级 1-1',
							children: [
								{
									id: 9,
									label: '三级 1-1-1',
								},
								{
									id: 10,
									label: '三级 1-1-2',
								},
							],
						},
					],
				},
				{
					id: 2,
					label: '一级 2',
					children: [
						{
							id: 5,
							label: '二级 2-1',
						},
						{
							id: 6,
							label: '二级 2-2',
						},
					],
				},
				{
					id: 3,
					label: '一级 3',
					children: [
						{
							id: 7,
							label: '二级 3-1',
						},
						{
							id: 8,
							label: '二级 3-2',
						},
					],
				},
			],
			defaultProps: {
				children: 'children',
				label: 'label',
			},
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
					name: '工艺列表',
					path: '',
				},
			],
			headers: [
				{
					text: '编号',
					align: 'center',
					sortable: false,
					value: 'id',
				},
				{ text: '名称', value: 'status' },
				{
					text: '单位',
					value: 'time',
					render: (h, params) => {
						return this.renderDate(h, params)
					},
				},

				{
					text: '部门名称',
					value: 'recipientInfo',
					render: (h, params) => {
						return this.renderRecipientInfo(h, params)
					},
				},

				{ text: '单价', value: 'receiver_address' },
				{
					text: '生产',
					value: 'deliveryTime',
					render: (h, params) => {
						return this.renderDeliveryTime(h, params)
					},
				},
				{
					text: '销售',
					value: 'orderFee',
					render: (h, params) => {
						return this.renderPrice(h, params)
					},
				},
				{
					text: '采购',
					value: 'orderFee',
						align: 'center',
					render: (h, params) => {
						return this.renderPrice(h, params)
					},
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
				width: '600px',
				col: 2,
				labelWidth: '100px',
				labelPosition: 'right',
				values: {},
				ruleValidate: {
					depart: [
						{
							required: true,
							type: 'string',
							message: '部门名称不能为空',
							trigger: 'blur',
						},
					],
					name: [
						{
							required: true,
							type: 'string',
							message: '名称不能为空',
							trigger: 'blur',
						},
					],
					unitName: [
						{
							required: true,
							type: 'string',
							message: '单位不能为空',
							trigger: 'blur',
						},
					],
					price: [
						{
							required: true,
							type: 'string',
							message: '单价不能为空',
							trigger: 'blur',
						},
					],
					product: [
						{
							required: true,
							type: 'string',
							message: '不能为空',
							trigger: 'blur',
						},
					],
					sale: [
						{
							required: true,
							type: 'string',
							message: '不能为空',
							trigger: 'blur',
						},
					],
					purchase: [
						{
							required: true,
							type: 'string',
							message: '不能为空',
							trigger: 'blur',
						},
					],
				},
				sendData: {}, // 修改联系信息暂存数据
				data: [
					{
						type: 'input',
						label: '名称',
						name: 'name',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入名称',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '部门',
						name: 'depart',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入部门',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '单位',
						name: 'unitName',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入单位',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '单价',
						name: 'price',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入单价',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '生产',
						name: 'product',
						value: '',
						attr: {
							clearable: true,
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '销售',
						name: 'sale',
						value: '',
						attr: {
							clearable: true,
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '采购',
						name: 'purchase',
						value: '',
						attr: {
							clearable: true,
							filterable: true,
							disabled: false,
						},
					},
				],
			},
		}
	},
	mounted() {
		// this.getTablesData()
	},
	methods: {
		//搜索栏查询
		getSearch() {},
		// 搜索栏按钮点击
		showModal(type) {
			if (type === 'add') {
				this.modal1.isOpen = true
			}
		},
		// 搜索栏select cascader切换事件
		changeSearchList() {},
		getTablesData(page = 1) {
			let vm = this
			let status = vm.tabs[vm.checkedTab]
			let params = {
				page,
				status,
			}
			vm.api.order.productsOrders(params).then(
				(res) => {
					let list = res ? (Array.isArray(res.results) ? res.results : []) : []
					vm.items = list
					vm.total = res.count || 1
					console.log(['list', list])
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		// 条件查询
		goSearch() {},
		getOrderDetail(row) {
			this.$router.push({
				name: '/work/edit',
				params: {
					type: 'edit',
					...row,
				},
			})
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
		},
		handleCurrentChange(val) {
			this.getTablesData(val)
		},
		addOrder() {
			this.$router.push({
				name: 'work-add',
				params: {
					type: 'add',
				},
			})
		},
		selectChange() {},
		addSure() {},
		//列表显示下单时间
		renderDate(h, params) {
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			return h('span', filters.formatDate(row.created_at || ''))
		},
		// 列表显示收货人信息
		renderRecipientInfo(h, params) {
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			return h('div', [
				h('p', row.receiver_name || ''),
				h('p', row.receiver_phone || ''),
			])
		},
		// 列表显示客户信息
		renderCustomer(h, params) {
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			return h('div', [
				h('p', row.delivery_company || ''),
				h('p', row.delivery_number || ''),
			])
		},
		// 列表显示发货时间
		renderDeliveryTime(h, params) {
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			return h('span', filters.formatDate(row.delivery_at || ''))
		},
		// 列表显示价格
		renderPrice(h, params) {
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			return h(
				'div',
				{
					attrs: {
						class: 'commodity-price-item',
					},
				},
				[
					h('span', '¥'),
					h(
						'span',
						{
							attrs: {
								class: 'commodity-price',
							},
						},
						filters.currency(row.price / 100, { format: true, prefix: '' })
					),
				]
			)
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
											vm.getOrderDetail(row)
										},
									},
								},
								'查看'
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
											vm.getOrderDetail(row)
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
	display: flex;
	justify-content: space-between;
	.left {
		width: 300px;
		overflow: auto;

		border-right: 1px dashed @ims-hover-bdcolor;
	}
	/deep/ .right {
		flex: 1;
		margin-left: 10px;
		overflow-y: auto;
		.basis-container-table-header {
			th {
				background-color: @ims-tree-bjColor;
			}
		}
	}
}
</style>