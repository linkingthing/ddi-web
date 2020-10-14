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
    let { headers, data } = res;
    if (headers["set-token"]) {
      const setToken = headers["set-token"];
      store.commit("SET_TOKEN", setToken);
    }
    if (headers["authorization"]) {
      store.commit("SET_TOKEN", headers["authorization"]);
    }
    return data;
  },
  err => {
    let { headers, status } = err.response;
    if (headers["set-token"]) {
      const setToken = headers["set-token"];
      store.commit("SET_TOKEN", setToken);
    }

    if (status === 401) {
      router.push("/login");
      throw "401 您当前没有执行权限，请与超级管理员联系";
    }
    if (status === 403) {
      Message.error("您当前没有执行权限，请与超级管理员联系");
      throw "403 您当前没有执行权限，请与超级管理员联系";
    }
    console.log(1);
    return Promise.reject(err);
  }
);

function get({ url, params = {}, otherOptions = {} }) {
  return instance.get(url, { params }, otherOptions);
}

function post({ url, params = {}, otherOptions = {} }) {
  return instance.post(url, params, otherOptions);
}

function put({ url, params = {}, otherOptions = {} }) {
  return instance.put(url, params, otherOptions);
}

function del({ url, otherOptions = {} }) {
  return instance.delete(url, otherOptions);
}

export { post, get, del, put, instance as axios };
