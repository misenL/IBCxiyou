<template>
	<view class="ImproveInfo_page">
		<text class="topTitle">完善信息</text>
		<view class="improve_content">
			<view class="logo">
				<image src="../../static/icons/logo.png"></image>
			</view>
			<view class="content_input">
				<view class="input_border">
					<input v-model="picName" placeholder="请输入昵称" />
				</view>
				<view class="input_border">
					<input v-model="password" placeholder="请输入密码" />
				</view>
				<view class="input_border">
					<input v-model="passwordCon" placeholder="请再次输入密码" />
				</view>
			</view>
			<text class="reg_aggr">* 密码为8～16位非中文字符，区分大小写</text>
			<view class="register_button" @click="handleReg">
				完成注册
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				picName: '',
				password: '',
				passwordCon: ''
			};
		},
		methods: {
			// 完成注册
			handleReg() {
				const _this = this
				_this.$MR({
					url: 'member/edit',
					method: 'POST',
					data: {
						nickname: _this.picName,
						password: _this.password,
						repPassword: _this.passwordCon
					}
				}).then(res=> {
					console.log('完成注册', res)
					if(res.data.code == 200) {
						// 成功提示
						uni.showToast({
							icon: 'success',
							title: '操作成功',
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
			}
		}
	}
</script>

<style lang="scss">
	.ImproveInfo_page {
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
		.improve_content {
			.logo {
				image {
					width: 180rpx;
					height: 220rpx;
					display: block;
					margin: 100rpx auto 0;
				}
			}
			.content_input {
				margin-top: 70rpx;
				margin-bottom: 40rpx;
				.input_border {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					border-bottom: 1px solid rgba(255, 255, 255, 0.45);
					height: 112rpx;
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
			}
			.reg_aggr {
				display: block;
				text-align: left;
				font-size: 12px;
				margin-bottom: 96rpx;
				padding-left: 30rpx;
			}
		}
		.register_button {
			border: 1px solid rgba(255, 255, 255, 1);
			height: 88rpx;
			border-radius: 48rpx;
			text-align: center;
			font-size: 15px;
			line-height: 88rpx;
			margin-bottom: 48rpx;
			background-color: #FFFFFF;
			color: rgba(0, 122, 255, 1);
		}
	
	
	}
</style>
