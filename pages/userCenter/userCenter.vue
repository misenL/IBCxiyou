<template>
	<view class="userCenter">
		<text class="topTitle">个人中心</text>
		<view class="top_user">
			<image :src="userData.headimg||'../../static/icons/user_d.png'"></image>
			<view class="user_info">
				<text style="font-size: 18px;">{{userData.nickname||userData.phone}}</text>
				<!-- <text class="user_grade">{{grade}}</text> -->
			</view>
			<view style="align-items: flex-end;justify-content: space-around;">
				<text>ID：{{userData.id}}</text>
				<text>注册时间：{{degTiem}}</text>
			</view>
		</view>
		<view class="recom_info">
			<view class="">
				<text>推荐人：</text>
				<text>{{recomName}}</text>
			</view>
			<view class="">
				<text>推荐人ID：</text>
				<text>{{recomID}}</text>
			</view>
		</view>
		<!-- 我的资产 -->
		<view class="myAssets">
			<text>我的资产</text>
			<view class="assets_info">
				<view class="">
					<text style="font-size: 18px;"><text style="margin-right: 10rpx;font-size: 24px;">{{allAssets}}</text>IBC</text>
					<text>总资产</text>
					<!-- {{allAssets * usdt }} funJsToNum(usdt, allAssets)||0 -->
					<text class="assets_button"><text style="margin-right: 10rpx;">{{ toAssetsNum }}</text>USDT</text>
				</view>
				<view class="">
					<text style="font-size: 18px;"><text style="margin-right: 10rpx;font-size: 24px;">{{usable}}</text>IBC</text>
					<text>可用资产</text>
					<text class="assets_button"><text style="margin-right: 10rpx;">{{usable2}}</text>USDT</text>
				</view>
			</view>
		</view>
		<!-- 邀请好友 -->
		<view class="invitation_block">
			<view class="invitation_top">
				<text style="margin-right: auto;font-size: 14px;">邀请好友</text>
				<text @click="handleMyInvitation">我的邀请</text>
				<image @click="handleMyInvitation" src="../../static/icons/arrow_right.png"></image>
			</view>
			<view class="invi_bg">
				<view class="invitation_info">
					<text style="font-size: 32px;">{{userData.invite_code}}</text>
					<view class="">
						<text>邀请好友得算力</text>
						<text>挖矿助你一臂之力</text>
					</view>
				</view>
				<view class="invitation_button">
					<text @click="downHaibao">下载邀请海报</text>
					<text @click="copyUrl">复制邀请链接</text>
					<text @click="copyCode">复制邀请码</text>
				</view>
			</view>
		</view>
		<!-- 操作列表 -->
		<view class="operate_list">
			<view class="list_item" @click="handleOperateList(index)" v-for="(item,index) in operateArr" :key="index">
				<text style="margin-right: auto;">{{item.title}}</text>
				<text style="font-size: 12px;">{{item.text}}</text>
				<image src="../../static/icons/arrow_right.png"></image>
			</view>
		</view>
		<view class="out_button" @click="handleOutLogin">
			退出登录
		</view>
		
		<!-- canvas海报 -->
		<!-- <view class="my_canvas" style="display: none;">
			<view>
				<view class="canvas">
					<canvas id="firstCanvas" :style="{ width: cansWidth + 'px', height: cansHeight + 'px' }" canvas-id="firstCanvas"></canvas>
				</view>
			</view>
		</view> -->
	</view>
</template>

