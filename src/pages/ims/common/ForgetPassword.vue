<template>
	<div class="session-wrapper">
		<div class="session-left"></div>
		<div class="session-right text-center">
			<div class="session-table-cell">
				<div class="session-content">
					<h2 class="mb-4">
						<img class="logo" src="../../../../public/static/img/logo.png" />
					</h2>
					<p class="font-md mb-12">找回密码</p>
					<v-form v-model="valid" class="mb-5" ref="forgetPassword">
						<v-text-field
							label="手机号"
							v-model="phone"
							:rules="phoneRules"
							required
						></v-text-field>
						<el-row type="flex" align="middle">
							<v-text-field
								label="验证码"
								v-model="verificationCode"
								type="text"
								:rules="verificationCodeRules"
								required
							></v-text-field>
							<v-btn
								small
								@click="sendCode"
								:disabled="sendBtnDisabled"
								color="primary"
								class="mb-2"
								>{{ sendBtnText }}</v-btn
							>
						</el-row>
						<v-text-field
							label="新密码"
							v-model="password"
							type="password"
							:rules="passwordRules"
							required
						></v-text-field>
						<v-text-field
							label="再次输入"
							v-model="repeatPassword"
							type="password"
							:rules="passwordRules"
							required
						></v-text-field>
						<div>
							<v-btn large @click="submit" block color="primary" class="mb-2"
								>确定</v-btn
							>
						</div>
					</v-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			checkbox: false,
			valid: false,
			sendBtnText: '发送验证码',
			sendBtnDisabled: false,
			codeStatus: false, // 是否发送验证码 false 未发送 true已发送
			timer: null,
			time: 60,
			phone: '',
			password: '',
			verificationCode: '',
			repeatPassword: '',
			phoneRules: [
				(v) => !!v || '手机号不能为空',
				(v) =>
					/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8|9][0-9]))\d{8}$/.test(
						v
					) || '手机号格式错误',
			],
			verificationCodeRules: [(v) => !!v || '验证码不能为空'],
			passwordRules: [(v) => !!v || '密码不能为空'],
			repeatPasswordRuels: [
				(v) => !!v || '密码不能为空',
				(v) => v !== this.password || '重复密码与新密码不一致',
			],
		}
	},
	methods: {
		// 发送验证码
		sendCode() {
			let vm = this
			if (!vm.phone) {
				return vm.$message.error('手机号不能为空')
			}
			if (vm.sendBtnDisabled) {
				return
			}
			let params = {
				phone: vm.phone,
			}
			vm.api.account.sendCode(params).then(
				(res) => {
					vm.sendBtnDisabled = true
					console.log(['sendCode', res])
					vm.getSendCodeBtnText()
				},
				(err) => {
					vm.$message.error(err)
				}
			)
		},
		getSendCodeBtnText() {
			let vm = this
			vm.timer = setInterval(() => {
				vm.time -= 1

				if (vm.time === 0) {
					vm.sendBtnText = `再次发送验证码`
					vm.sendBtnDisabled = false
					vm.time = 60
					clearInterval(vm.timer)
				} else {
					vm.sendBtnText = `${vm.time}秒后再次发送`
				}
			}, 1000)
		},
		async submit() {
			let vm = this
			let valid = await vm.$refs.forgetPassword.validate()
			console.log(['valid', valid])
			if (valid) {
				let params = {
					phone: vm.phone,
					new_password: vm.password, // 密码
					code: vm.verificationCode, //验证码
				}
				vm.api.account.changePassword(params).then(
					() => {
						vm.$router.push({
							path: '/login',
							params: {
								phone: vm.phone,
								password: vm.password, // 密码
							},
						})
					},
					(err) => {
						vm.$message({
							type: 'error',
							message: err,
						})
					}
				)
			}
		},
	},
}
</script>

<style lang="less" scoped>
.logo {
	width: 300px;
	margin-bottom: 30px;
}
.session-wrapper {
	background-color: #fff !important;
}
</style>
