import "view-design/src/styles/index.less";
import "./assets/less/index.less";
import "./assets/less/var.less";

import Vue from "vue";
import App from "./App.vue";

import "./util/use-component";
import "./util/vue-extend";

Vue.config.productionTip = false;

import store from "./store";
import router from "./router";

new Vue({
  el: "#app",
  render: (h) => h(App),
  store,
  router
});
