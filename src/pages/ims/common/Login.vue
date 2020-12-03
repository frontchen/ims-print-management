<template>
	<div class="session-wrapper">
		<div class="session-left"></div>
		<div class="session-right text-center">
			<div class="session-table-cell">
				<div class="session-content">
					<h2 class="mb-4">
						<img class="logo" src="/static/img/logo.png" />
					</h2>
					<p class="fs-14 mb-12">请输入账号密码登录IMS印刷管理系统</p>
					<el-form
						:model="formValidate"
						:rules="rules"
						ref="loginForm"
						size="mini"
						:inline="true"
						:label-width="formLabelWidth"
					>
						<el-form-item label="账号:" prop="userName">
							<el-input
								v-model="formValidate.userName"
								autocomplete="off"
								type="text"
								class="login-form-input"
							></el-input>
						</el-form-item>

						<el-form-item label="登录密码:" prop="password">
							<el-input
								v-model="formValidate.password"
								show-password
								type="password"
								autocomplete="off"
								class="login-form-input"
							></el-input>
						</el-form-item>
					</el-form>
					<div class="login-button">
						<el-button
							size="small"
							style="margin-right: 10px"
							type="primary"
							@click="login"
							>登录</el-button
						>

						<span class="ims-btn" @click="register">注册</span>
						<span class="ims-btn" @click="forgetPassword">忘记密码</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const loginStorageKey = 'ims-login'

export default {
	data() {
		return {
			checkbox: false,
			valid: false,
			formValidate: {
				userName: 'admin-main',
				password: 'admin-main',
			},
			formLabelWidth: '100px',
			rules: {
				userName: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur',
					},
				],

				password: [
					{
						required: true,
						message: '登录密码不能为空',
						trigger: 'blur',
					},
				],
			},
			privateKey: process.env.VUE_APP_SECRET_KEY,
		}
	},
	created() {
		this.initLoginInfo()
	},
	methods: {
		initLoginInfo() {
			let vm = this
			let formValidate = vm.formValidate
			const info = window.localStorage.getItem(loginStorageKey)
			try {
				let loginInfo = JSON.parse(info)
				formValidate.userName = loginInfo.userName
				formValidate.password = loginInfo.password
				vm.checkbox = true
			} catch (error) {
				// ...
			}
		},
		login() {
			let vm = this
			let formValidate = vm.formValidate
			let params = {
				bizContent: {
					userName: formValidate.userName,
					password: formValidate.password,
				},
			}
			// 记住账号密码功能
			if (vm.checkbox) {
				const info = JSON.stringify(params)
				window.localStorage.setItem(loginStorageKey, info)
			} else {
				window.localStorage.removeItem(loginStorageKey)
			}
			vm.$refs.loginForm.validate((valid) => {
				if (!valid) return false
				vm.api.account.login(params).then(
					(res) => {
						console.log(['res', res])
						vm.$store.dispatch('account/token', res.token)
						vm.$store.dispatch('account/userInfo', res.userName)
						vm.$router.push({ path: vm.$route.query.redirect || '/' })
					},
					(err) => {
						vm.$message.error(err)
					}
				)
			})
		},
		register() {},
		forgetPassword() {
			// this.$router.push('/forgetPassword')
		},
	},
}
</script>

<style lang="less" scoped>
.logo {
	width: 300px;
	margin-bottom: 30px;
}
.forget-password {
	margin-left: 15px;
	margin-bottom: 6px;
}
.login-form-input {
	width: 180px;
}
.session-wrapper {
	background-color: #fff !important;
}
</style>
