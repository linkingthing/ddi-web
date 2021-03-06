import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
  path: "/dns",
  component: Layout,
  icon: "icon-power",
  meta: {
    title: "权威服务",
    range: "dns",
    permission: "authorityServe"
  },
  name: "dns-service",
  redirect: { name: "config-group" },
  children: [
    {
      // 配置组管理
      name: "config-group",
      path: "/dns/dns/views_zones",
      component: () =>
        import(
          /* webpackChunkName: "authority" */ "@/views/dns/authority/config"
        ),
      meta: {
        title: "权威区",
        permission: "zoneConfig"

      },
    },
    {
      // 权威区域查询
      name: "authority-zone-query",
      path: "/dns/dns/views/:id/authzones",
      component: () =>
        import(
          /* webpackChunkName: "authority" */ "@/views/dns/authority/zoneQuery"
        ),
      meta: {
        title: ":id",
        notInMenu: true,
        from: "config-group",
        active: "config-group",
        permission: "authorityZone"

      },
    },
    {
      // 资源记录
      name: "resource-record",
      path: "/dns/dns/views/:id/authzones/:zoneId/authrrs",
      component: () =>
        import(
          /* webpackChunkName: "authority" */ "@/views/dns/authority/resourceRecord"
        ),
      meta: {
        title: ":name",
        notInMenu: true,
        from: "authority-zone-query",
        active: "config-group",
        permission: "rrs"

      },
    },
    {
      // 重定向
      name: "redirect-view",
      path: "/dns/dns/views_redirects",
      component: () =>
        import(
          /* webpackChunkName: "redirects" */ "@/views/dns/authority/redirectView"
        ),
      meta: {
        title: "重定向",
        permission: "redirectView"

      },
    },
    {
      // 重定向
      name: "redirect",
      path: "/dns/dns/views/:id/redirects",
      component: () =>
        import(
          /* webpackChunkName: "redirects" */ "@/views/dns/authority/redirect"
        ),
      meta: {
        title: ":id",
        notInMenu: true,
        from: "redirect-view",
        active: "redirect-view",
        permission: "redirect"

      },
    },

    {
      name: "urlredirects-view",
      path: "/dns/dns/views_urlredirects",
      component: () =>
        import(
          /* webpackChunkName: "redirects" */ "@/views/dns/authority/urlredirectsView"
        ),
      meta: {
        title: "IPv6代理",
        permission: "urlRedirectView"
      },
    },

    {
      name: "urlredirects",
      path: "/dns/dns/views/:id/urlredirects",
      component: () =>
        import(
          /* webpackChunkName: "redirects" */ "@/views/dns/authority/urlredirects"
        ),
      meta: {
        title: ":id",
        notInMenu: true,
        from: "urlredirects-view",
        active: "urlredirects-view",
        permission: "urlRedirect"
      },
    },

  ],
};
