<template>
	<view class="userAgreement">
		<view class="agreement_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>用户服务协议</text>
			<text></text>
		</view>
		<view class="agreement_center">
			<text class="center_title">IBC西柚5C赋能矿池用户服务协议</text>
			<view class="agreement_content">
				<rich-text :nodes="ruleRich"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ruleRich: ''
			};
		},
		onLoad() {
			this.getCommon()
		},
		methods: {
			// 获取通用数据
			getCommon() {
				const _this = this
				_this.$MR({
					url: 'common/explain',
				}).then(res=> {
					console.log('获取通用数据', res)
					if(res.data.code == 200) {
						_this.ruleRich = _this.escapeHtml(res.data.data.member_protocol)
						console.log('获取通用数据', _this.ruleRich )
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
			// 反转义函数
			escapeHtml(str) {
			  let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
			  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
			    return arrEntities[t];
			  });
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
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
	.userAgreement {
		padding: 100rpx 0 0;
		background-color: rgba(0, 80, 221, 1);
		color: white;
		.agreement_top {
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
		.agreement_center {
			color: #000000;
			background-color: #FFFFFF;
			.center_title {
				display: block;
				text-align: center;
				font-size: 16px;
				padding: 30rpx 0;
			}
			.agreement_content {
				font-size: 14px;
				padding: 0 20rpx;
			}
		}
	}
</style>
