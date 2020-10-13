<template>
	<view class="aboutWe_page">
		<view class="info_top">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>{{title}}</text>
			<text></text>
		</view>
		<view class="info_center">
			<!-- <text class="center_title">{{contentData.title}}</text>
			<view class="center_content">
				<rich-text :nodes="contentData.text"></rich-text>
			</view> -->
			<rich-text :nodes="contentData"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				contentData: {},
			};
		},
		onLoad(option) {
			// console.log(option)
			this.title = option.title
			this.getNoticeInfo(option.title)
		},
		methods: {
			// 获取内容详情
			getNoticeInfo(val) {
				const _this = this
				_this.$MR({
					url: 'common/explain',
				}).then(res=> {
					console.log('获取内容详情', res)
					if(res.data.code == 200) {
						if(val === '联系我们') {
							_this.contentData = _this.escapeHtml(res.data.data.contact_us)
						}else {
							_this.contentData = _this.escapeHtml(res.data.data.about_us)
						}
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
	.aboutWe_page {
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
