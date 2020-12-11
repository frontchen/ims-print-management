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
							default-expand-all
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
								label="类别："
								prop="category"
								:label-width="modal1.formLabelWidth"
							>
								<el-select
									v-model="modal1.form.category"
									placeholder="请选择"
									size="mini"
								>
									<el-option
										v-for="item in modal1.category.options"
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
						<el-col :span="24">
							<el-form-item
								v-if="modal1.form.category === 'customer'"
								label="客户："
								prop="customer"
								:label-width="modal1.formLabelWidth"
							>
								<el-select
									v-model="modal1.form.customer"
									placeholder="请选择"
									size="mini"
								>
									<el-option
										v-for="item in modal1.customer.options"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								v-else
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
export default {
	components: {
		Submenu,
	},

	data() {
		return {
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
								this.showModal('add')
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
					category: [
						{
							required: true,
							message: '类别不能为空',
							trigger: 'blur',
						},
					],
					customer: [
						{
							required: true,
							message: '客户不能为空',
							trigger: 'blur',
						},
					],
					group: [
						{
							required: true,
							message: '群组不能为空',
							trigger: 'blur',
						},
					],
				},
				form: {
					category: '',
					customer: '',
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
				customer: {
					options: [],
				},
			},
		}
	},
	mounted() {
		// this.getTablesData()
	},
	methods: {
		showModal(type) {
			let vm = this
			vm.modal1.isOpen = true
			if (type === 'add') {
				vm.$nextTick(() => {
					console.log(vm.$refs.modal1)
					vm.$refs.modal1.resetFields()
				})

				//...
			}
		},
		addSure() {
			let vm = this
			vm.$refs.modal1.validate((valid) => {
				if (!valid) return
				let forms = vm.modal1.form
				if (!vm.treeData.length) {
					vm.treeData.push({
						label: forms.group,
					})
					vm.modal1.isOpen = false
					vm.$refs.search.disableSearchRight(['add'])
				}
			})
		},
		/**
		 *  获取BOM---编辑--树
		 **/
		renderContent(h, { data }) {
			let vm = this
			let poptip = []
			let status = '添加下级'
			if (data['items'] && data['items'].length) {
				status = '修改'
			}
			poptip.push(
				h(
					'div',
					{
						attrs: { class: 'ims-tree-pop-btn' },
						on: {
							click: () => {},
						},
					},
					status
				)
			)
			let content = []

			content = [h('span', { class: 'ims-spec-span' }, data.label || '')]

			let showClass =
				vm.activeNodeKey === data.nodeKey
					? 'ims-poptip-show'
					: 'ims-poptip-hide'
			// let showClass = vm.productId === data.productId ? 'ims-poptip-show' : 'ims-poptip-hide'

			let editHtml = [
				h('div', { class: ['edit'] }, [
					h(
						'el-popover',
						{
							props: {
								trigger: 'hover',
								placement: 'bottom',
								width: 80,
							},
							class: showClass,
						},
						[
							h('span', { class: 'ims-poptip-edit' }, '编辑'),
							h('div', { slot: 'content' }, poptip),
						]
					),
				]),
			]

			return h(
				'span',
				{
					attrs: { class: 'ims-tree-line' },
					on: {
						mouseenter: () => {},
						mouseleave: () => {},
						click: () => {},
					},
				},
				[
					h(
						'span',
						{ attrs: { class: 'ims-tree-title-left' } },
						data.productName
					),
					h('span', { attrs: { class: 'ims-tree-title-center' } }, [
						h('div', { class: 'ims-center-div' }, content),
					]),
					h('div', { class: ['ims-tree-title-right'] }, [
						// h('div', { class: 'ims-center-div' }, content),
						h(
							'div',
							{
								class: ['ims-center-div-right'],
							},
							[...editHtml]
						),
					]),
					h('span', { class: ['ims-tree-line-bg'] }),
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
		height: 340px;
		box-sizing: border-box;
		// margin-top: 10px;
		margin: 5px 10px;
		.el-tree-children:hover {
			z-index: 1;
		}
		ul li {
			margin: 0;
			ul {
				padding-left: 50px;
			}
		}
		.ims-tree-line {
			display: inline-block;
			width: calc(100% - 15px);
			padding: 10px 0px;
			position: relative;
			&:hover {
				background-color: @ims-search-bar-bgColor;
			}
			&:hover ~ .el-tree-arrow {
				background-color: @ims-search-bar-bgColor;
			}
			&:active {
				background-color: @ims-search-bar-bgColor;
			}
			.ims-poptip-show {
				display: inline-block;
				.ivu-poptip-popper {
					min-width: 80px;
				}
			}
			.ims-poptip-hide {
				display: none;
				// display: inline-block;
			}
			.ims-tree-icon {
				margin-right: 5px;
				font-size: 15px;
				color: @ims-tree-color;
			}
			.ims-tree-pop-btn {
				text-align: center;
				cursor: pointer;
				padding: 1px 0px;
			}
			.ims-tree-line-bg {
				position: absolute;
				width: 978px;
				height: 39px;
				background: @ims-search-bar-bgColor;
				right: 0;
				top: 0;
				z-index: -1;
				display: none;
			}
			&:hover .ims-tree-line-bg {
				display: block;
			}
		}

		.ims-tree-title-left {
			display: inline-block;
			min-width: 30px;
			margin-right: 20px;
			vertical-align: top;
		}
		.ims-tree-title-center {
			display: inline-block;
			.ims-center-div {
				display: inline-block;
				&-right {
					float: right;
				}
			}
			.ims-spec-span {
				display: inline-block;
				min-height: 12px;
				min-width: 0px;
				padding-right: 10px;
				color: #999;
			}
		}
		.ims-tree-title-right {
			height: 100%;
			vertical-align: top;
			float: right;
			.edit {
				width: 40px;
				text-align: center;
				float: right;
				cursor: pointer;
				.ims-poptip-edit {
					color: @ims-main-color;
				}
			}
		}
		// .el-tree-arrow {
		//   // height: 26px;
		//   // line-height: 26px;
		//   // vertical-align: top;
		// }
		.ivu-icon-ios-arrow-forward:before {
			content: '\E652';
		}
		.el-tree-arrow-open {
			i {
				transform: none;
			}
			.ivu-icon-ios-arrow-forward:before {
				content: '\E653';
			}
		}

		.el-tree-children {
			position: relative;
			&:first-child::before {
				border: 0;
			}
			&::before {
				position: absolute;
				content: '';
				top: -10px;
				left: 6px;
				width: 50px;
				height: 30px;
				border-left: 1px dotted #aaa;
				border-bottom: 1px dotted #aaa;
			}
			// &:not(:last-child)::before {
			// 	border-left: 0px;
			// }
			&:not(:last-child)::after {
				position: absolute;
				content: '';
				top: 0px;
				left: 6px;
				bottom: 0px;
				border-left: 1px dotted #aaa;
				z-index: 1;
			}
			&:nth-child(3)::after {
				top: -10px;
				height: calc(100% + 12px);
			}
		}
	}
}
</style>
