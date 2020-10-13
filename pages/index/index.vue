<template>
	<view class="index">
		<homePage v-if='tabsIndex==0'></homePage>
		<homePage v-if='tabsIndex==1'></homePage>
		<homePage v-if='tabsIndex==2'></homePage>
		<userCenter v-if='tabsIndex==3'></userCenter>
		<!-- <business v-if='tabsIndex==1'></business>
		<mailList v-if='tabsIndex==2'></mailList>
		<setting v-if='tabsIndex==3'></setting> -->
		<myTabbar @switchTab='switchTab' :tabsIndex='tabsIndex'></myTabbar>
		<!-- 弹框 -->
		<view class="wait_popup" v-if="isShowWait">
			<image src="../../static/icons/clock.png"></image>
			<text>暂未开放，敬请期待</text>
		</view>
	</view>
</template>
<script>
	import myTabbar from '../../myComponent/myTabbar.vue';
	import homePage from '../homePage/homePage.vue';
	import userCenter from '../userCenter/userCenter.vue'
	export default {
		components: {
			myTabbar,
			homePage,
			userCenter
		},
		data() {
			return {
				tabsIndex: 0,
				isShowWait: false,
			}
		},
		onLoad() {

		},
		methods: {
			switchTab(index) {
				if(index === 1 || index === 2) {
					this.isShowWait = true
					setTimeout(() => {
						this.isShowWait = false
					}, 600)
				}
				this.tabsIndex = index;
			},
		}
	}
</script>

<style lang="scss">
	.index {
		padding-top: 100rpx;
		padding-bottom: 160rpx;
		width: 100%;
		// min-height: calc(100vh - 160rpx);
		background-image: url(../../static/images/page_bg.png);
		background-size: 100% 100%;
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


