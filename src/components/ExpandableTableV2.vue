<template>
	<v-expansion-panels v-model="panel">
		<v-expansion-panel
			v-for="(data, index) in walletData"
			:key="index"
			expand-icon="mdi-menu-down"
		>
			<!-- <v-expansion-panel-header>
				<div>
					<h4 class="mb-0">
						<span>
							<i class="font-lg mr-2" :class="data.icon"></i>
							{{ data.title }}
						</span>
					</h4>
				</div>
			</v-expansion-panel-header> -->
			<v-expansion-panel-content>
				<v-container fluid grid-list-xl>
					<v-layout
						row
						wrap
						align-items-center
						colClasses="xl6 lg6 md6 sm12 xs12"
					>
						<v-flex d-flex xs12 sm7 md7>
							<div>
								<div class="mb-4">
									<div class="d-custom-flex align-items-center py-2">
										<div class="icon-wrap">
											<!-- <i class="zmdi zmdi-money-box mr-3 font-lg primary--text"></i> -->
										</div>
										<div>
											<!-- <h6 class="mb-0">余额</h6> -->
											<!-- <span class="font-lg">{{ balance }}元</span> -->
											你好,欢迎使用IMS印刷管理系统
										</div>
									</div>
								</div>
								<!-- <v-btn class="info m-0">立即充值</v-btn> -->
							</div>
						</v-flex>
					</v-layout>
				</v-container>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
export default {
	props: {
		balance: Number, // 账号余额
	},
	data() {
		return {
			panel: 0,
			walletData: [
				{
					icon: 'zmdi zmdi-money-box mr-3 primary--text',
					iconForWallet: 'cc BTC-alt',
					title: '',
				},
			],
		}
	},
	methods: {},
}
</script>
