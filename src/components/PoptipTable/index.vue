<template>
	<!-- <div class="poptip-table" :style="style"> -->
	<el-popover
		placement="bottom"
		width="500"
		trigger="click"
		:popper-class="`poptip-table ${popperClass}`"
		v-model="value"
	>
		<el-table
			:data="tableData"
			:height="height"
			:width="width"
			:row-class-name="rowClassName"
			@cell-click="cellClick"
		>
			<el-table-column
				v-for="(item, index) in tableColumns"
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
		<el-pagination
			@current-change="changePage"
			:current-page="currentPage"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="togalNum"
		>
		</el-pagination>
	</el-popover>
	<!-- </div> -->
</template>

<script>
import Expand from 'Components/GraphicText/expand'
export default {
	name: 'poptip-table',
	components: {
		Expand,
	},
	props: {
		columns: {
			type: Array,
			default: () => [],
		},
		data: {
			type: Array,
			default: () => [],
		},
		value: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Number,
			default: 400,
		},
		width: {
			type: Number,
			default: 400,
		},
		pageSize: {
			type: Number,
			default: 20,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		togalNum: {
			type: Number,
			default: 1,
		},
		popperOptions: {
			type: Object,
			default: () => {},
		},
		rowClassName: {
			type: String,
			default: '',
		},
		popperClass: {
			type: String,
			default: '',
		},
	},
	data() {
		return {}
	},
	computed: {
		style() {
			return {
				width: this.width + 'px',
				height: this.height + 'px',
			}
		},
		tableColumns() {
			return this.columns
		},
		tableData() {
			return this.data
		},
		newPopperOptions() {
			console.log(['popperOptions', this.popperOptions])
			return this.popperOptions
		},
	},
	methods: {
		changePage(page) {
			this.$emit('on-page-change', page)
		},
		cellClick(row, column, cell, event) {
			this.$emit('cell-click', row, column, cell, event)
		},
	},
	watch: {
		value(val) {
			this.$emit('input', val)
		},
	},
}
</script>

<style lang="less" scoped>
/deep/.poptip-table {
	max-height: 500px;
}
</style>