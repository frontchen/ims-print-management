<template>
	<div>
		<v-container fluid pt-0 grid-list-xl>
			<v-flex xs12 sm12>
				<div
					colClasses="xl7 lg7 md7 sm12 xs12"
					class="home-text"
					customClasses="mb-0"
				>
					你好,欢迎使用IMS印刷管理系统
				</div>
			</v-flex>
		</v-container>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	mounted() {},
	methods: {},
}
</script>

<style lang="less" scoped>
.home-text {
	position: relative;
	top: 40px;
}
</style>
