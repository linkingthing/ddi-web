import Layout from "@/views/layout";

export default {
  path: "/dns",
  component: Layout,
  icon: "icon-forward",
  meta: {
    title: "转发管理",
    range: "dns",
    // isSingle: true,
  },
  name: "forward",
  children: [
    {
      // 区域转发
      name: "zone-forward",
      path: "/dns/forward/zoneForward",
      component: () => import('@/views/dns/forward/zoneForward'),
      meta: {
        // title: "转发视图"
        title: "转发管理"
      }
    },
    {
      name: "zone-query-forward",
      path: "/dns/forword/zoneQueryForward",
      component: () => import('@/views/dns/forward/zoneQueryForward'),
      meta: {
        title: "转发区域",
        notInMenu: true,
        from: "zone-forward"
      }
    },
    {
      name: "forward-list",
      path: "/dns/forword/forwardList",
      component: import('@/views/dns/forward/forwardList'),
      meta: {
        title: "区域转发列表",
        notInMenu: true,
        from: "zone-query-forward"
      }
    }
  ]
};