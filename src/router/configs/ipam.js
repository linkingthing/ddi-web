import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
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
  redirect: { name: "ipam-address-plan" },
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
        from: "ipam-address-plan",
        title: ":prefix"
      }
    },
    {
      name: 'ipam-address-plan-subnet',
      path: '/address/ipam/plans/:plansId/layouts/:layoutsId/plannedsubnets',
      component: () => import(/* webpackChuckName: "ipam-address-plan-subnet" */ '@/views/ipam-manage/address-plan-subnet'),
      meta: {
        notInMenu: true,
        from: "ipam-address-layouts",
        title: ":layoutName"
      }
    },
    {
      name: 'ipam-address-manage',
      path: '/address/ipam/scannedsubnets',
      component: () => import(/* webpackChuckName: "ipam-address-manage" */ "@/views/ipam-manage/address-manage"),
      meta: {
        title: "IP地址管理"
      }
    },
    {
      name: 'ipam-network-interface',
      path: '/address/ipam/scannedsubnets/:scannedsubnetsId/networkinterfaces',
      component: () => import(/* webpackChuckName: "ipam-network-interface" */ "@/views/ipam-manage/network-interface"),
      meta: {
        notInMenu: true,
        from: "ipam-address-manage",
        title: ":subnet"
      }
    },
    {
      name: 'ip-assets-manage',
      path: '/address/ipam/assets',
      component: () => import(/* webpackChuckName: "ip-assets-manage" */ "@/views/ipam-manage/ip-assets-manage"),
      meta: {
        title: "终端管理"
      }
    },
    {
      name: 'device-detect',
      path: '/address/ipam/networkequipments',
      component: () => import(/* webpackChuckName: "device-detect" */ "@/views/ipam-manage/device-detect"),
      meta: {
        title: "设备探测"
      }
    }
  ]
}
