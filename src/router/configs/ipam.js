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
  redirect: { name: "subnet-manage" },
  children: [
    {
      name: 'subnet-manage',
      path: '/address/ipam-manage/subnet-manage',
      component: () => import(/* webpackChuckName: "subnet-manage" */ "@/views/ipam-manage/subnet-manage/list"),
      meta: {
        title: "IP地址管理"
      }
    },
    {
      name: 'ip-manage',
      path: '/address/ipam-manage/ip-manage',
      component: () => import(/* webpackChuckName: "ip-manage" */ "@/views/ipam-manage/subnet-manage/ip-manage"),
      meta: {
        notInMenu: true,
        from: "subnet-manage",
        title: ":addr"
      }
    },
    {
      name: 'ip-address-devide',
      path: '/address/ipam-manage/address-devide',
      component: () => import(/* webpackChuckName: "ip-address-devide" */ '@/views/ipam-manage/address-devide'),
      meta: {
        title: "IP地址规划"
      }
    }
  ]
}
