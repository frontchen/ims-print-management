<template>
	<div style="padding-top: 24px">
		<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
					<Submenu :breadList="breadList" />
					<div class="white-space"></div>
					<el-form
						class="work-form"
						:inline="true"
						:rules="rules"
						:model="formValidate"
						size="mini"
						:label-width="'80px'"
					>
						<el-row>
							<el-col :span="8">
								<el-form-item label="编号" prop="orderNo">
									<el-input
										v-model="formValidate.orderNo"
										placeholder="编号"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="客户名称" prop="customer">
									<el-input
										v-model="formValidate.customer"
										placeholder="客户名称"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="交货日期" prop="deliveryDate">
									<el-date-picker
										v-model="formValidate.deliveryDate"
										type="date"
										placeholder="选择交货日期"
										style="width: 170px"
									>
									</el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="下单日期" prop="orderDate">
									<el-date-picker
										v-model="formValidate.orderDate"
										type="date"
										placeholder="选择交货日期"
										style="width: 170px"
									>
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="印件名" prop="printName">
									<el-input
										v-model="formValidate.printName"
										placeholder="印件名"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="订单数量" prop="orderNum">
									<el-input
										type="number"
										v-model="formValidate.orderNum"
										placeholder="订单数量"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="出货数量" prop="exportQuantity">
									<el-input
										v-model="formValidate.exportQuantity"
										placeholder="出货数量"
										type="number"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="件数" prop="piecesNum">
									<el-input
										type="number"
										v-model="formValidate.piecesNum"
										placeholder="件数"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="发货方式" prop="deliveryMethod">
									<el-input
										v-model="formValidate.deliveryMethod"
										placeholder="发货方式"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="制版人员" prop="plateMaker">
									<el-input
										v-model="formValidate.plateMaker"
										placeholder="制版人员"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="刀版" prop="knifeVersion">
									<el-input
										v-model="formValidate.knifeVersion"
										placeholder="刀版"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="上传图片" prop="plateMaker">
									<up-load
										:fileList="formValidate.imgList"
										size="mini"
										@onSuccess="changeUpload"
									></up-load>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="white-space"></div>
					<el-row
						type="flex"
						style="margin-top: 20px"
						justify="start"
						align="middle"
					>
						<el-col :span="3" style="padding-left: 12px">部件</el-col>
						<el-col :span="3">
							<el-button
								@click="addRows('partColumns', 'partData')"
								size="mini"
								type="text"
								>添加</el-button
							>
						</el-col>
						<el-col :span="18"></el-col>
					</el-row>
					<el-table
						:highlight-current-row="true"
						:data="partData"
						type="mini"
						current-row-key="0"
						ref="partTable"
						style="width: 100%"
						:row-class-name="tableRowClassName"
						@cell-dblclick="partCellDblclick"
					>
						<el-table-column
							v-for="(item, index) in partColumns"
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
									:index="index"
									:render="item.render"
								></Expand>
								<span v-else>{{ scope.row[item.value] }}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-row
						type="flex"
						style="margin-top: 20px"
						justify="start"
						align="middle"
					>
						<el-col :span="3" style="padding-left: 12px">工艺工序</el-col>
						<el-col :span="3">
							<el-button
								@click="addRows('craftColumns', 'craftData')"
								size="mini"
								type="text"
								>添加</el-button
							>
						</el-col>
						<el-col :span="18"></el-col>
					</el-row>
					<el-table
						:data="craftData"
						:highlight-current-row="true"
						type="mini"
						current-row-key="0"
						ref="craftTable"
						style="width: 100%"
						:row-class-name="tableRowClassName"
						@cell-dblclick="craftCellDblclick"
					>
						<el-table-column
							v-for="(item, index) in craftColumns"
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
									:index="index"
									:render="item.render"
								></Expand>
								<span v-else>{{ scope.row[item.value] }}</span>
							</template>
						</el-table-column>
					</el-table>
				</app-card>
			</v-layout>
		</v-container>
		<poptip-table
			ref="popover"
			:columns="partColumns"
			:data="poppoverPart"
			:height="400"
			:width="400"
			:pageSize="20"
			:currentPage="1"
			v-model="isOpen"
			@cell-click="popoverDbClick"
		></poptip-table>
		<poptip-table
			ref="popover1"
			:columns="craftColumns"
			:data="poppoverCraft"
			:height="400"
			:width="400"
			:pageSize="20"
			:currentPage="1"
			v-model="isOpen"
			@cell-click="popoverDbClick"
		></poptip-table>
	</div>
