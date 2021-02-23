import Layout from "@/views/layout";

export default {
  path: "/address",
  component: Layout,
  meta: {
    range: "address",
    title: "资产治理",
    // isFlat: true,
    permission: "ipAddressPlan"
  },
  name: "addressPlan",
  redirect: { name: "ipam-address-plan" },
  icon: "icon-dhcp",

  children: [
    {
      name: "ipam-address-ip-info-manage",
      path: "/address/ipam/ip-info-manage",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/ip-info-manage"
        ),
      icon: "icon-plan",

      meta: {
        title: "IP信息管理",
        permission: "ipAddressPlan"
      }
    },
    {
      name: "ipam-address-plan",
      path: "/address/ipam/plans",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/address-plan"
        ),
      icon: "icon-plan",

      meta: {
        title: "IP地址规划",
        permission: "ipAddressPlan"
      }
    },

    {
      name: "ipam-address-plan-create",
      path: "/address/ipam/plans/create",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/address-plan/semantics"
        ),
      meta: {
        title: "语义规划",
        notInMenu: true,
        active: "ipam-address-plan",
        from: "ipam-address-plan"
      }
    },

    {
      name: "ipam-address-plan-semantics",
      path: "/address/ipam/plans/:planId",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/address-plan/semantics"
        ),
      meta: {
        title: "语义规划",
        notInMenu: true,
        active: "ipam-address-plan",
        from: "ipam-address-plan"
      }
    },

    {
      name: "ipam-address-list",
      path: "/address/ipam/address/list",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/address-plan/address-list"
        ),
      meta: {
        title: "子网列表",
        notInMenu: true,
        active: "ipam-address-plan",
        from: "ipam-address-plan"
      }
    },

    {
      name: "ipam-address-organize",
      path: "/address/ipam/address/organize",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/organize"
        ),
      meta: {
        title: "组织管理"
        // active: "ipam-address-plan",
        // from: "ipam-address-plan"
      }
    },
    {
      name: "ipam-address-ipv4-subnet-address",
      path: "/address/ipam/address/ipv4-subnet-address",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/ipv4-subnet-address"
        ),
      meta: {
        title: "Ipv4子网管理"
      }
    },
    {
      name: "ipam-address-ipv6-subnet-address",
      path: "/address/ipam/address/ipv6-subnet-address",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/ipv6-subnet-address"
        ),
      meta: {
        title: "Ipv6子网管理"
      }
    },
    {
      name: "ipam-subnet-type",
      path: "/address/ipam/address/subnet-type",
      component: () =>
        import(
          /* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/subnet-type"
        ),
      meta: {
        title: "子网类型"
      }
    }
  ]
};
