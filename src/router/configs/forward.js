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
    title: "递归服务",
    range: "dns"
  },
  name: "forward",
  redirect: { name: "forward-layout" },
  children: [
    {
      name: "forward-layout",
      path: "/dns/dns/forward/layout",
      redirect: { name: "forward-view" },
      component: () => import("@/views/dns/forward/layout"),
      meta: {
        title: "转发管理"
      },
      children: [
        {
          name: "forward-view",
          path: "/dns/dns/views_forwards",
          component: () => import("@/views/dns/forward/ForwardView"),
          meta: {
            title: "转发配置",
            active: "forward-layout"
          }
        },
        {
          name: "forward-group",
          path: "/dns/dns/forwards",
          component: () => import("@/views/dns/forward/ForwardGroup"),
          meta: {
            title: "转发组"
          }
        },
        {
          name: "time-policy",
          path: "/dns/dns/forwardtimepolicies",
          component: () => import("@/views/dns/forward/TimePolicy"),
          meta: {
            title: "时间策略"
          }
        },


        {
          name: "zone-query-forward",
          path: "/dns/dns/views_forwards/:viewsId/forwardzones",
          component: () => import("@/views/dns/forward/ForwardZone"),
          meta: {
            title: "转发配置编辑",
            notInMenu: true,
            from: "forward-view"
          }
        }
      ]
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
    },
    {
      name: "concurrency-control",
      path: "/dns/forward/concurrency-control",
      component: () =>
        import(
          /* webpackChunkName: "concurrency-control" */ "@/views/dns/forward/concurrency-control"
        ),
      meta: {
        title: "递归安全"
      }
    }
  ]
};
