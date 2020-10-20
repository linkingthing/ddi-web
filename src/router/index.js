import Vue from "vue";
import Router from "vue-router";
import Login from "../views/login";

Vue.use(Router);
const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ]
});

export default router;
