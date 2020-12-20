<template>
	<div style="padding-top: 24px">
		<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
					<Submenu :breadList="breadList" />
					<div class="white-space"></div>
					<app-search-bar
						:show-search-btn="false"
						:right="searchRight"
						ref="search"
					>
					</app-search-bar>
					<div class="white-space"></div>
					<div class="group-list">
						<el-tree
							:data="treeData"
							:props="defaultProps"
							default-expand-all
							node-key="id"
							empty-text="暂无数据"
							:expand-on-click-node="true"
							:render-content="renderContent"
						>
						</el-tree>
					</div>
				</app-card>
			</v-layout>
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
				:ruleValidate="modal1.ruleValidate"
				ref="modal1"
			></app-modal>
		</v-container>
	</div>
</template>

<script>
import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import AppDropMenu from 'Components/AppDropMenu/AppDropMenu'
export default {
	components: {
		Submenu,
	},

	data() {
		return {
			// 操作类型
			addType: '',
			rowItem: {},
			// 滑动到某项时选中项
			showId: 0,
			// 点击某项
			showItemId: 0,
			// 搜索栏右侧
			searchRight: {
				values: {},
				data: [
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
							onClick: () => {
								this.treeEditClick('新增')
							},
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
					name: '基础功能',
					path: '',
				},
				{
					name: '物料群组',
					path: '',
				},
			],
			defaultProps: {
				children: 'sonGroups',
				label: 'groupName',
			},
			treeData: [],
			// 新增
			modal1: {
				title: '新增',
				loading: false,
				isRequest: false,
				isOpen: false,
				inline: true,
				width: '600px',
				col: 1,
				labelWidth: '100px',
				labelPosition: 'right',
				values: {},
				ruleValidate: {
					groupNo: [
						{
							type: 'string',
							message: '群组编号最多125个字',
							trigger: 'blur',
							max: 125,
						},
					],
					groupName: [
						{
							required: true,
							type: 'string',
							message: '群组名称不能为空',
							trigger: 'blur',
						},
						{
							type: 'string',
							message: '群组名称最多125个字',
							trigger: 'blur',
							max: 125,
						},
					],
					remark: [
						{
							type: 'string',
							message: '备注最多125个字',
							trigger: 'blur',
							max: 125,
						},
					],
				},
				sendData: {}, // 修改联系信息暂存数据
				data: [
					{
						type: 'input',
						label: '群组名称',
						name: 'groupName',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入群组名称',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '群组编号',
						name: 'groupNo',
						value: '',
						attr: {
							clearable: true,
							placeholder: '请输入群组编号',
							filterable: true,
							disabled: false,
						},
					},
					{
						type: 'input',
						label: '备注',
						name: 'remark',
						value: '',
						attr: {
							type: 'textarea',
							clearable: true,
							placeholder: '请输入单位',
							filterable: true,
							disabled: false,
						},
					},
				],
			},
		}
	},
	mounted() {
		this.$refs.search.disableSearchRight(['add'])
		this.getList()
	},
	methods: {
		getList() {
			let vm = this
			let params = {
				reqTime: null,
				bizContent: {},
			}
			vm.api.basis.customerGroups(params).then(
				(res) => {
					vm.treeData = res.item || []
					if (vm.treeData.length) {
						vm.$refs.search.disableSearchRight(['add'])
					} else {
						vm.$refs.search.disableSearchRight([])
					}
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		treeEditClick(name, data) {
			let vm = this

			if (name === '删除') {
				vm.$confirm('是否删除该项?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						vm.delCustomerGroup(data)
					})
					.catch(() => {
						vm.$message({
							type: 'info',
							message: '已取消删除',
						})
					})

				return false
			}
			vm.addType = name

			vm.rowItem = data
			vm.showModal(name)
		},
		showModal() {
			let vm = this
			vm.modal1.isOpen = true
			vm.$nextTick(() => {
				console.log(vm.$refs.modal1)
				vm.modal1.title = vm.addType
				vm.$refs.modal1.resetFields()
				if (vm.addType === '修改') {
					vm.modal1.values = {
						groupName: vm.rowItem.groupName,
						groupNo: vm.rowItem.groupNo,
					}
				}
			})
		},
		//新增、修改
		addSure(values) {
			let vm = this
			vm.$refs.modal1.validate((valid) => {
				if (!valid) return
				let params = {
					reqtime: unit.formatDate(new Date()),
					bizContent: {
						groupName: values.groupName,
						groupNo: values.groupNo,
						remark: values.remark,
					},
				}
				let path = 'createCustomerGroup'
				if (['新增', '增加同级', '增加下级'].includes(vm.addType)) {
					if (vm.addType === '新增') {
						params.bizContent.parentId = 0
					}
					if (vm.addType === '增加下级') {
						params.bizContent.parentId = vm.rowItem.id
					}
					if (vm.addType === '增加同级') {
						params.bizContent.parentId = vm.rowItem.parentId
					}
					path = 'createCustomerGroup'
				} else {
					//修改
					path = 'updateCustomerGroup'
					params.bizContent.id = vm.rowItem.id
				}

				vm.api.basis[path](params).then(
					(res) => {
						vm.getList()
						vm.$message.success(res.msg || '操作成功!')
						vm.modal1.isOpen = false
					},
					(err) => {
						vm.$message.error(err)
					}
				)
				//增加下级
			})
		},
		//删除
		delCustomerGroup(item) {
			let vm = this
			let params = {
				reqtime: null,
				bizContent: {
					id: item.id,
				},
			}

			vm.api.basis.delCustomerGroup(params).then(
				() => {
					vm.getList()
					vm.$message.success('删除成功!')
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		/**
		 *  获取BOM---编辑--树
		 **/
		renderContent(h, { node, data }) {
			let vm = this
			let icon = node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'
			let disabled = false
			if (Array.isArray(data.sonGroups) && data.sonGroups.length) {
				disabled = true
			}
			let dropData = [
				{ label: '增加同级', value: '增加同级' },
				{ label: '增加下级', value: '增加下级' },
				{ label: '修改', value: '修改' },
				{ label: '删除', value: '删除', disabled },
			]
			if (data.level === 1) {
				dropData = [
					{ label: '增加下级', value: '增加下级' },
					{ label: '修改', value: '修改' },
					{ label: '删除', value: '删除', disabled },
				]
			}
			return h(
				'span',
				{
					attrs: { class: 'ims-tree-line' },
					on: {
						mouseenter: () => {
							vm.showId = data.id
						},
						mouseleave: () => {
							vm.showId = 0
						},
						click: () => {
							vm.showItemId = vm.showItemId === data.id ? 0 : data.id
						},
					},
				},
				[
					h('i', {
						attrs: {
							class: `${icon}`,
						},
					}),
					h('span', data.groupName || ''),
					h(AppDropMenu, {
						attrs: {
							class:
								vm.showId === data.id ? 'ims-poptip-show' : 'ims-poptip-hide',
						},
						props: { type: 'text', transfer: true, data: dropData, name: '' },
						on: {
							'on-click': (name) => {
								vm.treeEditClick(name, data)
							},
						},
					}),
				]
			)
		},
	},
}
</script>
<style lang="less" scoped>
@import '../../../components/styles/colors.less';
.group-list {
	min-height: 340px;
	/deep/ .el-tree {
		margin-top: 10px;
		height: 340px;
		ul {
			&.el-dropdown-menu {
				padding: 0px;
			}
			li {
				margin: 0;
				&.el-dropdown-item {
					padding: 7px 16px;
				}
			}
		}
		.ims-tree-line {
			display: inline-block;
			width: 100%;
			padding: 5px 0px;
			&:hover {
				background-color: @ims-search-bar-bgColor;
			}
			&:active {
				background-color: @ims-search-bar-bgColor;
			}
			.ims-poptip-show {
				display: inline-block;
				*:focus,
				&:focus {
					outline: none;
				}
			}
			.ims-poptip-hide {
				display: none;
			}
			.ims-tree-icon {
				margin-right: 5px;
				font-size: 15px;
				color: @ims-tree-color;
			}
			.ims-tree-icon-point {
				color: @ims-main-color;
			}
		}
		.el-icon {
			font-family: 'mwfont' !important;
		}
		.el-tree-arrow {
			width: 14px;
			height: 26px;
			line-height: 26px;
			vertical-align: top;
		}
		.el-icon-ios-arrow-forward:before {
			content: '\E652';
		}
		.el-tree-arrow-open {
			i {
				transform: none;
			}
			.el-icon-ios-arrow-forward:before {
				content: '\E653';
			}
		}

		.el-tree-children {
			position: relative;
			z-index: 0;
			&:not(:first-child)::before {
				z-index: -1;
				position: absolute;
				content: '';
				top: 0px;
				left: 6px;
				width: 15px;
				height: 15px;
				border-left: 1px dotted #aaa;
				border-bottom: 1px dotted #aaa;
			}
			&:not(:last-child)::before {
				border-left: 0px;
			}
			&:not(:last-child)::after {
				z-index: -1;
				position: absolute;
				content: '';
				top: 0px;
				left: 6px;
				bottom: 0px;
				border-left: 1px dotted #aaa;
			}
		}
	}
}
</style>
