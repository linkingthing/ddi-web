import Vue from "vue";
import store from "@/store";
import { del, post, put, get, axios } from "./axios";
import  * as requestMethods from "./request";
import router from "@/router";

const { getApiByRoute, getRouteByLink } = requestMethods;

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
  
Vue.prototype.$$confirm = function ({ title = "消息", content, onOk, onCancel }) {
  return new Promise((resolve, reject) => {
    this.$Modal.confirm({
      title,
      content,
      onOk: () => {
        onOk && onOk();

        resolve();
      },
      onCancel: () => {
        onCancel && onCancel();

        reject();
      }
    });
  });
};  

/**
 * 处理请求错误
 */
Vue.prototype.$handleError = function (err = {}, callback) {
  if (err.response) {
    showMessage("error", err.response.data.message, this);
  }
  else if (err.message) {
    showMessage("error", err.message, this);
  }
  else {
    console.error(err);
  }

  return callback && callback();
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


Vue.prototype.$getApiByRoute = getApiByRoute;
Vue.prototype.$getRouteByLink = getRouteByLink;

/**
 * 获取视图列表
 */
Vue.prototype.$getViewList = async params => {
  return await getStateByKey("getViewList", params);
};

/**
 * 修剪日期，将日期的多余的Z、T以及+号后面的内容去掉
 */
Vue.prototype.$trimDate = date => date ? date.replace("T", " ").replace(/(Z|\+\S*)/g, "") : "";

Vue.prototype.$get = get;
Vue.prototype.$put = put;
Vue.prototype.$post = post;
Vue.prototype.$delete = del;
Vue.prototype.$axios = axios;
Vue.prototype.$getData = params => get(getApiByRoute(params)); 
Vue.prototype.$createEntity = params => post({ ...getApiByRoute(), params }); 


for (const method in requestMethods) {
  Vue.prototype[`$${method}`] = requestMethods[method];
}

Vue.prototype.$wait = time => new Promise(r => setTimeout(() => r(), time));


Vue.directive("scroll", {
  // 当绑定元素插入到 DOM 中
  inserted: function (el,binding) {
    var cb = binding.value;
    el.addEventListener("mousewheel",function (e) {
      var direction = e.deltaY > 0 ? "down" : "up";
      cb(direction, el, e);
    });
  }
});

Vue.directive("position", {

  // 当绑定元素插入到 DOM 中
  inserted: function (el, binding) {
    const { ip, master, getPosition } = binding.value;

    const { offsetTop, offsetLeft ,offsetHeight, offsetWidth } = el;

    getPosition({ ip, master, offsetTop, offsetLeft ,offsetHeight, offsetWidth });

  }

});

Vue.prototype.$refresh = ({ keeps = [] } = {}) => {  
  let { query = {}, path } = router.currentRoute;
  const temp = {};

  keeps.forEach(item => {
    if (query[item]) {
      temp[item] = query[item];
    }
  });

  let querys = "";
  const res = Object.entries(temp);

  if (res.length) {
    querys = res.map(([key, value]) => `${key}=${value}`).join("&");
  }

  if (querys) {
    path += `?${querys}`;
  }

  router.replace(path);
};

/**
 * 将对象格式化为url的query字符串
 */
Vue.prototype.$formatQuerys = (params = {}, url) => {
  let query = Object.entries(params).filter(([,value]) => value !== "").map(([key,value]) => `${key}=${value}`).join("&");

  if (url) return query ? `${url}?${query}` : url;

  return query;
};
