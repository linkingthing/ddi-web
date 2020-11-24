import Layout from "@/views/layout";

export default {
  path: "/system",
  component: Layout,
  meta: {
    range: "system",
    title: "日志信息",
    permission: "logInfo"

  },
  name: "system-log",
  icon: "icon-log",
  redirect: { name: "operate-logs" },
  children: [
    {
      name: "operate-logs",
      path: "/system/log/auditlogs",
      component: () =>
        import(
          /* webpackChuckName: "operate-logs" */ "@/views/system/log/auditlog"
        ),
      icon: "icon-alarm",
      meta: {
        range: "system",
        title: "操作日志",
        permission: "operateLog"

      },
    },
    {
      name: "parse-logs",
      path: "/system/log/dnslogs",
      component: () =>
        import(
          /* webpackChuckName: "operate-logs" */ "@/views/system/log/parselog"
        ),
      icon: "icon-alarm",
      meta: {
        range: "system",
        title: "解析日志",
        permission: "parseLog"

      },
    },
    {
      name: "feedback-logs",
      path: "/system/log/feedback",
      component: () =>
        import(
          /* webpackChuckName: "operate-logs" */ "@/views/system/log/feedback"
        ),
      meta: {
        range: "system",
        title: "配置返显",
        permission: "configFeedback"

      },
    },
  ],
};
