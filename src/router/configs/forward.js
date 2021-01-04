import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
  path: "/dns",
  component: Layout,
  icon: "icon-forward",
  meta: {
    title: "转发服务",
    range: "dns",
    permission: "recursionServe"
  },
  name: "forward",
  redirect: { name: "forward-layout" },
  children: [
    {
      name: "forward-view",
      path: "/dns/dns/views_forwards",
      component: () => import("@/views/dns/forward/ForwardView"),
      meta: {
        title: "转发区",
        active: "forward-view",
        permission: "forwardConfigMenu"
      }
    },
    {
      name: "forward-group",
      path: "/dns/dns/forwardergroups",
      component: () => import("@/views/dns/forward/ForwardGroup"),
      meta: {
        title: "转发组"
      }
    },
    {
      name: "time-policy",
      path: "/dns/dns/timeschedulers",
      component: () => import("@/views/dns/forward/TimePolicy"),
      meta: {
        title: "时间策略",
        permission: "forwardGroup"
      }
    },

    {
      name: "zone-query-forward",
      path: "/dns/dns/views_forwards/:viewsId/forwardzones",
      component: () => import("@/views/dns/forward/ForwardZone"),
      meta: {
        title: ":viewsId",
        notInMenu: true,
        from: "forward-view",
        active: "forward-view",
        permission: "forwardRule"
      }
    },

    {
      name: "domain-group",
      path: "/dns/dns/domaingroups",
      component: () =>
        import(
          /* webpackChunkName: "domain-group" */ "@/views/dns/domain-group"
        ),
      meta: {
        title: "域名组"
      }
    }
    // {
    //   name: "concurrency-control",
    //   path: "/dns/forward/concurrency-control",
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "concurrency-control" */ "@/views/dns/forward/concurrency-control"
    //     ),
    //   meta: {
    //     title: "递归安全",
    //     permission: "recursionSecurity"

    //   }
    // }
  ]
};
