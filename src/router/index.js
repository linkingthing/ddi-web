import Vue from "vue";
import Router from "vue-router";
import store from "../util/store";
import Login from "../views/login";
import Layout from "../views/layout";
import node from "./node";
import dns from "./dns";
import ipam from "./ipam";
import dhcp from "./dhcp";
import systemSafe from "./system-safe";
import accessControl from "./access-control";

const Cache = store();

const moduleList = [{
  label: "node",
  modules: node
}, {
  label: "dns",
  modules: dns
}, {
  label: "ipam",
  modules: ipam
}, {
  label: "dns",
  modules: dhcp
}, {
  label: "dns",
  modules: systemSafe
}, {
  label: "dns",
  modules: accessControl
}];

const packMaterial = moduleList
// eslint-disable-next-line no-undef
  .filter(item => PACK_SYSTEM.includes(item.label))
  .map(item => [...item.modules])
  .reduce((result, current) => result.concat(current), []);

Vue.use(Router);
const router = new Router({
  mode: "hash",
  routes: [{
    path: "/",
    name: "Index",
    component: Layout,
    redirect: "/node",
    meta: {
      range: "node"
    },
    children: packMaterial
  },
  {
    // 登陆页
    path: "/login",
    name: "Login",
    component: Login
  }
  ]
});

// router.beforeEach((to, from, next) => {
//     if (to.path === '/login') {
//         next();
//     } else {
//         let token = Cache.get('token');
//         if (token === null || token === '') {
//             next('/login');
//         } else {
//             next();
//         }
//     }
// });

export default router;