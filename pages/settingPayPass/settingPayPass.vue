<template>
	<view class="payPass_page">
		<view class="payPass_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>设置支付密码</text>
			<text></text>
		</view>
		<view class="payPass_center">
			<view class="center_input">
				<input type="text" v-model="loginPass" placeholder="请输入登录密码" />
			</view>
			<view class="center_input">
				<input type="text" v-model="payPass" placeholder="请输入8位数字支付密码" />
			</view>
			<view class="center_input">
				<input type="text" v-model="payPassConfirm" placeholder="请再次输入支付密码" />
			</view>
			<view class="center_submit" @click="handleSubmit">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginPass: '',
				payPass: '',
				payPassConfirm: ''
			};
		},
		methods: {
			// 提交修改
			handleSubmit() {
				const _this = this
				_this.$MR({
					url: 'member/editPayPass',
					method: 'POST',
					data: {
						password: _this.loginPass,
						pay_pass: _this.payPass,
						rep_pay_pass: _this.payPassConfirm
					}
				}).then(res=> {
					console.log('提交修改', res)
					if(res.data.code == 200) {
						// 成功提示
						uni.showToast({
							icon: 'success',
							title: '修改成功',
							duration: 800
						});
						// 同提示同一时间跳页面
						setTimeout(()=> {
							uni.navigateTo({
								url: '/pages/index/index'
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
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.payPass_page {
		padding: 100rpx 0 0;
		background-color: rgba(0, 80, 221, 1);
		color: white;
		.payPass_top {
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
			font-size: 17px;
			image {
				width: 56rpx;
				height: 56rpx;
			}
			text {
				margin-right: 24rpx;
			}
		}
		.payPass_center {
			padding: 40rpx 5% 0;
			width: 100%;
			background-color: #FFFFFF;
			.center_input {
				color: #000000;
				display: flex;
				align-items: center;
				padding-left: 32rpx;
				font-size: 14px;
				width: calc(90% - 32rpx);
				border-radius: 8px;
				height: 88rpx;
				background-color: rgba(239, 239, 239, 1);
				margin-bottom: 32rpx;
				.uni-input-placeholder {
					color: rgba(0, 0, 0, 0.65);
					font-size: 14px;
				}
			}
		}
		.center_submit{
			width: 90%;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			background-color: rgba(0, 122, 255, 1);
			border-radius: 22px;
			margin-top: 60rpx;
		}
	
	}
</style>
