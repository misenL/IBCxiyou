
// const BASE_URL = 'http://pomelo.test/api/'
const BASE_URL = 'http://admin.5cstar.com/api/'

export const MR = (options)=>{
	return new Promise((resolve,reject)=>{
		uni.showLoading({
		    title: '请等待'
		});
		uni.request({
			url:BASE_URL+options.url,
			method: options.method || 'GET',
			header:{
				'Authorization': uni.getStorageSync('Authorization'),
				'version': 'v1'
			},
			data: options.data || {},
			success: (res)=>{
				uni.hideLoading()
				if(res.data.status == 200) {
					// return uni.showToast({
					// 	title: '数据加载成功'
					// })
				}
				resolve(res)
			},
			fail: (err)=>{
				uni.hideLoading()
				uni.showToast({
					title: '网络错误'
				})
				reject(err)
			}
		})
	})
}