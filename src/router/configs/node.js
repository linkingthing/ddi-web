import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 * meta.isSingle：表示这个菜单是单节点
 */

export default {
  path: "/monitor",
  component: Layout,
  meta: {
    range: "monitor",
    title: "监控分析",
    isFlat: true
  },
  name: "node-manage",
  icon: "icon-node",
  children: [
    {
      name: 'nodeManage',
      path: '/monitor',
      component: () => import('@/views/node'),
      icon: "icon-node",
      meta: {
        range: "monitor",
        title: "节点管理"
      }
    },
    {
      name: 'DNSDashboard',
      path: '/monitor/dns',
      component: () => import('@/views/node/DNSDashboard'),
      meta: {
        from: "nodeManage",
        title: "DNS服务器"
      }
    },
    {
      name: 'DHCPDashboard',
      path: '/monitor/dhcp',
      component: () => import('@/views/node/DHCPDashboard'),
      meta: {
        from: "nodeManage",
        title: "DHCP服务器"
      }
    },
    {
      name: 'ControllerDashboard',
      path: '/monitor/controller',
      component: () => import('@/views/node/ControllerDashboard'),
      meta: {
        from: "nodeManage",
        title: "Conroller服务器"
      }
    }
  ]
};
