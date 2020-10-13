<template>
	<view class="myTab">
		<view class="tab-main">
			<block class="tab-item" v-for="(item,index) in tabList" :key="index" >
				<view class="navigator"  @tap="switchTab(item.url,index)">
					<view class="icon">
						<image :src="currentTabIndex==index? item.icon1:item.icon"></image>
					</view>
					<view class="text" :class="currentTabIndex==index ? 'focus':''">{{item.text}}</view>
				</view>
			</block>
		</view>
		<view class="bottom-box"></view>
	</view>
</template>

<script>
	export default {
		name:'myTabbar',
		props:{
			tabsIndex:{
				type:[Number, String],
				value:null
			}
		},
		data(){
			return{
				// index:0,
				currentTabIndex: this.tabsIndex,
				tabList:[{
						icon:'../../static/icons/tabbarHome_n.png',
						icon1:'../../static/icons/tabbarHome_c.png',
						text:'首页',
						url:'/pages/index/index'
					},{
						icon:'../../static/icons/tabbarOre_n.png',
						icon1:'../../static/icons/tabbarOre_c.png',
						text:'矿池',
						url:'/pages/orePage/orePage'
					},{
						icon:'../../static/icons/tabbarTrade_n.png',
						icon1:'../../static/icons/tabbarTrade_c.png',
						text:'交易',
						url:'/pages/tradePage/tradePage'
					},{
						icon:'../../static/icons/tabbarUser_n.png',
						icon1:'../../static/icons/tabbarUser_c.png',
						text:'我的',
						url:'/pages/userPage/userPage'
					}]
			}
		},
		watch:{
			tabsIndex:function(val){
				if(this.tabsIndex == val){
					return;
				}
				this.currentTabIndex = val;
			}
		},
		methods:{
			switchTab(url,index){
				if(this.currentTabIndex == index){
					return
				}
				this.currentTabIndex = index;
				this.$emit("switchTab",index);
			}
		}
	}
</script>

<style lang="scss">
	.myTab{
		position: fixed;
		bottom: 0;
		width: 100%;
		border-top: solid 1rpx #999999;
		text-align: center;
		font-size: 28rpx;
		background-color: #fff;
		z-index: 900;
		.tab-main{
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			height: 112rpx;
			.icon{
				display: flex;
				justify-content: center;
			}
			.navigator{
				image{
					width: 48rpx;
					height: 48rpx;
				}
				.text{
					font-size: 28rpx;
				}
			}
			.focus{
				// color:#22AC38;
			}
		}
		.bottom-box{
			width: 100%;
			height: 46rpx;
		}
	}
</style>
