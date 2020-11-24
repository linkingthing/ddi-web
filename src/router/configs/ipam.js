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
    range: "address",
    permission: "ipamManage"

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
        title: "IP地址规划",
        permission: "ipAddressPlan"
      }
    },

    {
      name: 'ipam-address-plan-create',
      path: '/address/ipam/plans/create',
      component: () => import(/* webpackChuckName: "ipam-address-plan" */ '@/views/ipam-manage/address-plan/semantics'),
      meta: {
        title: "语义规划",
        notInMenu: true,
        from: "ipam-address-plan",
      }
    },

    {
      name: 'ipam-address-plan-semantics',
      path: '/address/ipam/plans/:planId',
      component: () => import(/* webpackChuckName: "ipam-address-plan" */ '@/views/ipam-manage/address-plan/semantics'),
      meta: {
        title: "语义规划",
        notInMenu: true,
        from: "ipam-address-plan",
      }
    },


    {
      name: 'ipam-address-list',
      path: '/address/ipam/address/list',
      component: () => import(/* webpackChuckName: "ipam-address-plan" */ '@/views/ipam-manage/address-plan/address-list'),
      meta: {
        title: "IP地址列表",
        notInMenu: true,
        from: "ipam-address-plan",
      }
    },


    {
      name: 'ipam-address-manage',
      path: '/address/ipam/scannedsubnets',
      component: () => import(/* webpackChuckName: "ipam-address-manage" */ "@/views/ipam-manage/address-manage"),
      meta: {
        title: "IP地址监测",
        permission: "ipAddressMonitor"

      }
    },
    {
      name: 'ipam-network-interface',
      path: '/address/ipam/scannedsubnets/:scannedsubnetsId/networkinterfaces',
      component: () => import(/* webpackChuckName: "ipam-network-interface" */ "@/views/ipam-manage/network-interface"),
      meta: {
        notInMenu: true,
        from: "ipam-address-manage",
        title: ":subnet",
        permission: "networkinterfaces"

      }
    },
    {
      name: 'ip-assets-manage',
      path: '/address/ipam/assets',
      component: () => import(/* webpackChuckName: "ip-assets-manage" */ "@/views/ipam-manage/ip-assets-manage"),
      meta: {
        title: "终端管理",
        permission: "terminalManage"

      }
    },
    {
      name: 'device-detect',
      path: '/address/ipam/networkequipments',
      component: () => import(/* webpackChuckName: "device-detect" */ "@/views/ipam-manage/device-detect"),
      meta: {
        title: "设备管理",
        permission: "deviceManage"

      }
    },
    {
      name: 'topology',
      path: '/address/ipam/topology',
      component: () => import(/* webpackChuckName: "device-detect" */ "@/views/ipam-manage/topology"),
      meta: {
        title: "网络拓扑",
        permission: "netTopology"
      }
    }
  ]
}
