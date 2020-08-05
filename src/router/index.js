import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";
import DefaultLayout from "../views/default-layout";

import configs from "./configs";

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
      children: packMaterial,
    },
    {
      // 登陆页
      path: "/login",
      name: "Login",
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else if (to.path === "/") {
    next("/monitor");
  } else {
    next();
  }
  // else {
  //     let token = Cache.get('token');
  //     if (token === null || token === '') {
  //         next('/login');
  //     } else {
  //         next();
  //     }
  // }
});

export default router;
