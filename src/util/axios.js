import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Message } from "view-design";

export const baseUrl = "/apis/linkingthing.com/{block}/v1";

const successCode = [200, 201, 202, 204];

const instance = axios.create();

instance.interceptors.request.use(
  config => {
    const token = store.getters.token;
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  res => {
    let { headers } = res;
    if (headers["set-token"]) {
      const setToken = headers["set-token"];
      store.commit("SET_TOKEN", setToken);
    }
    return res;
  },
  err => {
    let { headers, status } = err.response;
    if (headers["set-token"]) {
      const setToken = headers["set-token"];
      store.commit("SET_TOKEN", setToken);
    }

    if (status === 401) {
      router.push("/login");
    }
    if (status === 403) {
      Message.error("您当前没有执行权限，请与超级管理员联系");
      throw "403 您当前没有执行权限，请与超级管理员联系";
    }
    return Promise.reject(err);
  }
);

async function netCall(request) {
  try {
    const response = await request;
    let { data, status, message, code } = await response;

    if (successCode.includes(status)) {
      // 请求成功

      return data;
    } else if (status === 401 || code === 401) {
      // 验证失败

      router.push("/login");
    } else {
      // 请求失败
      console.error("request fail -> status: ", status);

      return Promise.reject({
        status,
        message
      });
    }
  } catch (error) {

    return Promise.reject(error);
  }
}

function get({ url, params = {}, otherOptions = {} }) {
  return netCall(instance.get(url, { params }, otherOptions));
}

function post({ url, params = {}, otherOptions = {} }) {
  return netCall(instance.post(url, params, otherOptions));
}

function put({ url, params = {}, otherOptions = {} }) {
  return netCall(instance.put(url, params, otherOptions));
}

function del({ url, otherOptions = {} }) {
  return netCall(instance.delete(url, otherOptions));
}

export { post, get, del, put, instance as axios };
