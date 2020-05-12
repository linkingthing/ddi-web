import axios from "axios";
import store from "@/store";
import router from "@/router";
import { LoadingBar, Message } from "view-design";

export const baseUrl = "/apis/linkingthing.com/{block}/v1";

const instance = axios.create();

instance.interceptors.request.use(
  config => {
    LoadingBar.start();
  
    const token = store.getters.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
      
    return config;
  },
  error => {    
    return Promise.reject(error);
  },
);

async function netCall(request) {
  LoadingBar.start();

  try {
    const response = await request;
    const { data: resData, status } = await response;
    
    let { message, data } = resData;

    if (status === 0) { // 请求成功
      LoadingBar.finish();

      return data;
    } 
    else if (status === 401) { // 验证失败
      LoadingBar.error();

      Message.error(message);

      router.push("/login");
    } 
    else { // 请求失败
      console.error("request fail -> status: ", status);
      
      return Promise.reject({
        status,
        message
      });
    }
  }
  catch (error) {
    LoadingBar.error();

    console.error("request exception -> error", error);

    return Promise.reject(error);
  }
}

function get({ baseUrl, url, params = {}, otherOptions = {} }) {
  return netCall(instance.get(baseUrl + url, params, otherOptions));
}

function post({ baseUrl, url, params = {}, otherOptions = {} }) {
  return netCall(instance.post(baseUrl + url, params, otherOptions));
}

function put({ baseUrl, url, params = {}, otherOptions = {} }) {
  return netCall(instance.put(baseUrl + url, params, otherOptions));
}

function del({ baseUrl, url, otherOptions = {} }) {
  return netCall(instance.delete(baseUrl + url, otherOptions));
}

export {
  post,
  get,
  del,
  put,
  axios
};
