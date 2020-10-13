<template>
	<view class="homePage">
		<text class="topTitle">IBC西柚</text>
		<view class="topNotice">
			<!-- <uni-notice-bar showIcon="true" scrollable="true" single="true" :text="noticeText"></uni-notice-bar> -->
			<image src="../../static/icons/notice.png"></image>
			<view class="notice_scroll">
				<view class="notice_content" :style="'top: '+ noticeTop + 'px'">
					<text @click="handleNotice(item)" v-for="(item, index) in noticeArr" :key="index">{{item.title}}</text>
				</view>
			</view>
		</view>
		<view class="topSwiper">
			<swiper class="banner_swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in bannerArr" :key="index">
					<view class="swiper-item"><image :src="item.images"></image></view>
				</swiper-item>
			</swiper>
			<!-- <image src="../../static/images/banner.jpg"></image> -->
		</view>
		<view class="dropNumber" @click="handleDrop">
			<image src="../../static/icons/candy.png"></image>
			<text style="margin-right: auto;">空投总量： {{dropNumber}}</text>
			<text>{{isDrop?'糖果空投中':'空投已结束'}}</text>
			<image src="../../static/icons/arrow_right.png"></image>
		</view>
		<!-- 中间的icon图标 -->
		<view class="gridIcon">
			<view @click="handleGridIcon(index)" class="itemIcon" v-for="(item, index) in gridIcon" :key="index">
				<image :src="item.url"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
		<!-- 废矿井 -->
		<view class="abandonMine">
			<view class="mine_left">
				<text style="font-size: 32px;">废矿井</text>
				<text>随着废除的币的增加</text>
				<text>废除币的数目也随之增加</text>
				<view class="left_button" @click="handleMine">
					点击查看
				</view>
			</view>
			<image src="../../static/images/dynamic.gif"></image>
		</view>
		<!-- 三个图标块 -->
		<view class="card_block">
			<view class="cardItem" v-for="(item,index) in cardArr" :key="index" :style="'background-image: url('+item.urlBg+')'">
				<image :src="item.urlIcon"></image>
				<text style="font-size: 18px;">{{item.title}}</text>
				<text>{{item.text}}</text>
			</view>
		</view>
		<view class="infoSite">
			<text>行情情报站</text>
			<view class="site_block" @click="">
				<image src="../../static/icons/site_icon.png"></image>
				<view class="site_font">
					<text style="font-size: 16px;">{{moneyNum}} USDT</text>
					<text class="rangeFont" :style="rangeType === 1?'color: rgba(76, 217, 100, 1);':'color: red'"> 幅度：{{rangeType===1?'+'+range: range}}%</text>
				</view>
			</view>
		</view>
		<!-- 弹框 -->
		<view class="wait_popup" v-if="isShowWait">
			<image src="../../static/icons/clock.png"></image>
			<text>暂未开放，敬请期待</text>
		</view>
	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				noticeInter: null,
				noticeTop: 0,
				noticeArr: [],
				dropNumber: '',
				bannerArr: [],
				isDrop: true,	// 糖果是否空投中：ture：投中
				// 页面中部的八个icon
				gridIcon: [
					{url: '../../static/icons/gridIcon/icon1.png', text: '交易'},
					{url: '../../static/icons/gridIcon/icon2.png', text: '充值'},
					{url: '../../static/icons/gridIcon/icon4.png', text: '立即挖矿'},
					{url: '../../static/icons/gridIcon/icon5.png', text: '旅游'},
					{url: '../../static/icons/gridIcon/icon6.png', text: '借贷'},
					{url: '../../static/icons/gridIcon/icon7.png', text: '理财'},
					{url: '../../static/icons/gridIcon/icon8.png', text: '更多'},
					{url: '../../static/icons/gridIcon/icon3.png', text: '订制'},
				],
				// 三分卡片块
				cardArr: [
					{urlBg:'../../static/icons/card/card_1.png', urlIcon:'../../static/icons/card/card_1_icon.png', title:'全球购', text:'优选全球'},
					{urlBg:'../../static/icons/card/card_2.png', urlIcon:'../../static/icons/card/card_2_icon.png', title:'新手学堂', text:'链接多元技能'},
					{urlBg:'../../static/icons/card/card_3.png', urlIcon:'../../static/icons/card/card_3_icon.png', title:'西柚直播', text:'敬请期待'}
				],
				moneyNum: 0,
				range: 0,
				rangeType: 1,	// 当前幅度是正是负，0：负 1：正
				isShowWait: false, // 是否显示等待弹框
			};
		},
		mounted() {
			this.getNotice()
			this.getCommon()
			this.getDropInfo()
			this.rollNotice()
			this.getBanner()
		},
		methods: {
			// 获取空投数据
			getDropInfo() {
				this.$MR({
					url: 'drop/info',
				}).then(res=> {
					console.log('获取空投数据', res)
					if(res.data.code == 200) {
						this.dropNumber = res.data.data[3] + res.data.data[4]
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
			// 获取banner
			getBanner() {
				this.$MR({
					url: 'common/banner',
				}).then(res=> {
					console.log('获取banner', res)
					if(res.data.code == 200) {
						this.bannerArr = res.data.data
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
			// 获取公告
			getNotice() {
				this.$MR({
					url: 'common/notice',
				}).then(res=> {
					console.log('获取公告', res)
					if(res.data.code == 200) {
						// res.data.data.forEach(el => {
						// 	this.noticeText += '   '
						// 	this.noticeText += el
						// })
						this.noticeArr = res.data.data
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
			// 点击单条公告
			handleNotice(el) {
				console.log('handleNotice', el)
				uni.navigateTo({
				    url: `/pages/noticeInfo/noticeInfo?id=${el.id}`
				});
			},
			// 滚动公告
			rollNotice() {
				clearInterval(this.noticeInter)
				this.noticeInter = setInterval(() => {
					this.noticeTop -= 30
					if( this.noticeTop/(-30) > this.noticeArr.length-1) {
						this.noticeTop = 0
					}
				}, 2000)
			},
			// 获取通用数据
			getCommon() {
				const _this = this
				_this.$MR({
					url: 'common/explain',
				}).then(res=> {
					console.log('获取通用数据', res)
					if(res.data.code == 200) {
						_this.moneyNum = res.data.data.usdt
						Number(res.data.data.ibc_amplitude)<0 ? _this.rangeType = 0: _this.rangeType = 1
						_this.range = res.data.data.ibc_amplitude
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
			// 点击空投总量
			handleDrop() {
				uni.navigateTo({
					url: '/pages/dropInfo/dropInfo'
				})
			},
			// 点击八个图标
			handleGridIcon(ind) {
				console.log(this.$MR)
				switch (ind){
					// case 0:
					// 	uni.navigateTo({
					// 		url: '/pages/login/login'
					// 	})
					// 	break;
					default:
						this.isShowWait = true
						setTimeout(() => {
							this.isShowWait = false
						}, 600)
						break;
				}
				
			},
			// 点击废矿井的查看
			handleMine() {
				uni.navigateTo({
					url: '/pages/abandonMine/abandonMine'
				})
			}
		}
	}
</script>

<style lang="scss">
	.homePage {
		padding: 0 5%;
		.topTitle {
			display: block;
			color: white;
			font-size: 17px;
			line-height: 17px;
			text-align: center;
			margin-bottom: 50rpx;
		}
		.topNotice {
			// background-color: white;
			height: 80rpx;
			border-radius: 16rpx;
			background-color: #fffbe8;
			overflow-y: hidden;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			image {
				width: 48rpx;
				height: 48rpx;
				padding: 0 10rpx;
			}
			.notice_scroll {
				height: 80rpx;
				overflow-y: hidden;
			}
			.uni-noticebar {
				padding: 22rpx 24rpx;
				margin-bottom: 0;
				border-radius: 16rpx;
			}
			.notice_content {
				color: #de8c17;
				font-size: 14px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				padding-top: 20rpx;
				position: relative;
				transition: 1s top;
				text {
					margin-bottom: 20rpx;
				}
			}
		}
		.topSwiper {
			margin-top: 30rpx;
			height: 274rpx;
			// background-color: #C0C0C0;
			border-radius: 16rpx;
			.swiper-item {
				height: 100%;
			}
			image {
				height: 100%;
				width: 100%;
				border-radius: 16rpx;
			}
		}
		.dropNumber {
			background-color: rgba(52, 152, 219, 1);
			border-radius: 16rpx;
			color: white;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16rpx 0;
			margin-top: 38rpx;
			image {
				width: 48rpx;
				height: 48rpx;
				margin: 0 16rpx;
			}
		}
		.gridIcon {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			color: white;
			.itemIcon {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 13px;
				margin-top: 32rpx;
				image {
					width: 112rpx;
					height: 112rpx;
					margin-bottom: 16rpx;
				}
			}
		}
		.abandonMine {
			background-image: url(../../static/images/mine_bg.png);
			background-size: cover;
			height: 360rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
			font-size: 13px;
			margin-top: 48rpx;
			.mine_left {
				height: 360rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				padding-left: 32rpx;
				text {
					
				}
				.left_button {
					height: 56rpx;
					width: 180rpx;
					line-height: 56rpx;
					text-align: center;
					background-color: white;
					border-radius: 50rpx;
					color: rgba(0, 122, 255, 1);
					margin-bottom: 10rpx;
				}
			}
			image {
				width: 320rpx;
				height: 320rpx;
			}
		}
		.card_block {
			display: flex;
			justify-content: space-between;
			color: white;
			.cardItem {
				height: 244rpx;
				width: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				margin-top: 48rpx;
				background-size: 100% 100%;
				image {
					width: 72rpx;
					height: 72rpx;
					margin-bottom: 28rpx;
				}
				text {
					margin-bottom: 6rpx;
				}
			}
		}
		.infoSite {
			margin-top: 48rpx;
			padding-bottom: 60rpx;
			color: white;
			font-size: 18px;
			.site_block {
				font-size: 14px;
				margin-top: 28rpx;
				border-radius: 8px;
				background-color: rgba(0, 0, 0, 0.65);
				height: 200rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				image {
					width: 110rpx;
					height: 110rpx;
					margin-left: 60rpx;
				}
				.site_font {
					height: 120rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: flex-end;
					margin-right: 60rpx;
					.rangeFont {
						display: flex;
						align-items: center;
					}
					.rangeFont:before {
						content: '\2022';
						font-size: 25px;
						margin-right: 10rpx;
					}
				}
			}
		}
		.wait_popup {
			position: absolute;
			top: 40%;
			left: calc(50% - 215rpx);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: white;
			width: 430rpx;
			height: 320rpx;
			border-radius: 16px;
			font-size: 14px;
			image {
				width: 144rpx;
				height: 144rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	
</style>
