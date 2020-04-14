const config = r => require.ensure([], () => r(require("@/views/dns/authority/config")), "dnsLayout");
const authorityZoneQuery = r => require.ensure([], () => r(require("@/views/dns/authority/zoneQuery")), "dnsLayout");
const resourceRecord = r => require.ensure([], () => r(require("@/views/dns/authority/resourceRecord")), "dnsLayout");
const redirectView = r => require.ensure([], () => r(require("@/views/dns/authority/redirectView")), "dnsLayout");
const redirect = r => require.ensure([], () => r(require("@/views/dns/authority/redirect")), "dnsLayout");

const A4ComposeView = r => require.ensure([], () => r(require("@/views/dns/recursion/A4ComposeView")), "dnsLayout");
const A4Compose = r => require.ensure([], () => r(require("@/views/dns/recursion/A4Compose")), "dnsLayout");

const zoneForward = r => require.ensure([], () => r(require("@/views/dns/forward/zoneForward")), "dnsLayout");
const zoneQueryForward = r => require.ensure([], () => r(require("@/views/dns/forward/zoneQueryForward")), "dnsLayout");
const forwardList = r => require.ensure([], () => r(require("@/views/dns/forward/forwardList")), "dnsLayout");


export default [
   
  {
    // 配置组管理
    name: "config-group",
    path: "/dns/authority/config",
    component: config,
    meta: {
      range: "dns",
      title: "配置管理",
      parent: null
    }
  },
  {
    // 权威区域查询
    name: "authority-zone-query",
    path: "/dns/authority/zoneQuery",
    component: authorityZoneQuery,
    meta: {
      range: "dns",
      title: "区域查询",
      parent: "config-group"
    }
  },
  {
    // 资源记录
    name: "resource-record",
    path: "/dns/authority/resourceRecord",
    component: resourceRecord,
    meta: {
      range: "dns",
      title: "资源记录",
      parent: "authority-zone-query"
    }
  },
  {
    // 重定向
    name: "redirect-view",
    path: "/dns/authority/redirectView",
    component: redirectView,
    meta: {
      range: "dns",
      title: "重定向视图"

    }
  },
  {
    // 重定向
    name: "redirect",
    path: "/dns/authority/redirect",
    component: redirect,
    meta: {
      range: "dns",
      title: "重定向",
      parent: "redirect-view"
    }
  },

  {
    name: "a4-compose-view",
    path: "/dns/recursion/A4ComposeView",
    component: A4ComposeView,
    meta: {
      range: "dns",
      title: "A4地址合成视图"
    }
  },
  {
    name: "a4-compose",
    path: "/dns/recursion/view/A4Compose",
    component: A4Compose,
    meta: {
      range: "dns",
      parent: "a4-compose-view",
      title: "A4地址合成"
    }
  },

  {
    // 区域转发
    name: "zone-forward",
    path: "/dns/forward/zoneForward",
    component: zoneForward,
    meta: {
      range: "dns",
      title: "转发视图"
    }
  },
  {
    name: "zone-query-forward",
    path: "/dns/forword/zoneQueryForward",
    component: zoneQueryForward,
    meta: {
      range: "dns",
      title: "转发区域",
      parent: "zone-forward"
    }
  },
  {
    name: "forward-list",
    path: "/dns/forword/forwardList",
    component: forwardList,
    meta: {
      range: "dns",
      title: "区域转发列表",
      parent: "zone-query-forward"
    }
  }
];
