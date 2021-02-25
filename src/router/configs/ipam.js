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
    title: "资产管理",
    range: "address",
    permission: "ipamManage"

  },
  name: "ipam-manage",
  icon: "icon-asset-management",
  redirect: { name: "ipam-address-manage" },
  children: [
    {
      name: 'ipam-address-manage',
      path: '/address/asset/scannedsubnets',
      component: () => import(/* webpackChunkName: "ipam-address-manage" */ "@/views/ipam-manage/address-manage"),
      meta: {
        title: "IP资产管理",
        permission: "ipAddressMonitor"
      }
    },
    {
      name: 'ipam-network-interface',
      path: '/address/asset/scannedsubnets/:scannedsubnetsId/networkinterfaces',
      component: () => import(/* webpackChunkName: "ipam-network-interface" */ "@/views/ipam-manage/network-interface"),
      meta: {
        notInMenu: true,
        active: "ipam-address-manage",
        from: "ipam-address-manage",
        title: ":subnet",
        permission: "networkinterfaces"

      }
    },
    {
      name: 'ipam-network-ipassets',
      path: '/address/asset/scannedsubnets/:scannedsubnetsId/ipassets',
      component: () => import(/* webpackChunkName: "ipam-network-interface" */ "@/views/ipam-manage/ipassets"),
      meta: {
        notInMenu: true,
        active: "ipam-address-manage",
        from: "ipam-address-manage",
        title: ":subnet"
      }
    },
    {
      name: 'ip-assets-manage',
      path: '/address/asset/devices',
      component: () => import(/* webpackChunkName: "ip-assets-manage" */ "@/views/ipam-manage/ip-assets-manage"),
      meta: {
        title: "终端资产管理",
        permission: "terminalManage"

      }
    },
    {
      name: 'device-detect',
      path: '/address/asset/networkequipments',
      component: () => import(/* webpackChunkName: "device-detect" */ "@/views/ipam-manage/device-detect"),
      meta: {
        title: "设备资产管理",
        permission: "deviceManage"
      }
    },
    // {
    //   name: 'topology',
    //   path: '/address/ipam/topology',
    //   component: () => import(/* webpackChunkName: "device-detect" */ "@/views/ipam-manage/topology"),
    //   meta: {
    //     title: "网络拓扑",
    //     permission: "netTopology"
    //   }
    // }
  ]
}
