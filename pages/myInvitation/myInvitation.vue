<template>
	<view class="myInvitation_page">
		<view class="page_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>我的邀请</text>
			<text></text>
		</view>
		<!-- 邀请码和按钮那一块 -->
		<view class="invi_bg">
			<view class="invitation_info">
				<text style="font-size: 32px;">{{inviCode}}</text>
				<view class="">
					<text>邀请好友得算力</text>
					<text>挖矿助你一臂之力</text>
				</view>
			</view>
			<view class="invitation_button">
				<text>下载邀请海报</text>
				<text>复制邀请链接</text>
				<text>复制邀请码</text>
			</view>
		</view>
		<view class="invitation_sum">
			<view class="">
				<text>矿工总量：{{inviState.count}} 人</text>
			</view>
			<view class="">
				<text>挖矿总量：{{inviState.sum}} IBC</text>
			</view>
		</view>
		<!-- 邀请用户列表 -->
		<view class="invitation_list">
			<view v-for="(item,index) in inviArr" :key="index">
				<image :src="item.headimg||'../../static/icons/user_d.png'"></image>
				<text class="list_name">{{item.nickname||item.phone}}</text>
				<text style="margin-right: 100rpx;">{{item.ibc}}</text>
				<text style="font-size: 12px;">{{item.create_at.split(' ')[0]}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inviCode: '',
				inviArr: [
					{url: '../../static/icons/user_d.png', name: '卓艳以', money: '123787.0879', time: '2020/10/07'},
					{url: '../../static/icons/user_d.png', name: '苍岚思', money: '4296.8009', time: '2020/10/07'},
				],
				inviState: {},	// 邀请统计
			};
		},
		onLoad() {
			// console.log('我的邀请 onload')
			this.inviCode = uni.getStorageSync('invite_code')
			this.getInviList()
			this.getInviState()
		},
		methods: {
			// 获取邀请列表
			getInviList() {
				const _this = this
				_this.$MR({
					url: 'member/myInvitation',
					method: 'POST',
					data: {
						page: 1,
						size: 100
					}
				}).then(res=> {
					console.log('获取邀请列表', res)
					if(res.data.code == 200) {
						_this.inviArr = res.data.data
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
			// 获取邀请统计
			getInviState() {
				const _this = this
				_this.$MR({
					method: 'POST',
					url: 'member/invitation_count',
					data: {
						page: 1,
						size: 100
					},
				}).then(res => {
					console.log('获取邀请统计', res)
					if(res.data.code == 200) {
						_this.inviState = res.data.data
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
	.myInvitation_page {
		padding: 100rpx 5% 0;
		background-image: url(../../static/images/page_bg.png);
		background-size: 100% 100%;
		min-height: calc(100vh - 100rpx);
		color: white;
		.page_top {
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
		.invi_bg {
			margin-top: 20rpx;
			height: 212rpx;
			background-image: url(../../static/images/white_bg.png);
			background-size: 100% 100%;
			padding: 28rpx 32rpx;
			.invitation_info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				view {
					font-size: 12px;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: flex-end;
					height: 112rpx;
				}
			}
			.invitation_button {
				display: flex;
				justify-content: space-between;
				margin-top: 22rpx;
				text {
					height: 34rpx;
					padding: 14rpx 30rpx;
					border-radius: 50rpx;
					background-color: white;
					color: rgba(0, 122, 255, 1);
					font-size: 11px;
				}
			}
		}
		.invitation_sum {
			font-size: 13px;
			margin-top: 30rpx;
			view {
				margin-bottom: 20rpx;
			}
		}
		.invitation_list {
			margin-top: 30rpx;
			view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0px 1px 0px 0px rgba(230, 230, 230, 0.15);
				font-size: 14px;
				height: 128rpx;
				.list_name {
					margin-right: auto;
					margin-left: 32rpx;
				}
				image {
					width: 72rpx;
					height: 72rpx;
				}
			}
		}
	}
</style>
