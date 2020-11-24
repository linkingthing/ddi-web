import Layout from "@/views/layout";

export default {
  path: "/system/alarm",
  component: Layout,
  meta: {
    range: "system",
    title: "告警管理",
    permission: "alarmManage"

  },
  name: "system-alarms",
  icon: "icon-alarm",
  children: [
    {
      name: "alarm-config",
      path: "/system/alarm/thresholds",
      component: () => import("@/views/system/alarm/alarm-config"),
      icon: "icon-node",
      meta: {
        range: "system",
        title: "告警配置",
        permission: "alarmConfig"

      }
    },
    {
      name: "alarm-notice",
      path: "/system/alarm/alarms",
      component: () => import("@/views/system/alarm/alarm-notice"),
      icon: "icon-node",
      meta: {
        range: "system",
        title: "告警信息",
        permission: "alarmInfo"

      }
    },
    {
      name: "alarm-info",
      path: "/system/alarms-info",
      component: () => import("@/views/system/alarm/alarm-info"),
      icon: "icon-node",
      meta: {
        range: "system",
        title: "告警通知",
        permission: "alarmNotice"

      }
    }
  ]
};
