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
          /* webpackChunkName: "option-config" */ "@/views/dns/authority/config"
        ),
      meta: {
        title: "区配置",
        permission: "zoneConfig"

      },
    },
    {
      // 权威区域查询
      name: "authority-zone-query",
      path: "/dns/dns/views/:id/zones",
      component: () =>
        import(
          /* webpackChunkName: "option-config" */ "@/views/dns/authority/zoneQuery"
        ),
      meta: {
        title: "区域查询",
        notInMenu: true,
        from: "config-group",
        permission: "authorityZone"

      },
    },
    {
      // 资源记录
      name: "resource-record",
      path: "/dns/dns/views/:id/zones/:zoneId/rrs",
      component: () =>
        import(
          /* webpackChuckName: "option-config" */ "@/views/dns/authority/resourceRecord"
        ),
      meta: {
        title: "资源记录",
        notInMenu: true,
        from: "authority-zone-query",
        permission: "rrs"

      },
    },
    {
      // 重定向
      name: "redirect-view",
      path: "/dns/dns/views_redirects",
      component: () =>
        import(
          /* webpackChuckName: "option-config" */ "@/views/dns/authority/redirectView"
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
          /* webpackChuckName: "option-config" */ "@/views/dns/authority/redirect"
        ),
      meta: {
        title: "重定向",
        notInMenu: true,
        from: "redirect-view",
        permission: "redirect"

      },
    },

    {
      name: "urlredirects-view",
      path: "/dns/dns/views_urlredirects",
      component: () =>
        import(
          /* webpackChuckName: "option-config" */ "@/views/dns/authority/urlredirectsView"
        ),
      meta: {
        title: "URL重定向",
        permission: "urlRedirectView"
      },
    },

    {
      name: "urlredirects",
      path: "/dns/dns/views/:id/urlredirects",
      component: () =>
        import(
          /* webpackChuckName: "option-config" */ "@/views/dns/authority/urlredirects"
        ),
      meta: {
        title: "URL重定向",
        notInMenu: true,
        from: "urlredirects-view",
        permission: "urlRedirect"
      },
    },

  ],
};
