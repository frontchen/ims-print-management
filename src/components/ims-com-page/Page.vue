<template>
	<div class="ims-com-page">
		<slot>
			<el-row align="middle">
				<el-col span="5" class="page-button">
					<i class="el-icon-arrow-left" @click="skipFirst"></i>
					<Icon type="md-play ims-page-prev" size="15" @click="skipPrev" />
					<span>| 第</span>
					<template>
						<Input v-model="page.pageIndex" @on-enter="skipPage" />
					</template>
					<span>/{{ page.totalPage }}页 |</span>
					<Icon type="md-play" size="15" @click="skipNext" />
					<Icon type="md-skip-forward" size="15" @click="skipLast" />
				</el-col>
				<el-col span="19">
					<slot name="right">
						<div class="page-number">共{{ page.totalNumber }}条数据显示</div>
					</slot>
				</el-col>
			</el-row>
		</slot>
	</div>
</template>

<script>
export default {
	name: 'ims-com-page',
	props: {
		pages: {
			type: Object,
			default() {
				return {
					pageIndex: 1,
					totalNumber: 0,
					totalPage: 1,
				}
			},
		},
	},
	data() {
		return {
			page: this.pages,
		}
	},
	created() {},
	methods: {
		// 第一页
		skipFirst() {
			let vm = this
			vm.$set(vm.page, 'pageIndex', 1)
			vm.$emit('on-page-change', vm.page)
		},
		// 最后一页
		skipLast() {
			let vm = this
			vm.$set(vm.page, 'pageIndex', vm.page.totalPage)
			vm.$emit('on-page-change', vm.page)
		},
		// 前一页
		skipPrev() {
			let vm = this
			if (vm.page.pageIndex > 1) {
				vm.page.pageIndex--
				vm.$set(vm.page, 'pageIndex', vm.page.pageIndex)
			}
			vm.$emit('on-page-change', vm.page)
		},
		// 后一页
		skipNext() {
			let vm = this
			if (vm.page.pageIndex < vm.page.totalPage) {
				vm.page.pageIndex++
				vm.$set(vm.page, 'pageIndex', vm.page.pageIndex)
			}
			vm.$emit('on-page-change', vm.page)
		},
		// 跳转某一页
		skipPage() {
			let vm = this
			let pageIndex = vm.page.pageIndex
			if (vm.page.pageIndex < 1) {
				pageIndex = 1
			}
			if (vm.page.pageIndex > vm.page.totalPage) {
				pageIndex = vm.page.totalPage
			}
			vm.$set(vm.page, 'pageIndex', pageIndex)
			vm.$emit('on-page-change', vm.page)
		},
	},
	watch: {
		'pages.pageIndex'(newProps) {
			this.page.pageIndex = newProps
		},
		'pages.totalNumber'(newProps) {
			this.page.totalNumber = newProps
		},
		'pages.totalPage'(newProps) {
			this.page.totalPage = newProps
		},
	},
}
</script>

<style lang="less" scoped>
@import '../../styles/main';
@import '../../styles/components/page';
</style>
