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

					<el-table :data="items" style="width: 100%" height="400">
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
				</app-card>
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
			breadList: [
				{
					name: '首页',
					path: '/',
					icon: 'el-icon-s-home',
				},
				{
					name: '工单管理',
					path: '',
				},
				{
					name: '工单列表',
					path: '',
				},
			],
			headers: [
				{
					text: '订单号',
					align: 'left',
					sortable: false,
					value: 'id',
				},
				{ text: '客户名称', value: 'status' },
				{
					text: '印件名称',
					value: 'time',
					render: (h, params) => {
						return this.renderDate(h, params)
					},
				},

				{
					text: '订单数量',
					value: 'recipientInfo',
					render: (h, params) => {
						return this.renderRecipientInfo(h, params)
					},
				},

				{ text: '出货数量', value: 'receiver_address' },
				{
					text: '交货日期',
					value: 'deliveryTime',
					render: (h, params) => {
						return this.renderDeliveryTime(h, params)
					},
				},
				{
					text: '金额',
					value: 'orderFee',
					render: (h, params) => {
						return this.renderPrice(h, params)
					},
				},
				{
					text: '下单人',
					value: 'orderFee',
					render: (h, params) => {
						return this.renderPrice(h, params)
					},
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
		}
	},
	mounted() {
		// this.getTablesData()
	},
	methods: {
		//搜索栏查询
		getSearch() {},
		// 搜索栏按钮点击
		showModal() {},
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
