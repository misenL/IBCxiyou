import Vue from 'vue'
import App from './App'
import { MR } from "./common/api/request.js"

Vue.config.productionTip = false

App.mpType = 'app'
// 挂载到全局
Vue.prototype.$MR = MR

const app = new Vue({
    ...App
})
app.$mount()
