import Layout from "@/views/layout";

export default {
  path: "/auth",
  component: Layout,
  meta: {
    range: "auth",
    title: "访问控制",
    permission: "accessControl"

  },
  name: "auth-user",
  icon: "icon-access",
  children: [
    {
      name: "auth-user-group",
      path: "/auth/auth/user/group",
      component: () => import("@/views/user-auth/user-group"),
      icon: "icon-node",
      meta: {
        range: "auth",
        title: "用户组",
        permission: "userGroup"

      },
    },
    {
      name: "auth-user-list",
      path: "/auth/auth/user/list",
      component: () => import("@/views/user-auth/user-list"),
      icon: "icon-node",
      meta: {
        range: "auth",
        title: "用户",
        permission: "user"

      },
    },
    {
      name: "auth-role-list",
      path: "/auth/auth/role/list",
      component: () => import("@/views/user-auth/role-list"),
      icon: "icon-node",
      meta: {
        range: "auth",
        title: "角色",
        permission: "role"

      },
    },
    {
      name: "white-list",
      path: "/auth/auth/whitelists",
      component: () => import("@/views/user-auth/white-list"),
      icon: "icon-node",
      meta: {
        range: "auth",
        title: "访问白名单",
        permission: "accessWhiteList"

      },
    }
  ],
};
