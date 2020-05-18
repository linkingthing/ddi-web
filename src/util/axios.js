import axios from "axios";
import store from "@/store";
import router from "@/router";
import { LoadingBar, Message } from "view-design";

export const baseUrl = "/apis/linkingthing.com/{block}/v1";

const successCode = [200, 201, 202, 204];

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
    let { data: resData, status } = await response;
    
    let { message, data } = resData;

    // 如果查询的是对象，则data的内容直接就是resData
    if (!resData.data) {
      data = resData;
    }

    if (successCode.includes(status)) { // 请求成功
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

export {
  post,
  get,
  del,
  put,
  axios
};
