// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'

// iview UI 框架
// import iView from 'iview';

import ViewUI from 'view-design';
import '@/assets/less/theme.less'
Vue.use(ViewUI)

import tags from '@/components/tags';
Vue.component('Tags', tags)

// 导入vue-echarts插件
import ECharts from 'vue-echarts/components/ECharts'
// 按需导入echarts的图形类型
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
// 导入工具部分
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title';
// register component to use
import 'echarts/lib/component/legendScroll';
// register component to use
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markArea';
import 'echarts/lib/component/dataZoom';
// 全局注册chart组件
Vue.component('chart', ECharts)


import axios from 'axios'
Vue.prototype.$axios = axios;

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

import Bread from '@/components/Bread';
Vue.component('bread', Bread)

import BaseBtnEdit from '@/components/BaseBtnEdit';
Vue.component('btn-edit', BaseBtnEdit)

import BaseBtnDel from '@/components/BaseBtnDel';
Vue.component('btn-del', BaseBtnDel)

import TablePagination from '@/components/TablePagination';
Vue.component('table-page', TablePagination);

import store from './store'
import router from './router'

import mixin from './mixin'
Vue.mixin(mixin);

Vue.prototype.$$message = function (msg, type = "info") {
  this.$Message[type](msg);
}

Vue.prototype.$$confirm = function ({ title = "消息", content }) {
  return new Promise((resolve, reject) => {
    this.$Modal.confirm({
      title,
      content,
      onOk: () => {
        resolve()
      },
      onCancel: () => {
        reject()
      }
    });
  })
}

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
