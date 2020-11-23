import Layout from "@/views/layout"

export default {
  path: "/system/ipdispatchconfig",
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
      path: "/system/ipdispatchconfig",
      component: () => import(/* webpackChunkName: "black-white-list-manage" */ "@/views/system/linkage"),
      meta: {
        title: "系统联动"
      }
    }
  ]
};