<template>
	<view class="login_page">
		<view class="login_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>登录</text>
			<text></text>
		</view>
		<view class="login_content">
			<view class="login_logo">
				<image src="../../static/icons/logo.png"></image>
			</view>
			<view class="content_input">
				<view class="input_border">
					<xfl-select
						:list="selectList"
						:clearable="false"
						:initValue="chosePhoType"
					>
					</xfl-select>
					<text class="vertical"></text>
					<input type="number" maxlength="11" v-model="phoNum" placeholder="请输入手机号码" />
				</view>
				<!-- 验证码登录 -->
				<view v-if="loginType === 0" class="input_border input_code">
					<input type="text" v-model="codeNum" placeholder="请输入短信验证码" />
					<text class="code" @click="getCode">{{getCodeValue}}</text>
				</view>
				<!-- 密码登录 -->
				<view v-else class="input_border input_code">
					<input type="text" v-model="passWord" placeholder="请输入密码" />
				</view>
			</view>
			<view class="login_button button_choose" @click="handleLogin">
				{{this.loginType === 0?buttonValue1:buttonValue2}}
			</view>
			<view class="login_button" @click="handleChangeLoginType">
				{{this.loginType === 0?buttonValue2:buttonValue1}}
			</view>
			<text class="pho_register" @click="handlePhoReg">手机注册</text>
		</view>
	
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	export default {
		components: { xflSelect },
		data() {
			return {
				phoNum: null,
				codeNum: null,
				passWord: null,
				selectList: [
					'+86',
					"+865",
					"+863"
				],
				chosePhoType: '+86',
				getCodeValue: '获取验证码',
				setIntervalCon: null,
				loginType: 0, // 当前登录类型 0:验证码登录，1密码登录
				buttonValue1: '验证码登录',
				buttonValue2: '密码登录'
			};
		},
		methods: {
			// 登录操作
			handleLogin() {
				console.log('登录操作', this.loginType)
				// 判断清空字段
				this.loginType === 0? this.passWord = null : this.codeNum = null
				this.$MR({
					url: 'common/login',
					method: 'POST',
					data: {
						type: this.loginType === 0?2:1,
						phone: this.phoNum,
						password: this.passWord,
						code: this.codeNum
					}
				}).then(res=> {
					console.log('登录操作', res)
					if(res.data.code == 200) {
						// 存token
						uni.setStorageSync('Authorization', res.data.data.token)
						uni.redirectTo({
							url: '/pages/index/index'
						})
					}else {
						// 失败提示
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
							duration: 1000
						});
					}
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 手机注册
			handlePhoReg() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			// 获取验证码逻辑
			getCode() {
				if(this.getCodeValue === '获取验证码') {
					// api操作
					this.$MR({
						url: 'common/sendsms',
						method: 'GET',
						data: {
							phone: this.phoNum,
						}
					}).then(res=> {
						console.log('获取验证码', res)
						// if(res.data.code == 200) {
							
							
						// }else {
						// 	// 失败提示
						// 	uni.showToast({
						// 		icon: 'none',
						// 		title: res.data.msg,
						// 		duration: 1000
						// 	});
						// }
						
						// 倒计时
						this.setInterFun()
					})
					
				}
			},
			// 倒计时函数
			setInterFun() {
				let i = 60
				this.getCodeValue = i
				this.setIntervalCon = setInterval(() => {
					i--
					this.getCodeValue = i
					if(i<1) {
						clearInterval(this.setIntervalCon)
						this.getCodeValue = '获取验证码'
					}
				}, 1000)
			},
			// 改变登录类型
			handleChangeLoginType() {
				this.loginType === 0?this.loginType = 1: this.loginType= 0
			},
		}
	}
</script>

<style lang="scss">
	.login_page {
		padding: 100rpx 5% 0;
		background-image: url(../../static/images/page_bg.png);
		background-size: 100% 100%;
		min-height: calc(100vh - 100rpx);
		color: white;
		.login_top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 52rpx;
			font-size: 17px;
			image {
				width: 56rpx;
				height: 56rpx;
			}
			text {
				margin-right: 24rpx;
			}
		}
		.login_content {
			.login_logo {
				image {
					width: 180rpx;
					height: 220rpx;
					display: block;
					margin: 100rpx auto 0;
				}
			}
			.content_input {
				margin-top: 70rpx;
				margin-bottom: 80rpx;
				.input_border {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					border-bottom: 1px solid rgba(255, 255, 255, 0.45);
					input {
						margin-left: 32rpx;
					}
					.show-box {
						width: 156rpx;
						background-color: rgba(0,0,0,0);
						border: none;
						color: rgba(255, 255, 255, 1);
						margin-right: 16rpx;
					}
					.uni-input-placeholder {
						color: rgba(255, 255, 255, 0.65);
						font-size: 14px;
					}
					
				}
				.input_code {
					justify-content: space-between;
					height: 112rpx;
					.code {
						font-size: 14px;
						display: block;
						width: 160rpx;
						text-align: center;
					}
				}
			}
		}
		.login_button {
			border: 1px solid rgba(255, 255, 255, 1);
			height: 88rpx;
			border-radius: 48rpx;
			text-align: center;
			font-size: 15px;
			line-height: 88rpx;
			color: #FFFFFF;
			margin-bottom: 48rpx;
		}
		.button_choose {
			background-color: #FFFFFF;
			color: rgba(0, 122, 255, 1);
		}
		.pho_register {
			display: block;
			text-align: center;
			font-size: 15px;
		}
		.vertical 
		{
			border: 1px solid rgba(255, 255, 255, 0.45);
			width: 0;
			height: 48rpx;
		}
	}
</style>
