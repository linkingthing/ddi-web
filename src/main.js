// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";

import ViewUI from "view-design";
import "@/assets/less/theme.less";
Vue.use(ViewUI);

import tags from "@/components/tags";
Vue.component("Tags", tags);

Vue.config.productionTip = false;

// 滚动条以及配置
import vuescroll from "vuescroll";
Vue.use(vuescroll); // install the vuescroll first
Vue.prototype.$vuescrollConfig = {
  bar: {
    size: "8px",
    background: "#4796FF",
    keepShow: true
  },
  rail: {
    background: "#EEEEEE",
    opacity: 1,
    size: "8px",
    gutterOfEnds: "0px",
    gutterOfSide: "0px"
  }
};

import "./components/Loading/index.css";
import Loading from "./components/Loading/index";
Vue.use(Loading);

import BaseBtnEdit from "@/components/BaseBtnEdit";
Vue.component("btn-edit", BaseBtnEdit);

import BaseBtnDel from "@/components/BaseBtnDel";
Vue.component("btn-del", BaseBtnDel);

import TablePagination from "@/components/TablePagination";
Vue.component("table-page", TablePagination);

import CommonModal from "@/components/CommonModal";
Vue.component("common-modal", CommonModal);


import store from "./store";
import router from "./router";

import mixin from "./mixin";
Vue.mixin(mixin);

Vue.prototype.$$success = function (msg) {
  this.$Message.success(msg);
};

Vue.prototype.$$info = function (msg) {
  this.$Message.info(msg);
};

Vue.prototype.$$warning = function (msg) {
  this.$Message.warning(msg);
};

Vue.prototype.$$error = function (msg) {
  this.$Message.error(msg);
};

Vue.prototype.$$confirm = function ({ title = "消息", content }) {
  return new Promise((resolve, reject) => {
    this.$Modal.confirm({
      title,
      content,
      onOk: () => {
        resolve();
      },
      onCancel: () => {
        reject();
      }
    });
  });
};


const getStateByKey = async function (name, params = {}) {
  try {   
    let _res = store.getters[name];

    // forceRequire：强制请求，设置此参数，将强制从服务器获取数据
    if (!_res || (_res && !_res.length) || params.forceRequire) {
      _res = await store.dispatch(name, params);
    }

    return _res;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * 获取视图列表
 */
Vue.prototype.$getViewList = async params => {
  return await getStateByKey("getViewList", params);
};

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
}).$mount("#app");

