import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";

Vue.use(Router);

function createRouter() {
  return new Router({
    mode: "hash",
    routes: [
      {
        path: "/login",
        name: "Login",
        component: Login
      }
    ]
  });
}
const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
