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
    isFlat: true,
    permission: "*"
  },
  name: "monitor",
  children: [
    {
      name: "nodeManage",
      path: "/monitor",
      component: () => import("@/views/node"),
      icon: "icon-node-monitor",
      meta: {
        range: "monitor",
        title: "概览",
        permission: "overview"
      }
    },
    {
      name: "DNSDashboard",
      path: "/monitor/dns",
      component: () => import("@/views/node/DNSDashboard"),
      icon: "icon-dns-monitor",
      meta: {
        title: "DNS统计",
        permission: "dnsStatistics"
      }
    },
    {
      name: "DHCPDashboard",
      path: "/monitor/dhcp",
      component: () => import("@/views/node/DHCPDashboard"),
      icon: "icon-dhcp-monitor",
      meta: {
        from: "monitor",
        title: "DHCP统计",
        permission: "dhcpStatistics"
      }
    },

    {
      name: "PlanMap",
      path: "/monitor/PlanMap",
      component: () => import("@/views/node/PlanMap"),
      icon: "icon-controller-monitor",
      meta: {
        range: "monitor",
        title: "规划地图",
        permission: "nodeMonitor"
      }
    },
    {
      name: "ControllerDashboard",
      path: "/monitor/controller",
      component: () => import("@/views/node/ControllerDashboard"),
      icon: "icon-controller-monitor",
      meta: {
        range: "monitor",
        title: "节点监控",
        permission: "nodeMonitor"
      }
    }
  ]
};