<style lang="scss">
	.userCenter {
		padding: 0 5% 48rpx;
		color: white;
		.topTitle {
			display: block;
			color: white;
			font-size: 17px;
			line-height: 17px;
			text-align: center;
			margin-bottom: 50rpx;
		}
		.top_user {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 11px;
			image {
				width: 112rpx;
				height: 112rpx;
				flex-shrink: 0;
				margin-right: 32rpx;
			}
			view {
				height: 112rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
			}
			.user_info {
				margin-right: auto;
				.user_grade {
					width: 128rpx;
					height: 48rpx;
					background-color: white;
					border-radius: 40rpx;
					color: rgba(0, 0, 0, 1);
					line-height: 48rpx;
					text-align: center;
					font-size: 11px;
				}
			}
			
		}
		.recom_info {
			font-size: 12px;
			padding-left: 144rpx;
			margin-top: 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.myAssets {
			font-size: 14px;
			margin-top: 48rpx;
			.assets_info {
				margin-top: 20rpx;
				font-size: 12px;
				height: 246rpx;
				background-image: url(../../static/images/white_bg.png);
				background-size: 100% 100%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				view {
					height: 180rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					.assets_button {
						padding: 0 40rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						background-color: rgba(255, 255, 255, 0.65);
						border-radius: 50rpx;
						color: rgba(0, 0, 0, 1);
					}
				}
			}
		}
		.invitation_block {
			.invitation_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 12px;
				margin-top: 48rpx;
				image {
					width: 56rpx;
					height: 56rpx;
					margin-left: 8rpx;
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
		}
		.operate_list {
			margin-top: 60rpx;
			font-size: 14px;
			.list_item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid rgba(0, 80, 221, 1);
				padding: 18rpx 0;
				image {
					width: 56rpx;
					height: 56rpx;
					margin-left: 4rpx;
				}
			}
		}
		.out_button {
			height: 88rpx;
			font-size: 14px;
			text-align: center;
			line-height: 88rpx;
			border: 1px solid #FFFFFF;
			border-radius: 24px;
			margin-top: 28rpx;
		}
	}
	
</style>



<script>
	import BigNumber from '../../common/bignumber.min.js'
	export default {
		data() {
			return {
				// 用户信息
				userData: {},
				grade: '高级矿工',
				degTiem: '',
				recomName: '无',
				recomID: '无',
				// 我的资产
				allAssets: 0,
				toAssetsNum: 0,
				usable: 0,
				usable2: 0,
				// 比例转化
				usdt: 0,
				operateArr: [
					{title: '实名认证', text: '即将开放'},
					{title: '支付密码', text: ''},
					{title: '联系我们', text: ''},
					{title: '关于我们', text: ''},
					{title: '当前版本', text: '1.01'},
				],
				qrCode: '', // 二维码
				haibaoCode: '',
				cansWidth: 280, //海报宽度
				cansHeight: 480, //海报高度
				widths:"",//图片列表动态宽度
				imgsrc:"",//保存图片的路径
				userdata:{},//个人数据
				swiperList: []//海报数组
			};
		},
		
		mounted() {
			this.getUserInfo()
			this.getRuleUsdt()
		},
		methods: {
			// 复制邀请链接
			copyUrl() {
				const _this = this
				uni.setClipboardData({
				    data: `http://h5.5cstar.com/register.html?invite_code=${_this.userData.invite_code}`,
				    success: function () {
				        uni.showToast({
				        	icon: 'success',
				        	title: '复制成功',
				        	duration: 800
				        });
				    }
				});
			},
			// 复制邀请码
			copyCode() {
				const _this = this
				uni.setClipboardData({
				    data: _this.userData.invite_code,
				    success: function () {
				        uni.showToast({
				        	icon: 'success',
				        	title: '复制成功',
				        	duration: 800
				        });
				    }
				});
			},
			// 获取用户信息
			getUserInfo() {
				const _this = this
				_this.$MR({
					url: 'member/info'
				}).then(res => {
					console.log('获取用户信息', res)
					if(res.data.code == 200) {
						_this.userData = res.data.data
						_this.haibaoCode = '您的专属邀请码：' + res.data.data.invite_code
						_this.degTiem = res.data.data.create_at.split(' ')[0]
						_this.allAssets = res.data.data.ibc
						uni.setStorageSync('invite_code', res.data.data.invite_code)
						_this.toAssetsNum = _this.funJsToNum(_this.usdt, _this.allAssets)
						if(res.data.data.member !== null) {
							_this.recomName = res.data.data.member.nickname
							_this.recomID = res.data.data.member.id
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
			// 获取规则比例
			getRuleUsdt() {
				const _this = this
				_this.$MR({
					url: 'common/explain'
				}).then(res => {
					console.log('获取规则比例', res)
					if(res.data.code == 200) {
						_this.usdt = Number(res.data.data.usdt)
						_this.toAssetsNum = _this.funJsToNum(_this.usdt, _this.allAssets)
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
			// 精确度问题
			funJsToNum(el, elA) {
				let numLength = ''
				numLength = el.toString().split(".")[1].length
				const bigNum = (el * Math.pow(10, numLength)).toFixed(0)
				const midifyNum = (Number(bigNum) * elA) / Math.pow(10, numLength)
				return midifyNum
			},
			// 退出登录
			handleOutLogin() {
				uni.removeStorageSync('Authorization')
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			// 点击我的邀请
			handleMyInvitation() {
				uni.navigateTo({
					url: '/pages/myInvitation/myInvitation'
				})
			},
			// 下面几个列表的操作
			handleOperateList(ind) {
				switch (ind){
					case 1: 	//支付密码
						uni.navigateTo({
							url: '/pages/settingPayPass/settingPayPass'
						})
						break;
					case 2:	// 联系我们
						uni.navigateTo({
							url: '/pages/aboutWe/aboutWe?title=联系我们'
						})
						break;
					case 3:	// 关于我们
						uni.navigateTo({
							url: '/pages/aboutWe/aboutWe?title=关于我们'
						})
						break;
					default:
						break;
				}
			},
			// 下载海报
			downHaibao() {
				const _this = this
				// _this.saveCans()
				_this.$MR({
					url: 'member/poster'
				}).then(res => {
					console.log('获取海报', res)
					if(res.data.code == 200) {
						_this.saveCans(res.data.data.url)
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
			// 海报生成
			saveCans(e){   //保存海报
				let that = this
				uni.showLoading({
					title: '保存海报中'
				});
				console.log('canvasToTempFilePath', e)
				uni.saveImageToPhotosAlbum({
					filePath: e,
					success: function (red) {
						uni.hideLoading()
						uni.showToast({
							title:'保存相册成功'
						})
					},
					fail(res) {
						console.log('fail', res)
						uni.hideLoading()
						if(res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
							uni.showModal({
								title:'您需要授权相册权限',
								success(res) {
									if(res.confirm){
										uni.openSetting({
											success(res) {
											
											},
											fail(res) {
												console.log(res)
											}
										})
									}
								}
							})
						}
					}
				});
			},
			
			
		}
	}
</script>

