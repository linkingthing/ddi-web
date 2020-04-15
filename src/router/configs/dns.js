import Layout from "@/views/layout";

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


/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
  path: "",
  component: Layout,
  icon: "icon-authority",
  meta: {
    title: "DNS服务",
    range: "dns"
  },
  name: "dns-service",
  children: [
    {
      // 配置组管理
      name: "config-group",
      path: "/dns/authority/config",
      component: config,
      meta: {
        // title: "配置管理",
        title: "权威管理",
        parent: null
      }
    },
    {
      // 权威区域查询
      name: "authority-zone-query",
      path: "/dns/authority/zoneQuery",
      component: authorityZoneQuery,
      meta: {
        title: "区域查询",
        notInMenu: true,
        parent: "config-group"
      }
    },
    {
      // 资源记录
      name: "resource-record",
      path: "/dns/authority/resourceRecord",
      component: resourceRecord,
      meta: {
        title: "资源记录",
        notInMenu: true,
        parent: "authority-zone-query"
      }
    },
    {
      // 重定向
      name: "redirect-view",
      path: "/dns/authority/redirectView",
      component: redirectView,
      meta: {
        // title: "重定向视图"
        title: "重定向"
      }
    },
    {
      // 重定向
      name: "redirect",
      path: "/dns/authority/redirect",
      component: redirect,
      meta: {
        title: "重定向",
        notInMenu: true,
        parent: "redirect-view"
      }
    },

    {
      name: "a4-compose-view",
      path: "/dns/recursion/A4ComposeView",
      component: A4ComposeView,
      meta: {
        // title: "A4地址合成视图"
        title: "递归管理"
      }
    },
    {
      name: "a4-compose",
      path: "/dns/recursion/view/A4Compose",
      component: A4Compose,
      meta: {
        notInMenu: true,
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
        // title: "转发视图"
        title: "转发管理"
      }
    },
    {
      name: "zone-query-forward",
      path: "/dns/forword/zoneQueryForward",
      component: zoneQueryForward,
      meta: {
        title: "转发区域",
        notInMenu: true,
        parent: "zone-forward"
      }
    },
    {
      name: "forward-list",
      path: "/dns/forword/forwardList",
      component: forwardList,
      meta: {
        title: "区域转发列表",
        notInMenu: true,
        parent: "zone-query-forward"
      }
    }
  ]
};
