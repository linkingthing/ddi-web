import Layout from "@/views/layout"

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "/dns",
  component: Layout,
  icon: "icon-safe",
  meta: {
    title: "系统安全",
    range: "dns"
  },
  name: "system-safe",
  children: [
    {
      // 并发控制
      name: "concurrency-control",
      path: "/dns/system-safe/concurrency-control",
      component: () => import(/* webpackChunkName: "concurrency-control" */ "@/views/system-safe/concurrency-control"),
      meta: {
        title: "并发控制"
      }
    },
    {
      // 黑白名单(安全管理)
      name: "black-white-list-manage",
      path: "/dns/system-safe/black-white-list-manage",
      component: () => import(/* webpackChunkName: "black-white-list-manage" */ "@/views/system-safe/black-white-list-manage"),
      meta: {
        title: "安全管理"
      }
    }
  ]
};