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
						ref="workForm"
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
									<el-select
										v-model="formValidate.customer"
										filterable
										clearable
										remote
										v-loadmore="scrollCustomer"
										:remote-method="queryCustomer"
										placeholder="客户名称"
									>
										<el-option
											v-for="item in customer.list"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="交货日期" prop="deliveryDate">
									<el-date-picker
										v-model="formValidate.deliveryDate"
										:picker-options="pickerOptions"
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
							<el-col :span="8">
								<el-form-item label="件数" prop="piecesNum">
									<el-input
										type="number"
										v-model="formValidate.piecesNum"
										placeholder="件数"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="发货方式" prop="deliveryMethod">
									<el-select
										v-model="formValidate.deliveryMethod"
										placeholder="发货方式"
										filterable
										clearable
										remote
										:remote-method="queryDeliveryMethod"
									>
										<el-option
											v-for="item in deliveryMethod.list"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="制版人员" prop="plateMaker">
									<el-select
										v-model="formValidate.plateMaker"
										placeholder="制版人员"
										filterable
										clearable
										remote
										:remote-method="queryPlateMaker"
									>
										<el-option
											v-for="item in plateMaker.list"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="刀版" prop="knifePlate">
									<el-select
										v-model="formValidate.knifePlate"
										placeholder="刀版"
										filterable
										clearable
										remote
										:remote-method="queryKnifePlate"
									>
										<el-option
											v-for="item in knifePlate.list"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
 <el-row>
							<el-col :span="8">
								<el-form-item label="备注" prop="remark">
									<el-input
										v-model="formValidate.remark"
										placeholder="备注"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="24">
								<el-form-item label="上传图片" prop="imgList">
									<up-load
										:fileList="formValidate.imgList"
										size="mini"
										:limit="3"
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
								@click="addPartRows"
								size="mini"
								type="text"
								>添加</el-button
							>
								<el-button
								@click="delRows('partColumns', 'partData')"
								size="mini"
								type="text"
								>删除</el-button
							>
						</el-col>
						<el-col :span="18"></el-col>
					</el-row>
					<el-table
						:highlight-current-row="true"
						:data="partData"
						type="mini"
						height="200"
						current-row-key="0"
						ref="partTable"
						style="width: 100%"
						:row-class-name="tableRowClassName"
						@cell-dblclick="partCellDblclick" @selection-change="partSectionChange" @row-click="partRowClick">
						<el-table-column
								type="selection"
								width="55">
							</el-table-column>
						<el-table-column
							prop="index"
							align="center"
							width="60"
							label="序号"
						>
							<template slot-scope="scope">
								<span>{{ renderNumber(scope.$index) }}</span>
							</template>
						</el-table-column>
						</el-table-column>
						<el-table-column label="产品/部件" align="center" prop="part">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`part${scope.$index}Edit`]"
									v-model="scope.row.part"
									size="mini"
									@blur="partInputBlur(scope.$index, 'part', $event)"
								
								></el-input>
								<span v-else>{{ scope.row.part }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="材料" prop="materialName">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`materialName${scope.$index}Edit`]"
									v-model="scope.row.materialName"
									size="mini"
									@blur="partInputBlur(scope.$index, 'materialName', $event)"
									@focus="partInputFocus(scope.$index, 'materialName', $event)"
									@input="partInputQuery(scope.$index, 'materialName', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.materialName }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="开料尺寸" prop="cutSizeName">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`cutSizeName${scope.$index}Edit`]"
									v-model="scope.row.cutSizeName"
									size="mini"
									@blur="partInputBlur(scope.$index, 'cutSizeName', $event)"
									@focus="partInputFocus(scope.$index, 'cutSizeName', $event)"
										@input="partInputQuery(scope.$index, 'cutSizeName', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.cutSizeName }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="印数" prop="printNum">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`printNum${scope.$index}Edit`]"
									v-model="scope.row.printNum"
									type="number"
									@blur="partInputBlur(scope.$index, 'printNum', $event)"
									size="mini"
								></el-input>
								<span v-else>{{ scope.row.printNum }}</span>
							</template>
						</el-table-column>
							<el-table-column align="center" label="备注" prop="remark">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`remark${scope.$index}Edit`]"
									v-model="scope.row.remark"
									@blur="partInputBlur(scope.$index, 'remark', $event)"
									size="mini"
								></el-input>
								<span v-else>{{ scope.row.remark }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="供应商"  prop="supplierName">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`supplierName${scope.$index}Edit`]"
									v-model="scope.row.supplierName"
									size="mini"
									@blur="partInputBlur(scope.$index, 'supplierName', $event)"
									@focus="partInputFocus(scope.$index, 'supplierName', $event)"
										@input="partInputQuery(scope.$index, 'supplierName', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.supplierName }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="" width="60">
							<template slot-scope="scope">
								<i
									class="el-icon-delete ims-btn"
									@click="partItemDel(scope.$index, scope.row)"
								></i>
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
								@click="addCraftRows"
								size="mini"
								type="text"
								>添加</el-button
							>
								<el-button
								@click="delCraftRows"
								size="mini"
								type="text"
								>删除</el-button
							>
						</el-col>
						<el-col :span="18"></el-col>
					</el-row>
					<el-table
						:data="craftData"
						:highlight-current-row="true"
						type="mini"
						height="200"
						current-row-key="0"
						ref="craftTable"
						style="width: 100%"
						:row-class-name="tableRowClassName"
						@cell-dblclick="craftCellDblclick" @selection-change="craftSectionChange"
					>
							<el-table-column
								type="selection"
								width="55">
							</el-table-column>
						<el-table-column prop="producePartName" label="产品/部件"> </el-table-column>
						<el-table-column label="工艺" prop="technologyName">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`technologyName${scope.$index}Edit`]"
									v-model="scope.row.technologyName"
									size="mini"
									@blur="craftInputBlur(scope.$index, 'technologyName', $event)"
									@focus="craftInputFocus(scope.$index, 'technologyName', $event)"
									@input="craftInputQuery(scope.$index, 'technologyName', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.technologyName }}</span>
							</template>
						</el-table-column>
						<el-table-column label="工艺数量" prop="tecNum">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`tecNum${scope.$index}Edit`]"
									v-model="scope.row.tecNum"
									size="mini"
										type="number"
									@blur="craftInputBlur(scope.$index, 'tecNum', $event)"
							
								></el-input>
								<span v-else>{{ scope.row.tecNum }}</span>
							</template>
						</el-table-column>
										<el-table-column label="已报工数量" prop="finishNum">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`finishNum${scope.$index}Edit`]"
									v-model="scope.row.finishNum"
									size="mini"
										type="number"
									@blur="craftInputBlur(scope.$index, 'finishNum', $event)"
							
								></el-input>
								<span v-else>{{ scope.row.finishNum }}</span>
							</template>
						</el-table-column>
						<el-table-column label="备注" prop="remark">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`remark${scope.$index}Edit`]"
									v-model="scope.row.remark"
									size="mini"
									@blur="craftInputBlur(scope.$index, 'remark', $event)"
								></el-input>
								<span v-else>{{ scope.row.remark }}</span>
							</template>
						</el-table-column>
						<el-table-column label="加工商" prop="processSupplierName">
							<template slot-scope="scope">
								<el-input
									v-if="scope.row[`processSupplierName${scope.$index}Edit`]"
									v-model="scope.row.processSupplierName"
									size="mini"
									@blur="craftInputBlur(scope.$index, 'processSupplierName', $event)"
									@focus="craftInputFocus(scope.$index, 'processSupplierName', $event)"
									@input="craftInputQuery(scope.$index, 'processSupplierName', $event)"
									v-popover:popover
								></el-input>
								<span v-else>{{ scope.row.processSupplierName }}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="" width="60">
							<template slot-scope="scope">
								<i
									class="el-icon-delete ims-btn"
									@click="craftItemDel(scope.$index, scope.row)"
								></i>
							</template>
						</el-table-column>
					</el-table>
							<div style="margin-top:30px">
						<el-row type="flex" justify="center" align="middle">
							<v-btn color="#409EFF" width="76" height="30" dark @click="save">保存</v-btn>
						</el-row>
					</div>
				</app-card>
			</v-layout>
		</v-container>

		<el-popover
			ref="popover"
			width="500"
			trigger="click"
			:open-delay="500"
			:popperOptions="popperOptions"
			v-model="isOpen"
		>
			<el-table
				:highlight-current-row="true"
				:data="poppoverTableData"
				type="mini"
				current-row-key="0"
				header-row-class-name="popover-table-header"
				height="200"
				width="400"
				:row-class-name="tableRowClassName"
				@row-click="popoverRowClick"
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
					<el-pagination
			@current-change="changePoppoverPage"
			@size-change="handleSizeChange"
			:current-page="poppoverPages.currentPage"
			:page-size="poppoverPages.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="poppoverPages.togalNum"
		>
		</el-pagination>
		</el-popover>
	</div>
