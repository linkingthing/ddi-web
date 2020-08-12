import Layout from "@/views/layout";

export default {
  path: "/auth",
  component: Layout,
  meta: {
    range: "auth",
    title: "访问控制",
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
      },
    }
  ],
};
