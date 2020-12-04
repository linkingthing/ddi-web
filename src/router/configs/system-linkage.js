import Layout from "@/views/layout"

export default {
  path: "/system/ipdispatchconfigs",
  component: Layout,
  icon: "icon-safe",
  meta: {
    title: "系统联动",
    range: "system",
		isFlat: true
  },
  name: "system-linkage",
  children: [
    {
      icon: 'icon-safe',
      name: "system-linkage",
      path: "/system/ipdispatchconfigs",
      component: () => import(/* webpackChunkName: "black-white-list-manage" */ "@/views/system/linkage"),
      meta: {
        title: "系统联动"
      }
    }
  ]
};