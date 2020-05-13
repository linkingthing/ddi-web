import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "/ipam",
  component: Layout,
  meta: {
    title: "IPAM管理",
    range: "ipam"
  },
  name: "ipam-manage",
  icon: "icon-ipam",
  redirect: { name: "subnet-manage" },
  children: [
    {
      name: 'subnet-manage',
      path: '/ipam/ipam-manage/subnet-manage',
      component: () => import(/* webpackChuckName: "subnet-manage" */ "@/views/ipam-manage/subnet-manage/list"),
      meta: {
        title: "IP地址管理"
      }
    },
    {
      name: 'ip-manage',
      path: '/ipam/ipam-manage/ip-manage',
      component: () => import(/* webpackChuckName: "ip-manage" */ "@/views/ipam-manage/subnet-manage/ip-manage"),
      meta: {
        notInMenu: true,
        from: "subnet-manage",
        title: ":addr"
      }
    },
    {
      name: 'ip-address-plan',
      path: '/ipam/plans',
      component: () => import(/* webpackChuckName: "ip-address-plan" */ '@/views/ipam-manage/address-plan/list'),
      meta: {
        title: "IP地址规划"
      }
    },
    {
      name: 'ip-address-layouts',
      path: '/ipam/plans/:plansId/layouts',
      component: () => import(/* webpackChuckName: "ip-address-layouts" */ '@/views/ipam-manage/address-plan/layout'),
      meta: {
        notInMenu: true,
        from: "ip-address-plan",
        title: "地址布局"
      }
    }
  ]
}
