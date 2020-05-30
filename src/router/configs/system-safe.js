import Layout from "@/views/layout"

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
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