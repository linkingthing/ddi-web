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
      name: 'subnet-pool-subnet',
      path: '/dhcp-service/subnet-pool-list',
      component: () => import(/* webpackChuckName: "subnet-pool-subnet" */ "@/views/dhcp-service/address-pool/subnet-list"),
      meta:{
        title:"地址池管理"
      }
    },
    {
      name: 'address-pool-list',
      path: '/dhcp-service/address-pool-list',
      component: () => import(/* webpackChuckName: "address-pool-list" */ "@/views/dhcp-service/address-pool/pool-list"),
      meta:{
        notInMenu:true,
        title:":subnetId"
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
  