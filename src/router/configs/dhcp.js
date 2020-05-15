import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "",
  component: Layout,
  icon: "icon-recursive",
  name: "dhcp-dhcp",
  meta: {
    title: "DHCP服务",
    range: "address"
  },
  children: [
    {
      name: 'subnet-pool-subnet',
      path: '/address/dhcp/subnets',
      component: () => import(/* webpackChuckName: "subnet-pool-subnet" */ "@/views/dhcp-service/address-pool/subnet-list"),
      meta: {
        title: "地址池管理"
      }
    },
    {
      name: 'address-pool-list',
      path: '/address/dhcp/subnets/:id/pools',
      component: () => import(/* webpackChuckName: "address-pool-list" */ "@/views/dhcp-service/address-pool/pool-list"),
      meta: {
        notInMenu: true,
        from: "subnet-pool-subnet",
        title: ":address"
      }
    },
    {
      name: 'option-config',
      path: '/address/dhcp/dhcpconfigs',
      component: () => import(/* webpackChuckName: "option-config" */ "@/views/dhcp-service/option-config"),
      meta: {
        title: "基础配置"
      }
    }
    // {
    //   name: 'device-manage',
    //   path: '/dhcp-service/device-manage',
    //   component: () => import(/* webpackChuckName: "device-manage" */ "@/views/dhcp-service/device-manage")
    // }
  ]
};
