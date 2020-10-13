<template>
	<view class="register_page">
		<text class="topTitle">注册</text>
		<view class="register_content">
			<view class="register_logo">
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
				<!-- 验证码 -->
				<view  class="input_border input_code">
					<input type="text" v-model="codeNum" placeholder="请输入短信验证码" />
					<text class="code" @click="getCode">{{getCodeValue}}</text>
				</view>
				<view class="input_border input_code">
					<input type="text" v-model="invitationNum" placeholder="输入邀请码（必填）" />
				</view>
			</view>
			<text class="reg_aggr">点击“注册”表示您已阅读并同意<text @click="handleToRule" style="text-decoration: underline">《用户服务协议》</text></text>
			<view class="register_button button_choose" @click="handleRegister">
				手机注册
			</view>
			<view class="register_button" @click="handlePhoReg">
				验证码登录
			</view>
			<text class="pho_register" @click="handlePhoReg">密码登录</text>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoNum: null,
				codeNum: null,
				invitationNum: null,
				selectList: [
					'+86',
					"+865",
					"+863"
				],
				chosePhoType: '+86',
				getCodeValue: '获取验证码',
				setIntervalCon: null,
			};
		},
		methods: {
			// 手机注册
			handleRegister() {
				console.log('handleRegister', this.phoNum, this.codeNum, this.invitationNum)
				this.$MR({
					url: 'common/register',
					method: 'POST',
					data: {
						phone: this.phoNum,
						invite_code: this.invitationNum,
						code: this.codeNum
					}
				}).then(res => {
					// console.log('手机注册', res)
					if(res.data.code == 200) {
						// 存token
						uni.setStorageSync('Authorization', res.data.data.token)
						// 成功提示
						uni.showToast({
							icon: 'success',
							title: '注册成功',
							duration: 800
						});
						// 同提示同一时间跳页面
						setTimeout(()=> {
							uni.navigateTo({
								url: '/pages/ImproveInfo/ImproveInfo'
							})
						},800)
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
			// 用户协议
			handleToRule() {
				uni.navigateTo({
					url: '/pages/userAgreement/userAgreement'
				})
			},
			// 登录
			handlePhoReg() {
				uni.navigateTo({
					url: '/pages/login/login'
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
		}
		
	}
</script>

<style lang="scss">
	.register_page {
		padding: 100rpx 5% 0;
		background-image: url(../../static/images/page_bg.png);
		background-size: 100% 100%;
		min-height: calc(100vh - 100rpx);
		color: white;
		.topTitle {
			display: block;
			color: white;
			font-size: 17px;
			line-height: 17px;
			text-align: center;
			margin-bottom: 50rpx;
		}
		.register_content {
				.register_logo {
					image {
						width: 180rpx;
						height: 220rpx;
						display: block;
						margin: 100rpx auto 0;
					}
				}
				.content_input {
					margin-top: 70rpx;
					margin-bottom: 30rpx;
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
			.reg_aggr {
				display: block;
				text-align: center;
				font-size: 12px;
				margin-bottom: 96rpx;
			}
			.register_button {
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
				padding-bottom: 140rpx;
			}
			.vertical 
			{
				border: 1px solid rgba(255, 255, 255, 0.45);
				width: 0;
				height: 48rpx;
			}
		
	}
</style>
