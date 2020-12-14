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
							node-key="id"
							empty-text="暂无数据"
							:expand-on-click-node="false"
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
				:width="modal1.width"
				v-model="modal1.isOpen"
				@on-ok="addSure"
			>
				<el-form ref="modal1" :model="modal1.form" :rules="modal1.rules">
					<el-row>
						<el-col :span="24">
							<el-form-item
								label="群组名称："
								prop="group"
								:label-width="modal1.formLabelWidth"
							>
								<el-input
									size="mini"
									v-model="modal1.form.group"
									placeholder="请输入内容"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</app-modal>
		</v-container>
	</div>
</template>

<script>
// import unit from '@/services/unit'
import Submenu from 'Components/Submenu'
import AppDropMenu from 'Components/AppDropMenu/AppDropMenu'
export default {
	components: {
		Submenu,
	},

	data() {
		return {
			// 操作类型 1、同级 2、下级
			addType: 0,
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
								this.treeEditClick('增加同级')
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
					name: '客户群组',
					path: '',
				},
			],
			treeData: [],
			modal1: {
				title: '新增',
				isOpen: false,
				width: '500px',
				formLabelWidth: '100px',
				rules: {
					group: [
						{
							required: true,
							message: '群组不能为空',
							trigger: 'blur',
						},
					],
				},
				form: {
					group: '',
				},
				category: {
					options: [
						{
							label: '群组名称',
							value: 'group',
						},
						{
							label: '客户名称',
							value: 'customer',
						},
					],
				},
			},
		}
	},
	mounted() {
		// this.getTablesData()
	},
	methods: {
		treeEditClick(name, data) {
			let vm = this

			if (name === '删除') {
				vm.$confirm('是否删除该项?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						vm.authDel(data.authorityId)
					})
					.catch(() => {
						vm.$message({
							type: 'info',
							message: '已取消删除',
						})
					})

				return false
			}
			// 修改、新增
			if (name === '修改') {
				vm.addType = 0
			}
			if (name === '增加同级') {
				vm.addType = 1
			}
			if (name === '增加下级') {
				vm.addType = 2
			}
			vm.rowItem = data
			vm.showModal(name)
		},
		showModal(name) {
			let vm = this
			vm.modal1.isOpen = true
			vm.$nextTick(() => {
				console.log(vm.$refs.modal1)
				vm.$refs.modal1.resetFields()
				vm.modal1.form = {
					group: '',
				}
				if (name === '修改') {
					vm.modal1.form = {
						group: vm.rowItem.group,
					}
				}
			})
		},
		addSure() {
			let vm = this
			vm.$refs.modal1.validate((valid) => {
				if (!valid) return
				let forms = vm.modal1.form
				if (!vm.treeData.length) {
					vm.treeData.push({
						name: forms.group,
						level: 1,
						value: 0,
						parent: null,
						children: [],
					})

					vm.$refs.search.disableSearchRight(['add'])
				}
				// let checkedValues = []
				// if (vm.rowItem) {
				// 	checkedValues = unit.getCascaderValue(vm.treeData, vm.rowItem.value)
				// }
				//修改
				if (vm.addType === 0) {
					//***
					vm.rowItem.name = forms.group
				}
				//增加同级
				if (vm.addType === 1) {
					//***
					// let parent=vm.rowItem.parent
				}
				//增加下级
				if (vm.addType === 2) {
					//***

					vm.rowItem.children.push({
						name: forms.group,
						parent: vm.rowItem.name,
						parentLevel: vm.rowItem.level,
						value: forms.group,
						level: vm.rowItem.level + 1,
						children: [],
					})
				}
				vm.modal1.isOpen = false
				console.log(vm.rowItem)
			})
		},
		/**
		 *  获取BOM---编辑--树
		 **/
		renderContent(h, { node, data }) {
			let vm = this
			let icon = node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'
			let dropData = [
				{ label: '增加同级', value: '增加同级' },
				{ label: '增加下级', value: '增加下级' },
				{ label: '修改', value: '修改' },
				{ label: '删除', value: '删除' },
			]
			if (data.level === 1) {
				dropData = [
					{ label: '增加下级', value: '增加下级' },
					{ label: '修改', value: '修改' },
					{ label: '删除', value: '删除' },
				]
			}
			return h(
				'span',
				{
					attrs: { class: 'ims-tree-line' },
					on: {
						mouseenter: () => {
							vm.showId = data.name
						},
						mouseleave: () => {
							vm.showId = 0
						},
						click: () => {
							vm.showItemId = vm.showItemId === data.name ? 0 : data.name
						},
					},
				},
				[
					h('i', {
						attrs: {
							class: `${icon}`,
						},
					}),
					h('span', data.name),
					h(AppDropMenu, {
						attrs: {
							class:
								vm.showId === data.name || vm.showItemId === data.name
									? 'ims-poptip-show'
									: 'ims-poptip-hide',
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
