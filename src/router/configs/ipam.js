import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "/address",
  component: Layout,
  meta: {
    title: "IPAM管理",
    range: "address"
  },
  name: "ipam-manage",
  icon: "icon-ipam",
  redirect: { name: "ip-address-plan" },
  children: [
    {
      name: 'ipam-address-plan',
      path: '/address/ipam/plans',
      component: () => import(/* webpackChuckName: "ipam-address-plan" */ '@/views/ipam-manage/address-plan'),
      meta: {
        title: "IP地址规划"
      }
    },
    {
      name: 'ipam-address-layouts',
      path: '/address/ipam/plans/:plansId/layouts',
      component: () => import(/* webpackChuckName: "ipam-address-layouts" */ '@/views/ipam-manage/address-layout'),
      meta: {
        notInMenu: true,
        from: "address-plan",
        title: "地址布局"
      }
    },
    {
      name: 'ipam-address-manage',
      path: '/address/ipam/subnets',
      component: () => import(/* webpackChuckName: "ipam-address-manage" */ "@/views/ipam-manage/address-manage"),
      meta: {
        title: "IP地址管理"
      }
    },
    {
      name: 'ipam-net-manage',
      path: '/address/ipam/subnets/:subnetsId/nets',
      component: () => import(/* webpackChuckName: "ipam-net-manage" */ "@/views/ipam-manage/net-manage"),
      meta: {
        notInMenu: true,
        from: "address-manage",
        title: "网络"
      }
    }
  ]
}
