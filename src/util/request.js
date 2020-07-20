/**
 * 将一些常用的请求相关的操作封装在这个工具及里面
 */

import { axios, baseUrl } from "./axios";
import router from "@/router";

export function $get({ url, params }) {
  return axios.get(url, { params }).then(({ data: { data, links } }) => ({ data,links }));
}

/**
 * 根据当前路由获取对应的url
 */
export function getApiByRoute(tpath = router.currentRoute.path) {
  let paths = tpath.slice(1).split("/");
  
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
}

/**
 * 根据参数link生成路由
 * @param link {String}
 * @param system {String}
 * @return route {String}
*/
export function getRouteByLink(link, system) {
  let [,,,module,,...rest] = link.split("/");
  
  return `/${system}/${module}/${rest.join("/")}`; 
}


/**
 * 获取当前列表的资源名和上一级资源path
 * @return [path, name]
*/
export const popPath = () => {
  const { path } = router.currentRoute;
  const pathSplit = path.split("/");
  const lastResource = pathSplit.pop();
  return [pathSplit.join("/"), lastResource];
};

/**
 * 获取上一级父资源
*/
export const getParantData = () => {
  const [path] = popPath();
  
  return axios.get(getApiByRoute(path).url);
};

/**
 * 获取Data和Links，不限于列表单条
*/
export const getDataAndLinks = () => {
  const { path } = router.currentRoute;
  return $get(getApiByRoute(path));
};
