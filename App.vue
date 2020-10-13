<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(uni.getStorageSync('Authorization')==='') {
				// 没有token
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else {
				
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