</template>

<script>
// import filters from '@/services/filters'
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import UpLoad from '@/components/UpLoad'
import Expand from 'Components/GraphicText/expand'
import PoptipTable from 'Components/PoptipTable'
// import { VBtn } from 'vuetify/lib'
export default {
	components: {
		Submenu,
		UpLoad,
		Expand,
		PoptipTable,
	},

	data() {
		return {
			isOpen: false,
			popperOptions: {},
			rowIndex: 0,
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
					name: '工单添加',
					path: '',
				},
			],
			formValidate: {
				orderNo: '', //编号
				customer: '', //客户名称
				deliveryDate: '', //交货日期
				orderDate: '', //下单日期
				printName: '', //印件名
				orderNum: '', //订单数量
				exportQuantity: '', //出货数量
				piecesNum: '', //件数
				deliveryMethod: '', //发货方式
				plateMaker: '', //制版人员
				knifeVersion: '', //刀版
				imgList: [],
			},
			rules: {
				orderNo: [
					{
						required: true,
						message: '编号不能为空',
						trigger: 'blur',
					},
				],
				customer: [
					{
						required: true,
						message: '客户名称不能为空',
						trigger: 'blur',
					},
				],
				deliveryDate: [
					{
						required: true,
						message: '交货日期不能为空',
						trigger: 'blur',
					},
				],
				orderDate: [
					{
						required: true,
						message: '下单日期不能为空',
						trigger: 'blur',
					},
				],
				orderNum: [
					{
						required: true,
						message: '印件名不能为空',
						trigger: 'blur',
					},
				],
				exportQuantity: [
					{
						required: true,
						message: '出货数量不能为空',
						trigger: 'blur',
					},
				],
				piecesNum: [
					{
						required: true,
						message: '件数不能为空',
						trigger: 'blur',
					},
				],
				deliveryMethod: [
					{
						required: true,
						message: '发货方式不能为空',
						trigger: 'blur',
					},
				],
				plateMaker: [
					{
						required: true,
						message: '制版人员不能为空',
						trigger: 'blur',
					},
				],
				knifeVersion: [
					{
						required: true,
						message: '刀版不能为空',
						trigger: 'blur',
					},
				],
				imgList: [
					{
						type: 'array',
						// required: true,
						trigger: 'change',
						message: '请选择图片',
						min: 1,
					},
				],
			},
			partColumns: [
				{
					text: '序号',
					align: 'left',
					sortable: false,
					value: 'index',
				},
				{
					text: '产品/部件',
					value: 'product',
					render: (h, params) => {
						return this.renderPartItem(h, params, 'product')
					},
				},
				{
					text: '材料',
					value: 'material',
					render: (h, params) => {
						return this.renderPartItem(h, params, 'material')
					},
				},
				{
					text: '开料尺寸',
					value: 'cuttingSize',
				},
				{
					text: '印数',
					value: 'printNum',
				},
				{
					text: '供应商',
					value: 'supplier',
				},
			],
			partData: [
				{
					id: 0,
					index: 0,
					edit: false,
					product: '1111',
					material: '2123',
					cuttingSize: '2112',
					printNum: '2333',
					supplier: '123322',
				},
			],

			craftColumns: [
				{ text: '产品/部件', value: '' },
				{
					text: '工艺',
					value: 'craft',
					render: (h, params) => {
						return this.renderCraftItem(h, params, 'craft')
					},
				},
				{ text: '数量', value: '' },
				{ text: '备注', value: '' },
				{ text: '加工商', value: '' },
			],
			craftData: [],
			poppoverCraft: [],
			poppoverPart: [
				{
					id: 0,
					index: 0,
					edit: false,
					product: '1111',
					material: '2123',
					cuttingSize: '2112',
					printNum: '2333',
					supplier: '123322',
				},
			],
		}
	},
	created() {
		let vm = this
		let params = window.sessionStorage.getItem('work-detail')
		if (params) {
			params = JSON.parse(params)
		} else {
			params = vm.$route.params || {}
			window.sessionStorage.setItem('work-detail', JSON.stringify(params))
		}

		// 新增
		if (params.type === 'add') {
			vm.breadList[vm.breadList.length - 1].name = '工单添加'
		} else {
			vm.breadList[vm.breadList.length - 1].name = '工单编辑'
			// 编辑
			vm.getEditForm(params)
		}
	},
	beforeDestroy() {
		window.sessionStorage.removeItem('work-detail')
	},
	mounted() {
		// this.getTablesData()
		this.$refs.partTable && this.$refs.partTable.setCurrentRow(this.partData[0])
	},
	methods: {
		// 编辑 反显列表
		getEditForm() {},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
		},
		handleCurrentChange(val) {
			this.getTablesData(val)
		},
		changeUpload() {},
		//添加按钮 新增table 行
		addRows(columns, data) {
			if (!columns || !data) return
			let row = {}
			this[columns].forEach((item) => {
				row[item.value] = ''
			})

			this[data].push(row)
			this[data] = this[data].map((v, i) => {
				v.index = i
				return v
			})
		},
		//气泡弹出 单击table 某一行触发
		popoverDbClick(row, column, cell, event) {
			event.stopPropagation()
			let item = unit.cloneDeep(row)
			this.partData[this.rowIndex] = item
			this.partData = this.partData.map((v, i) => {
				v.index = i
				return v
			})
		},
		tableRowClassName({ rowIndex }) {
			if (rowIndex === 1) {
				return 'warning-row'
			} else if (rowIndex === 3) {
				return 'success-row'
			}
			return ''
		},
		//部件table双击事件
		partCellDblclick(row, column) {
			let item = this.partColumns.find((v) => v.text === column.label)

			this.rowIndex = row.index
			if (['product', 'material'].includes(item.value)) {
				this.$set(
					this.partData[row.index],
					`${item.value}${row.index}Edit`,
					true
				)
			}
		},
		//工艺工序双击事件
		craftCellDblclick(row, column) {
			let item = this.craftColumns.find((v) => v.text === column.label)

			this.rowIndex = row.index
			if (['craft'].includes(item.value)) {
				this.$set(
					this.craftData[row.index],
					`${item.value}${row.index}Edit`,
					true
				)
			}
		},
		renderPartItem(h, params, key) {
			let vm = this
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			if (row[`${key}${row.index}Edit`]) {
				return h('el-input', {
					slot: 'reference',
					props: {
						value: row[key],
						size: 'mini',
					},
					on: {
						blur: () => {
							vm.partData[row.index][`${key}${row.index}Edit`] = false
							vm.isOpen = false
						},
						input: (value) => {
							vm.partData[row.index][key] = value
							vm.isOpen = true
						},
					},
					directives: [
						{
							name: `popover`,
							arg: 'popover',
						},
					],
				})
			}

			return h('span', row[key])
		},
		renderCraftItem(h, params, key) {
			let vm = this
			let row = params.row
			if (unit.isEmptyObject(row)) {
				return false
			}
			if (row[`${key}${row.index}Edit`]) {
				return h('el-input', {
					slot: 'reference',
					props: {
						value: row[key],
						size: 'mini',
					},
					on: {
						blur: () => {
							vm.craftData[row.index][`${key}${row.index}Edit`] = false
							vm.isOpen = false
						},
						input: (value) => {
							vm.craftData[row.index][key] = value
							vm.isOpen = true
						},
					},
					directives: [
						{
							name: `popover`,
							arg: 'popover1',
						},
					],
				})
			}

			return h('span', row[key])
		},
	},
}
</script>

<style lang="less" scoped>
@expandTableBgc: #f2f2f2;
.work-form {
	width: 90%;
	margin: 20px auto;
}
/deep/.el-table {
	.warning-row {
		background: oldlace;
	}
	.success-row {
		background: #f0f9eb;
	}
}
</style>
