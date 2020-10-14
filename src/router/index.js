import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";
import DefaultLayout from "../views/default-layout";
import { USERTYPE_SUPER, USERTYPE_NORMAL } from "@/config";

import configs, { asyncRouter } from "./configs";

import store from "@/store";

const packMaterial = configs
  // eslint-disable-next-line no-undef
  // .filter((item) => PACK_SYSTEM.includes(item.meta.range))
  .reduce((result, current) => result.concat(current), []);

Vue.use(Router);
const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "Index",
      component: DefaultLayout,
      children: packMaterial
    },
    {
      // 登陆页
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "*",
      redirect: () => {
        Vue.nextTick().then(() => {
          return "/dns/dns/views_zones";
        });
      }
    }
  ]
});

let isAddRouter = false;
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    const { token } = store.getters;
    if (token) {
      store
        .dispatch("getUserInfo")
        .then(userInfo => {
          const { userType } = userInfo;
          if (userType === USERTYPE_SUPER) {
            if (!isAddRouter) {
              router.addRoutes(asyncRouter);
              isAddRouter = true;
              next({ ...to, replace: true });
            }
            next();
          } else {
            next();
          }
        })
        .catch(err => {
          throw new Error(err, "err getUserInfo");
        });
    } else {
      next("/login");
    }
  }
});

export default router;
