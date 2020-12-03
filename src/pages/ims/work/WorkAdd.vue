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
						<el-table-column prop="index" label="序号"> </el-table-column>
						<el-table-column label="产品/部件">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`product${scope.$index}Edit`]"
									v-model="scope.row.product"
									size="mini"
									@blur="partInputBlur(scope.$index, 'product', $event)"
									@input="partInputQuery(scope.$index, 'product', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.product }}</span>
							</template>
						</el-table-column>
						<el-table-column label="材料">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`material${scope.$index}Edit`]"
									v-model="scope.row.material"
									size="mini"
									@blur="partInputBlur(scope.$index, 'material', $event)"
									@input="partInputQuery(scope.$index, 'material', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.material }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="cuttingSize" label="开料尺寸">
						</el-table-column>
						<el-table-column prop="printNum" label="印数"> </el-table-column>
						<el-table-column prop="supplier" label="供应商"> </el-table-column>
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
						<el-table-column prop="product" label="产品/部件">
						</el-table-column>
						<el-table-column label="工艺">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`craft${scope.$index}Edit`]"
									v-model="scope.row.craft"
									size="mini"
									@blur="craftInputBlur(scope.$index, 'craft', $event)"
									@input="craftInputQuery(scope.$index, 'craft', $event)"
									v-popover:popover1
								></el-input>
								<span v-else>{{ scope.row.craft }}</span>
							</template>
						</el-table-column>
						<el-table-column label="数量">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`count${scope.$index}Edit`]"
									v-model="scope.row.count"
									size="mini"
									@blur="craftInputBlur(scope.$index, 'count', $event)"
									@input="craftInputQuery(scope.$index, 'count', $event)"
									v-popover:popover1
								></el-input>
								<span v-else>{{ scope.row.count }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="desc" label="备注"> </el-table-column>
						<el-table-column prop="processor" label="加工商"> </el-table-column>
					</el-table>
				</app-card>
			</v-layout>
		</v-container>

		<el-popover
			ref="popover"
			width="500"
			trigger="manual"
			v-model="isOpen"
			offset="50"
		>
			<el-table
				:highlight-current-row="true"
				:data="partData"
				type="mini"
				current-row-key="0"
				height="400"
				width="400"
				:row-class-name="tableRowClassName"
				@cell-click="partPopoverDbClick"
			>
				<el-table-column
					v-for="(item, index) in partColumns"
					:width="item.width"
					:key="index"
					:index="index"
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
		</el-popover>
		<el-popover
			ref="popover1"
			width="500"
			trigger="manual"
			v-model="isOpen"
			offset="50"
		>
			<el-table
				:highlight-current-row="true"
				:data="poppoverCraft"
				type="mini"
				current-row-key="0"
				height="400"
				width="400"
				:row-class-name="tableRowClassName"
				@cell-click="craftPopoverDbClick"
			>
				<el-table-column
					v-for="(item, index) in craftColumns"
					:width="item.width"
					:key="index"
					:index="index"
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
		</el-popover>
	</div>
</template>

<script>
// import filters from '@/services/filters'
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import UpLoad from '@/components/UpLoad'
import Expand from 'Components/GraphicText/expand'
// import { VBtn } from 'vuetify/lib'
export default {
	components: {
		Submenu,
		UpLoad,
		Expand,
	},

	data() {
		return {
			isOpen: false,
			popperOptions: {},
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
					value: 'id',
				},
				{
					text: '产品/部件',
					value: 'product',
				},
				{
					text: '材料',
					value: 'material',
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
				{ text: '产品/部件', value: 'product' },
				{ text: '工艺', value: 'craft' },
				{ text: '数量', value: 'count' },
				{ text: '备注', value: 'desc' },
				{ text: '加工商', value: 'processor' },
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
		//部件table 输入框离开光标 隐藏气泡
		partInputBlur(index, key) {
			let vm = this
			vm.partData[index][`${key}${index}Edit`] = false
			vm.isOpen = false
		},
		//部件table 输入框搜索时 显示气泡
		partInputQuery() {
			let vm = this
			vm.isOpen = true
		},
		//工艺工序table 输入框离开光标 隐藏气泡
		craftInputBlur(index, key) {
			let vm = this
			vm.craftData[index][`${key}${index}Edit`] = false
			vm.isOpen = false
		},
		//工艺工序table 输入框搜索时 显示气泡
		craftInputQuery() {
			let vm = this
			vm.isOpen = true
		},
		partPopoverDbClick(row, column, cell, event) {
			event.stopPropagation()
			let item = unit.cloneDeep(row)
			item.index = this.partData.length
			this.partData.push(item)
		},
		craftPopoverDbClick(row, column, cell, event) {
			event.stopPropagation()
			let item = unit.cloneDeep(row)
			item.index = this.craftData.length
			this.craftData.push(item)
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
