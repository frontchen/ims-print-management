<!-- Side Structure -->
<template>
	<div class="sidebar sidebar-overlay-dark">
		<vue-perfect-scrollbar class="scroll-area" :settings="settings">
			<div class="transparent navigation">
				<v-list>
					<div class="site-logo">
						<router-link to="/">
							<div style="font-size: 22px">IMS印刷管理系统</div>
						</router-link>
					</div>
					<user-block></user-block>
					<template v-for="(category, key) in menus">
						<div :key="key">
							<div class="sidebar-title px-4">
								<span>{{ key }}</span>
							</div>
							<template v-for="item in category">
								<template v-if="item.items != null">
									<v-list-group
										:ripple="false"
										:key="item.title"
										prepend-icon="arrow_right"
										append-icon
										no-action
										v-model="item.active"
									>
										<v-list-item slot="activator" :ripple="false">
											<v-list-item-content>
												<v-list-item-title v-if="item.items != null">
													<i
														class="mr-3 zmdi"
														v-if="item.action"
														:class="item.action"
													></i>
													<span>{{ textTruncate(item.title) }}</span>
													<template v-if="item.label == 'New'">
														<span class="sidebar-label">{{ item.label }}</span>
													</template>
												</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
										<v-list-item
											:ripple="false"
											v-for="subItem in item.items"
											v-bind:key="subItem.title"
											:to="subItem.path"
										>
											<v-list-item-content>
												<v-list-item-title>
													{{ textTruncate(subItem.title) }}
													<template v-if="subItem.label == 'New'">
														<span class="sidebar-label">New</span>
													</template>
												</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</v-list-group>
								</template>
								<template v-else>
									<v-list-group
										:ripple="false"
										class="not-submenu"
										:key="item.title"
										prepend-icon="arrow_right"
										append-icon
										no-action
										v-model="item.active"
									>
										<v-list-item slot="activator" :ripple="false">
											<v-list-item-content>
												<v-list-item-title>
													<router-link :to="item.path">
														<i class="mr-3 zmdi" :class="item.action"></i>
														<span>{{ textTruncate(item.title) }}</span>
														<template v-if="item.label == 'New'">
															<span class="sidebar-label">New</span>
														</template>
													</router-link>
												</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</v-list-group>
								</template>
							</template>
						</div>
					</template>
				</v-list>
			</div>
		</vue-perfect-scrollbar>
	</div>
</template>

<script>
import UserBlock from './UserBlock'

export default {
	components: {
		UserBlock,
	},
	data() {
		return {
			appLogo: '/static/img/logo-sidebar.png',
			settings: {
				maxScrollbarLength: 160,
			},
			menus: {
				全部功能: [
					{
						action: 'zmdi-view-dashboard',
						title: '首页面板',
						active: true,
						label: 'Old',
						path: '/',
						items: null,
					},
					{
						action: 'zmdi-shopping-cart',
						title: '工单管理',
						active: false,
						label: 'Old',
						items: [
							{
								title: '工单列表',
								path: '/work/list',
								label: 'Old',
							},
						],
					},
					{
						action: 'zmdi-assignment-check',
						title: '基础功能',
						active: false,
						label: 'Old',
						items: [
							{
								title: '工艺',
								path: '/basis/craftList',
								label: 'Old',
							},
							{
								title: '客户群组',
								path: '/basis/customerGroup',
								label: 'Old',
							},
							{
								title: '客户列表',
								path: '/basis/customer',
								label: 'Old',
							},
							{
								title: '付款方式',
								path: '/basis/paymentMethod',
								label: 'Old',
							},
							{
								title: '开料尺寸',
								path: '/basis/cutSize',
								label: 'Old',
							},
							{
								title: '部门列表',
								path: '/basis/department',
								label: 'Old',
							},
							{
								title: '刀版',
								path: '/basis/knifePlate',
								label: 'Old',
							},
							{
								title: '物料',
								path: '/basis/material',
								label: 'Old',
							},
							{
								title: '物料群组',
								path: '/basis/materialGroup',
								label: 'Old',
							},
							{
								title: '供应商',
								path: '/basis/supplier',
								label: 'Old',
							},
							{
								title: '供应商群组',
								path: '/basis/supplierGroup',
								label: 'Old',
							},
						],
					},
				],
				// 设置: [
				// 	{
				// 		action: 'zmdi-account-box',
				// 		title: '账户中心',
				// 		active: false,
				// 		label: 'Old',
				// 		items: [
				// 			{
				// 				title: '账户资料',
				// 				path: '/users/information',
				// 				label: 'Old',
				// 			},
				// 		],
				// 	},
				// ],
			},
		}
	},

	methods: {
		textTruncate(text) {
			return text
		},
	},
}
</script>
