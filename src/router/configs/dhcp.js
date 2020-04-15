import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "",
  component: Layout,
  icon: "icon-recursive",
  name:"dhcp-service",
  meta:{
      title: "DHCP服务",
      range:"ipam"
  },
  children:[
    {
      name: 'address-pool',
      path: '/dhcp-service/addess-pool',
      component: () => import(/* webpackChuckName: "addess-pool" */ "@/views/dhcp-service/address-pool"),
      meta:{
        title:"地址池管理"
      }
    },
    {
      name: 'option-config',
      path: '/dhcp-service/option-config',
      component: () => import(/* webpackChuckName: "option-config" */ "@/views/dhcp-service/option-config"),
      meta:{
        title:"OPTION配置"
      }
    }
    // {
    //   name: 'device-manage',
    //   path: '/dhcp-service/device-manage',
    //   component: () => import(/* webpackChuckName: "device-manage" */ "@/views/dhcp-service/device-manage")
    // }
  ]
};
  