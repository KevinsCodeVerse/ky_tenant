import Vue from 'vue'
import App from './App.vue'
import "@babel/polyfill"; // 配置ie兼容
import router from '@/router'
import store from '@/store'
import axios from '@/config/http'
import pubsub from 'pubsub-js' // js 消息
import envConfig from '@/config/envConfig' // 环境参数配置
import moment from 'moment' // moment 时间操作工具
// import ElementUI from 'element-ui' // element-ui 组件库
// import '@/assets/scss/element-variables.scss' // 自定义 element-ui 主题
// import { initThemeColor } from '@/utils/themeColorClient' // 动态切换主题色
import * as filters from '@/config/filtersConfig' // 过滤器
import { fullPath } from '@/config/filtersConfig' // 过滤器
import request from '@/utils/request' // 请求工具类
import common from '@/utils/common' // 常用工具
import 'normalize.css';  // 直接引入 normalize.css
import './assets/fonts/icon.css' // 自定义 svg转font字体样式
// element-ui
import '@/plugins/element/element.js'
import 'animate.css';
import routerUtil from '@/router/routerUtil' // 动态路由
import message from './utils/message'
import MainHead from "./components/models/MainHead";
import MainContent from "./components/models/MainContent";
import MainFooter from "./components/models/MainFooter";

import qs from 'qs'
Vue.prototype.$qs = qs

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 主题换肤
// initThemeColor();
import ImgCutter from 'vue-img-cutter';
Vue.component('ImgCutter', ImgCutter)
Vue.component('main-head', MainHead)
Vue.component('main-content', MainContent)
Vue.component('main-footer', MainFooter)
// Vue.use(ElementUI)
Vue.prototype.$fullPath = fullPath
Vue.prototype.$envConfig = envConfig
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$request = request
Vue.prototype.$common = common
Vue.prototype.$pubsub = pubsub
Vue.prototype.$message = message
Vue.prototype.$store = store
Vue.config.productionTip = false

window.addEventListener('popstate', function(e) {
	router.isBack = true
})

// 动态路由初始化
routerUtil.init()

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