</template>

<script>
// import filters from '@/services/filters'
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import UpLoad from '@/components/UpLoad'
import Expand from 'Components/GraphicText/expand'
import * as columns from './columns'
export default {
	components: {
		Submenu,
		UpLoad,
		Expand,
	},

	data() {
		return {
			isOpen: false,
			editData: {},
			checkedData: [],
			partRowData: {},
			craftRowData: {},
			partCurrentRow: {}, //部件table 当前行的数据
			popperOptions: {},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 86400000
				},
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
					name: '工单添加',
					path: '',
				},
			],
			//表单对象
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
				knifePlate: '', //刀版
				imgList: [],
				remark: '', //备注
			},
			//表单校验规则
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
				knifePlate: [
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
				printName: [
					{
						required: true,
						message: '印件名不能为空',
						trigger: 'blur',
					},
				],
			},
			//客户
			customer: {
				list: [],
				disabled: false,
				hasMore: false,
				pageIndex: 1,
				query: '',
			},

			//制版人员
			plateMaker: {
				list: [],
				disabled: false,
				hasMore: false,
				pageIndex: 1,
				query: '',
			},
			//刀版
			knifePlate: {
				list: [],
				disabled: false,
			},
			//发货方式
			deliveryMethod: {
				list: [],
				disabled: false,
			},

			partColumns: [],

			partData: [],
			craftColumns: [],
			//部件、工艺工序 气泡table搜索参数
			searchData: {},
			poppoverTableData: [],
			//部件poppover页码
			poppoverPages: {
				currentPage: 1,
				pageSize: 10,
				togalNum: 1,
			},
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
		vm.editData = params
		// 新增
		if (params.type === 'add') {
			vm.breadList[vm.breadList.length - 1].name = '工单添加'
		} else {
			vm.breadList[vm.breadList.length - 1].name = '工单编辑'
		}
	},
	computed: {
		craftData() {
			let partRowData = this.partRowData
			let data = []

			if (this.partData[partRowData.index]) {
				data = this.partData[partRowData.index].orderProduceTechnologyList || []
			}
			return data
		},
	},
	beforeDestroy() {
		window.sessionStorage.removeItem('work-detail')
	},
	async mounted() {
		// this.getTablesData()

		await this.getCustomerList() //客户列表
		await this.getStaffNameList() //制版人员
		await this.getKnifePlateList() //刀版
		await this.getDeliveryMethodList()

		if (this.editData.type === 'edit') {
			// 编辑
			this.getEditForm(this.editData)
			this.$refs.partTable &&
				this.$refs.partTable.setCurrentRow(this.partData[0])
		}
	},
	methods: {
		getImageFullUrl(url) {
			let imgApiurl = url
			if (url.substring(0, 4) === 'http') {
				imgApiurl = imgApiurl.replace(`${process.env.VUE_APP_API}`, '')
			}
			return imgApiurl
		},
		// 编辑 反显列表
		async getEditForm(row) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { id: row.id },
			}
			vm.api.work.orderProduceSingle(params).then(
				(res) => {
					if (!res) return false
					let row = res.item || {}
					let formValidate = {
						orderNo: row.orderNo || '', //工单编号
						customer: row.customerId || '', //客户id
						deliveryDate: unit.formatDate(row.deliveryDate), //交货日期
						printName: row.printName || '', //印件名
						orderNum: row.orderNum || '', //订单数量
						piecesNum: row.piecesNum || '', //件数
						deliveryMethod: row.deliveryMethodId || '', //发货方式id
						plateMaker: row.plateMakerId || '', //制版人员id
						knifePlate: row.knifePlateId || '', //制版人员id
						remark: row.remark || '',
						imgList: [],
					}
					let imgList = []
					if (row.img1) {
						imgList.push({
							url: vm.getImageFullUrl(row.img1),
						})
					}
					if (row.img2) {
						imgList.push({
							url: vm.getImageFullUrl(row.img2),
						})
					}
					if (row.img3) {
						imgList.push({
							url: vm.getImageFullUrl(row.img3),
						})
					}
					formValidate.imgList = imgList
					console.log(['formValidate', formValidate])
					vm.formValidate = formValidate
					vm.partData = row.orderProducePartList || []
					vm.partCurrentRow = vm.partData[0] || {}
					vm.partRowData = {
						index: 0,
					}
					console.log(['反显列表', vm.partData])
				},
				(err) => {
					err && vm.$message.error(err)
				}
			)
		},

		changeUpload(fileList) {
			this.formValidate.imgList = fileList.map((item) => {
				item.url = this.getImageFullUrl(item.url)
				return item
			})
		},
		scrollCustomer() {
			console.log(['客户滚动下拉'])
		},
		//客户名称模糊搜索
		queryCustomer(query) {
			this.getCustomerList(1, {
				company: query,
			})
		},
		//制版人员模糊搜索
		queryPlateMaker(query) {
			this.getStaffNameList(1, {
				company: query,
			})
		},
		queryDeliveryMethod(query) {
			this.getStaffNameList(1, {
				company: query,
			})
		},
		//客户名称下拉列表
		async getCustomerList(page = 1, param = {}) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize, ...param },
			}
			let res = await vm.api.basis.customers(params).catch((err) => {
				err && vm.$message.error(err)
			})
			if (!res) return false
			let list = res.item || []
			list = list.map((v) => {
				v.label = v.company
				v.value = v.id
				return v
			})

			vm.customer.list = list
		},

		//制版人员下拉列表
		async getStaffNameList(page = 1, param = {}) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize, ...param },
			}
			let res = await vm.api.basis.staffs(params).catch((err) => {
				err && vm.$message.error(err)
			})
			if (!res) return false
			let list = res.item || []
			list = list.map((v) => {
				v.label = v.staffName
				v.value = v.id
				return v
			})
			vm.plateMaker.list = list
		},
		//刀版下拉列表
		async getKnifePlateList(page = 1, param = {}) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize, ...param },
			}
			let res = await vm.api.basis.knifePlates(params).catch((err) => {
				err && vm.$message.error(err)
			})
			if (!res) return false
			let list = res.item || []
			list = list.map((v) => {
				v.label = v.knifePlate
				v.value = v.id
				return v
			})
			vm.knifePlate.list = list
		},
		//发货方式下拉列表
		async getDeliveryMethodList(page = 1, param = {}) {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: { pageNo: page, pageSize: vm.pageSize, ...param },
			}
			let res = await vm.api.basis.deliveryMethods(params).catch((err) => {
				err && vm.$message.error(err)
			})
			if (!res) return false
			let list = res.item || []

			list = list.map((v) => {
				v.label = v.deliveryMethod
				v.value = v.id
				return v
			})
			vm.deliveryMethod.list = list
		},
		//部件 添加按钮 新增table行
		addPartRows() {
			let row = {
				orderProduceTechnologyList: [],
			}
			this.partColumns.forEach((item) => {
				row[item.value] = ''
			})

			this.partData.push(row)
		},
		//工艺工序 添加按钮 新增table行
		addCraftRows() {
			if (unit.isEmptyObject(this.partCurrentRow)) {
				return this.$message.warning('请点中一条部件信息再添加')
			}
			let row = {
				producePartName: this.partData[this.partRowData.index].part,
			}
			this.craftColumns.forEach((item) => {
				row[item.value] = ''
			})
			this.partData[this.partRowData.index].orderProduceTechnologyList.push(row)
		},

		//删除按钮 批量删除table行
		delRows(columns, data) {
			if (!columns || !data) return
			let row = {}
			this[columns].forEach((item) => {
				row[item.value] = ''
			})

			this[data].push(row)
		},
		//部件table 输入框离开光标 隐藏气泡
		partInputBlur(index, key) {
			let vm = this
			vm.partData[index][`${key}${index}Edit`] = false
		},
		//部件table 输入框搜索时 显示气泡
		partInputFocus(index, name, event) {
			let vm = this
			vm.isOpen = true
			vm.partRowData = {
				index: index,
				name: name,
			}
			vm.popoverType = 'partRowData'
			vm.getTableList(name)
			vm.updatePoppover('popover', event)
		},
		//部件 材料、开料尺寸、供应商模糊搜索
		partInputQuery(index, name, query) {
			let vm = this
			vm.isOpen = true
			vm.partRowData = {
				index: index,
				name: name,
			}
			vm.searchData[name] = query
			vm.getTableList(name)
		},
		//气泡 table 查询列表
		getTableList(name) {
			let vm = this
			if (!name) return false
			let path = ''
			let params = {
				reqTime: null,
				bizContent: {
					pageNo: vm.poppoverPages.currentPage,
					pageSize: vm.poppoverPages.pageSize,
				},
			}
			console.log(['name', name])
			switch (name) {
				//材料
				case 'materialName':
					path = 'materials'
					if (vm.searchData.materialName) {
						params.bizContent.materialName = vm.searchData.materialName
					}
					break
				//开料尺寸
				case 'cutSizeName':
					if (vm.searchData.cutSizeName) {
						params.bizContent.cutSizeName = vm.searchData.cutSizeName
					}
					path = 'cutSizes'
					break
				//供应商
				case 'supplierName':
					if (vm.searchData.companyName) {
						params.bizContent.company = vm.searchData.companyName
					}
					path = 'suppliers'
					break
				//工艺
				case 'technologyName':
					if (vm.searchData.technologyName) {
						params.bizContent.technologyName = vm.searchData.technologyName
					}
					path = 'technologys'
					break
				case 'processSupplierName':
					if (vm.searchData.processSupplierName) {
						params.bizContent.company = vm.searchData.processSupplierName
					}
					path = 'suppliers'
					break
				default:
					break
			}
			if (!path) return false
			vm.api.basis[path](params).then(
				(res) => {
					if (!res) return false
					let list = res.item || []
					vm.poppoverTableData = list
					vm.poppoverPages.togalNum = res.total || 1
					vm.poppoverPages.currentPage = res.pageNo
				},
				(err) => {
					vm.loading = false
					err && vm.$message.error(err)
				}
			)
		},
		changePoppoverPage(val) {
			this.getTableList(val)
		},
		handleSizeChange(val) {
			this.getTableList(val)
		},
		//工艺工序table 输入框离开光标 隐藏气泡
		craftInputBlur(index, key) {
			let vm = this
			let partRowData = vm.partRowData || {}
			vm.partData[partRowData.index].orderProduceTechnologyList[index][
				`${key}${index}Edit`
			] = false
		},
		//工艺工序table 输入框搜索时 显示气泡
		craftInputFocus(index, name, event) {
			let vm = this
			vm.isOpen = true
			vm.craftRowData = {
				index: index,
				name: name,
			}
			vm.popoverType = 'craftRowData'
			vm.getTableList(name)
			vm.updatePoppover('popover', event)
		},
		//工艺、加工省 模糊搜索
		craftInputQuery(index, name, query) {
			let vm = this
			vm.isOpen = true
			vm.craftRowData = {
				index: index,
				name: name,
			}
			vm.searchData[name] = query
			vm.getTableList(name)
		},
		popoverRowClick(row, column, event) {
			event.stopPropagation()
			console.log(['row', row])
			let item = unit.cloneDeep(row)
			const partRowData = this.partRowData || {}
			const craftRowData = this.craftRowData || {}
			const partIndex = this.partRowData.index || 0

			let partRowItem = unit.cloneDeep(this.partData[partIndex])
			if (
				['materialName', 'cutSizeName', 'supplierName'].includes(
					partRowData.name
				)
			) {
				switch (this[this.popoverType].name) {
					//材料
					case 'materialName':
						partRowItem.materialName = item.materialName
						partRowItem.materialId = item.id
						break
					//开料尺寸
					case 'cutSizeName':
						partRowItem.cutSizeName = item.cutSize
						partRowItem.cutSizeId = item.id
						break
					//供应商
					case 'supplierName':
						partRowItem.supplierName = item.company
						partRowItem.supplierId = item.id
						break

					default:
						break
				}
				partRowItem[`${partRowData.name}${partRowData.index}Edit`] = false
			}
			if (
				['technologyName', 'processSupplierName'].includes(craftRowData.name)
			) {
				switch (craftRowData.name) {
					//工艺
					case 'technologyName':
						partRowItem.orderProduceTechnologyList[
							craftRowData.index
						].technologyName = item.technologyName

						partRowItem.orderProduceTechnologyList[
							craftRowData.index
						].technologyId = item.id
						break
					//加工商
					case 'processSupplierName':
						partRowItem.orderProduceTechnologyList[
							craftRowData.index
						].processSupplierName = item.company
						partRowItem.orderProduceTechnologyList[
							craftRowData.index
						].processSupplierId = item.id

						break
				}
				partRowItem.orderProduceTechnologyList[craftRowData.index][
					`${craftRowData.name}${craftRowData.index}Edit`
				] = false
			}
			this.isOpen = false
			this.$set(this.partData, partIndex, partRowItem)
		},

		tableRowClassName({ rowIndex }) {
			if (rowIndex === 1) {
				return 'warning-row'
			} else if (rowIndex === 3) {
				return 'success-row'
			}
			return ''
		},
		//部件table 单元格双击事件
		partCellDblclick(row, column) {
			let columnList = []
			if (columns[column.property]) {
				columnList = unit.cloneDeep(columns[column.property])
			}
			this.partColumns = columnList
			let index = this.partData.indexOf(row)
			this.partRowData = {
				index: index,
				name: column.property,
			}
			if (
				[
					'materialName',
					'cutSizeName',
					'supplierName',
					'printNum',
					'remark',
					'part',
				].includes(column.property)
			) {
				this.$set(this.partData[index], `${column.property}${index}Edit`, true)
			}
		},
		//部件table 某一行单击事件
		partRowClick(row) {
			this.partCurrentRow = row
			this.partRowData.index = this.partData.indexOf(row)
		},
		//工艺工序双击事件
		craftCellDblclick(row, column) {
			let columnList = []
			if (columns[column.property]) {
				columnList = unit.cloneDeep(columns[column.property])
			} else {
				if (column.property === 'processSupplierName') {
					columnList = unit.cloneDeep(columns['supplierName'])
				}
			}

			this.partColumns = columnList
			let partRowData = this.partRowData
			let index = this.partData[
				partRowData.index
			].orderProduceTechnologyList.indexOf(row)
			this.craftRowData = {
				index: index,
				name: column.property,
			}
			if (
				[
					'technologyName',
					'processSupplierName',
					'tecNum',
					'finishNum',
					'remark',
				].includes(column.property)
			) {
				this.$set(
					this.partData[partRowData.index].orderProduceTechnologyList[index],
					`${column.property}${index}Edit`,
					true
				)
			}
		},
		//更新气泡位置
		updatePoppover(ref, event) {
			let vm = this
			vm.$nextTick(() => {
				let pop = vm.$refs[ref]
				if (!pop) return false
				let popperJS = pop.popperJS
				if (popperJS) {
					popperJS._reference = event.target
					popperJS.update()
				} else {
					pop.createPopper()
				}
			})
		},
		partItemDel(index) {
			this.partData.splice(index, 1)
		},
		craftItemDel(index) {
			this.craftData.splice(index, 1)
		},
		renderNumber(i) {
			return unit.serialNumber(i + 1, { bits: 2 })
		},
		partSectionChange(val) {
			this.checkedData = val
			console.log(['val', val])
		},
		save() {
			let vm = this
			vm.$refs.workForm.validate((valid) => {
				if (!valid) return false
				if (!vm.partData.length) {
					return vm.$message.warning('部件不能为空')
				}
				let craftData = []
				let orderProducePartList = []
				vm.partData.forEach((v) => {
					let children = v.orderProduceTechnologyList || []
					let partItem = {
						part: v.part,
						materialId: v.materialId,
						materialName: v.materialName,
						cutSizeId: v.cutSizeId,
						cutSizeName: v.cutSizeName,
						printNum: v.printNum,
						supplierId: v.supplierId,
						supplierName: v.supplierName,
						remark: v.remark,
						orderProduceTechnologyList: [],
					}
					children.forEach((item) => {
						let values = Object.values(item)
						if (values.filter((val) => val).length >= 6) {
							craftData.push(item)
						}
						partItem.orderProduceTechnologyList.push({
							producePartName: item.producePartName,
							technologyId: item.technologyId,
							technologyName: item.technologyName,
							tecNum: item.tecNum,
							finishNum: item.finishNum,
							remark: item.remark,
							processSupplierName: item.processSupplierName,
							processSupplierId: item.processSupplierId,
						})
					})
					orderProducePartList.push(partItem)
				})
				if (!craftData.length) {
					return vm.$message.warning('工艺工序不能为空')
				}
				let forms = vm.formValidate
				//客户名称
				let customerItem =
					vm.customer.list.find((v) => v.value === forms.customer) || {}
				//发货方式
				let deliveryMethodItem =
					vm.deliveryMethod.list.find(
						(v) => v.value === forms.deliveryMethod
					) || {}
				//刀版
				let knifePlateItem =
					vm.knifePlate.list.find((v) => v.value === forms.knifePlate) || {}
				//制版人员
				let plateMakerItem =
					vm.plateMaker.list.find((v) => v.value === forms.plateMaker) || {}
				let params = {
					reqtime: unit.formatDate(new Date()),
					bizContent: {
						// orderProduce: {
						orderNo: forms.orderNo, //工单编号
						customerId: customerItem.value, //客户id
						customerName: customerItem.label, //客户名称
						deliveryDate: unit.formatDate(forms.deliveryDate), //交货日期
						printName: forms.printName, //印件名
						orderNum: forms.orderNum, //订单数量
						piecesNum: Number(forms.piecesNum), //件数
						deliveryMethod: deliveryMethodItem.label, //发货方式
						deliveryMethodId: deliveryMethodItem.value, //发货方式id
						plateMaker: plateMakerItem.label, //制版人员
						plateMakerId: plateMakerItem.value, //制版人员id
						knifePlate: knifePlateItem.label, //制版人员
						knifePlateId: knifePlateItem.value, //制版人员id
						remark: forms.remark, //备注
						orderProducePartList,
					},
					// },
				}
				forms.imgList.forEach((img, index) => {
					params.bizContent[`img${index + 1}`] = vm.getImageFullUrl(img.url)
				})
				let path = 'createOrderProduce'
				if (vm.editData.type === 'edit') {
					path = 'updateOrderProduce'
					params.bizContent.id = vm.editData.id
				}
				vm.api.work[path](params).then(
					() => {
						vm.$router.replace('/work/list')
					},
					(err) => {
						err && vm.$message.error(err)
					}
				)
			})
		},
	},
}
</script>

<style lang="less" scoped>
@expandTableBgc: #f2f2f2;
@import '../../../components/styles/colors.less';
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
/deep/.popover-table-header {
	th {
		padding: 6px 0;
	}
}
</style>
