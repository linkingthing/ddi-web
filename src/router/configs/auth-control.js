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
