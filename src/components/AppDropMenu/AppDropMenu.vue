<template>
	<el-dropdown :trigger="trigger" :transfer="transfer" @command="dropClick">
		<div class="drop-title">
			<span v-if="type === 'text'" class="ims-btn">{{ name }}</span>
			<i class="el-icon-setting"></i>
		</div>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item
				v-for="(item, index) in data"
				:key="index"
				:command="item.value"
				>{{ item.label }}</el-dropdown-item
			>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
export default {
	name: 'com-tree-dropmenu',
	props: {
		trigger: {
			type: String,
			default: 'hover',
		},
		transfer: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: 'icon',
		},
		name: {
			type: String,
			default: '编辑',
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {}
	},
	methods: {
		dropClick(name) {
			this.$emit('on-click', name)
		},
	},
}
</script>

<style lang="less" scoped>
@import '../styles/colors.less';

.drop-title {
	cursor: pointer;
	.surmaxfont {
		color: @ims-main-color;
	}
}
</style>
