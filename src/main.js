// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
// import FE_DEBUG from 'error-report-crab'

// iview UI 框架
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView)

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
Vue.config.productionTip = false 

// 滚动条以及配置
import vuescroll from 'vuescroll';
Vue.use(vuescroll); // install the vuescroll first
Vue.prototype.$vuescrollConfig = {
  bar: {
    size: '8px',
    background: '#4796FF',
    keepShow: true
  },
  rail: {
    background: '#EEEEEE',
    opacity: 1,
    size: '8px',
    gutterOfEnds: '0px',
    gutterOfSide: '0px'
  }
};

import './components/Loading/index.css';
import Loading from './components/Loading/index';
Vue.use(Loading);

// import 'swiper/dist/css/swiper.css';

// import App from './App'
import store from './store'
import router from './router'

import mixin from './mixin'
Vue.mixin(mixin);

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
