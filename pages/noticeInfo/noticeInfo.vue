<template>
	<view class="notice_info">
		<view class="info_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>公告详情</text>
			<text></text>
		</view>
		<view class="info_center">
			<text class="center_title">{{noticeData.title}}</text>
			<view class="center_content">
				<rich-text :nodes="noticeData.text"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeData: {},
			};
		},
		onLoad(option) {
			console.log(option)
			this.getNoticeInfo(option.id)
		},
		methods: {
			// 获取公告详情
			getNoticeInfo(id) {
				const _this = this
				_this.$MR({
					url: 'common/noticeInfo',
					data: {
						id: id
					}
				}).then(res=> {
					console.log('获取公告详情', res)
					if(res.data.code == 200) {
						_this.noticeData = res.data.data
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
	.notice_info {
		padding: 100rpx 0 0;
		background-color: rgba(0, 80, 221, 1);
		color: white;
		.info_top {
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
		.info_center {
			color: #000000;
			background-color: #FFFFFF;
			.center_title {
				display: block;
				text-align: center;
				font-size: 16px;
				padding: 30rpx 0;
			}
			.center_content {
				font-size: 14px;
				padding: 0 20rpx;
			}
		}
	}
</style>
