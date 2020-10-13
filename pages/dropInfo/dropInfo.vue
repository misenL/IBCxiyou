<template>
	<view class="dropInfo">
		<view class="top_drop">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>空投情报</text>
			<text></text>
		</view>
		<view class="content_drop">
			<view>
				<text>累积空投数量</text>
				<text>{{addDropNum}} IBC</text>
			</view>
			<view>
				<text>剩余空投数量</text>
				<text>{{remainDrop}} IBC</text>
			</view>
			<view>
				<text>累积空投帐号数量</text>
				<text>{{remainAccNum}}</text>
			</view>
		</view>
		<view class="rule_drop">
			<text>空投规则</text>
			<view class="rule_info">
				<rich-text :nodes="ruleRich"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addDropNum: '', // 累积空投数量
				remainDrop: '', // 剩余空投数量
				remainAccNum: '', //累积空投帐号数量
				ruleRich: '',
			};
		},
		onLoad() {
			this.getCommon()
			this.getDropInfo()
		},
		methods: {
			// 获取空投数据
			getDropInfo() {
				this.$MR({
					url: 'drop/info',
				}).then(res=> {
					console.log('获取空投数据', res)
					if(res.data.code == 200) {
						this.addDropNum = res.data.data[3] + res.data.data[4]
						this.remainDrop = res.data.data[2] - res.data.data[3] - res.data.data[4]
						this.remainDrop <0?this.remainDrop = 0: ''
						this.remainAccNum = res.data.data[5] + res.data.data[6]
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
			// 获取通用数据
			getCommon() {
				const _this = this
				_this.$MR({
					url: 'common/explain',
				}).then(res=> {
					console.log('获取通用数据', res)
					if(res.data.code == 200) {
						_this.ruleRich = _this.escapeHtml(res.data.data.paradrop_role)
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
		}
	}
</script>

<style lang="scss">
	.dropInfo {
		padding: 100rpx 5% 0;
		background-image: url(../../static/images/page_bg.png);
		background-size: 100% 100%;
		min-height: calc(100vh - 100rpx);
		color: white;
		.top_drop {
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
		.content_drop {
			background-image: url(../../static/images/white_bg.png);
			background-size: cover;
			height: 186rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding: 30rpx 0;
			view {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-left: 60rpx;
				text {
					font-size: 18px;
					&:first-child {
						font-size: 12px;
						width: 200rpx;
					}
					&:last-child {
						margin-left: 10rpx;
					}
				}
				
			}
		}
		.rule_drop {
			font-size: 18px;
			margin-top: 54rpx;
			.rule_info {
				margin-top: 28rpx;
				background-color: white;
				font-size: 14px;
				color: rgba(0, 0, 0, 0.65);
				padding: 44rpx 32rpx 62rpx;
				border-radius: 8px;
				line-height: 25px;
			}
		}
	}
</style>
