import router from "@/router";
import store from "@/store";
import { USERTYPE_SUPER } from "@/config";
import allConfig from "@/router/configs";
import permission from "@/config/permission";
import { cloneDeep } from "lodash";

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    const { token, routes } = store.getters;
    if (token) {
      const hasRouter = routes.length;
      console.log(routes, 88, hasRouter);
      if (hasRouter) {
        next();
      } else {
        store.dispatch("getUserInfo").then(userInfo => {
          const { userType, menuList } = userInfo;
          if (userType === USERTYPE_SUPER) {
            router.addRoutes(allConfig);
            store.commit("setRoutes", allConfig);
            console.log("超管 全加");
            next({ ...to, replace: true });
          } else {
            /**
             * 1.拿到menuList的资源列表
             * 2.根据资源列表和permission配置映射列表计算出需要渲染的页面标识列表
             * 3.根据需要渲染的页面标识列表过滤
             * 4.过滤后的routes加入router
             */
            const resourceList = menuList.map(item => item.resource);

            const allowMenuList = permission.filter(item => {
              return includes(resourceList, item.resouces);
            });

            const allowMenuIdList = allowMenuList.map(item => item.id);

            // allConfig 层级较深，通过递归过滤掉
            const filterMenu = filterPermissionRoutes(
              cloneDeep(allConfig),
              allowMenuIdList
            );

            router.addRoutes(filterMenu);
            store.commit("setRoutes", filterMenu);
            next({ ...to, replace: true });
          }
        });
      }
    } else {
      next("/login");
    }
  }
});

// arr1 是否包含 arr2
function includes(arr1, arr2) {
  return arr2.every(item => {
    return arr1.includes(item);
  });
}

function filterPermissionRoutes(all, permissionList) {
  if (!(Array.isArray(all) && all.length)) {
    return [];
  }
  let result = [];
  all.forEach(item => {
    const { children } = item;
    const { permission } = item.meta;
    const hasPermission =
      permissionList.includes(permission) || permission === "*";
    if (hasPermission) {
      result.push(item);
      item.children = filterPermissionRoutes(children, permissionList);
    }
  });

  return result;
}
