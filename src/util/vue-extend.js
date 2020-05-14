import Vue from "vue";
import store from "@/store";
import router from "@/router";
import { del, post, put, get, axios, baseUrl } from "./axios";

function showMessage(type, msg, scope) {
  let options = {
    content: msg,
    duration: 3
  };
  
  if (typeof msg === "object") {
    options = msg; 
  }
  
  scope.$Message[type](options);
}

// 滚动条以及配置
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
  
Vue.prototype.$$success = function (msg) {
  showMessage("success", msg, this);
};
  
Vue.prototype.$$info = function (msg) {
  showMessage("info", msg, this);
};
  
Vue.prototype.$$warning = function (msg) {
  showMessage("warning", msg, this);
};
  
Vue.prototype.$$error = function (msg) {
  showMessage("error", msg, this);
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
 * 根据当前路由获取对应的url
 */
Vue.prototype.$getApiByRoute = () => {
  let paths = router.currentRoute.path.slice(1).split("/");
  
  const block = paths[1];

  paths.splice(0,2);

  let child = "";
  
  let url = baseUrl.replace("{block}", block) + "/" + paths.map(item => {
    let temp = item.split("_");

    if (temp.length > 1) {
      child = item[1];
    }

    return temp[0];
  }).join("/");

  return {
    url,
    child
  };
};
  
/**
 * 获取视图列表
 */
Vue.prototype.$getViewList = async params => {
  return await getStateByKey("getViewList", params);
};

/**
 * 修剪日期，将日期的多余的Z、T以及+号后面的内容去掉
 */
Vue.prototype.$trimDate = date => date.replace("T", " ").replace(/(Z|\+\S*)/g, "");

Vue.prototype.$get = get;
Vue.prototype.$put = put;
Vue.prototype.$post = post;
Vue.prototype.$delete = del;
Vue.prototype.$axios = axios;

