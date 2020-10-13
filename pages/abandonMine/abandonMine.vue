<template>
	<view class="abandonMine">
		<view class="top_drop">
			<image src="../../static/icons/arrow_left.png" @click="goBack"></image>
			<text>废矿井</text>
			<text></text>
		</view>
		<view class="top_block">
			<text style="font-size: 18px;margin-bottom: 40rpx;">累积销毁</text>
			<text>{{deleteNum}} <text style="font-size: 18px;margin-left: 8rpx;">IBC</text></text>
		</view>
		<!-- 销毁明细 -->
		<view class="delete_info" v-if="deleteArr.length !== 0">
			<text>销毁明细（近15日）</text>
			<view class="info_list" v-for="(item,index) in deleteArr" :key="index">
				<view class="list_item" style="margin-bottom: 54rpx;">
					<text style="color: block;font-size: 20px;">{{item.allMoney}}</text>
					<text style="color: rgba(0, 0, 0, 0.65);font-size: 12px;">{{item.deleteTime}}</text>
				</view>
				<view class="list_item">
					<text>矿工矿池</text>
					<text>{{item.m1}}</text>
				</view>
				<view class="list_item">
					<text>超级节点矿池</text>
					<text>{{item.m2}}</text>
				</view>
				<view class="list_item">
					<text>运维矿池</text>
					<text>{{item.m3}}</text>
				</view>
				<view class="list_item">
					<text>基金矿池</text>
					<text>{{item.m4}}</text>
				</view>
			</view>
		</view>
		<view class="delete_info" v-else>
			<text>销毁明细（近15日）</text>
			<view class="info_none">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deleteNum: 0,
				// 销毁数据
				deleteArr: [
					// {
					// 	allMoney: '337987.0000',
					// 	deleteTime: '2020-09-23',
					// 	m1: '236679.7801',
					// 	m2: '236679.7802',
					// 	m3: '236679.7803',
					// 	m4: '236679.7804',
					// },{
					// 	allMoney: '337987.0001',
					// 	deleteTime: '2020-09-23',
					// 	m1: '236679.7801',
					// 	m2: '236679.7802',
					// 	m3: '236679.7803',
					// 	m4: '236679.7804',
					// },
				],
			};
		},
		onLoad() {
			
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.abandonMine {
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
		.top_block {
			background-image: url(../../static/images/mine2.png);
			background-size: 100% 100%;
			height: 246rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text {
				font-size: 24px;
			}
		}
		.delete_info {
			margin-top: 54rpx;
			font-size: 18px;
			padding-bottom: 24rpx;
			.info_list {
				margin-top: 28rpx;
				background-color: white;
				border-radius: 8px;
				color: rgba(0, 0, 0, 0.65);
				padding: 36rpx 48rpx 10rpx;
				.list_item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 14px;
					margin-bottom: 34rpx;
					text {
						&:last-child {
							color: rgba(0, 122, 255, 1);
						}
					}
				}
			}
			.info_none {
				margin-top: 28rpx;
				background-color: white;
				border-radius: 8px;
				color: rgba(0, 0, 0, 0.65);
				padding: 36rpx 0;
				text-align: center;
			}
		}
	}
</style>
