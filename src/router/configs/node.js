import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
  path: "/monitor",
  component: Layout,
  meta: {
    range: "monitor",
    title: "监控分析",
    isFlat: true
  },
  name: "monitor",
  children: [
    {
      name: 'nodeManage',
      path: '/monitor',
      component: () => import('@/views/node'),
      icon: "icon-node",
      meta: {
        range: "monitor",
        title: "概览",
      }
    },
    {
      name: 'nodeControll',
      path: '/monitor/node-control',
      component: () => import('@/views/node/NodeControl'),
      icon: "icon-dns",
      meta: {
        range: "monitor",
        title: "系统信息",
      }
    },
    {
      name: 'DNSDashboard',
      path: '/monitor/dns',
      component: () => import('@/views/node/DNSDashboard'),
      icon: "icon-dns",
      meta: {
        from: "monitor",
        title: "DNS服务器",
        notInMenu: true,
      }
    },
    {
      name: 'DHCPDashboard',
      path: '/monitor/dhcp',
      component: () => import('@/views/node/DHCPDashboard'),
      icon: "icon-dhcp",
      meta: {
        notInMenu: true,
        from: "monitor",
        title: "DHCP服务器"
      }
    },
    {
      name: 'ControllerDashboard',
      path: '/monitor/controller',
      component: () => import('@/views/node/ControllerDashboard'),
      icon: "icon-controller",
      meta: {
        range: "nodeManage",
        title: "节点监控"
      }
    }
  ]
};
