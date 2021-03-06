import Layout from "@/views/layout";

export default {
  path: "/address",
  component: Layout,
  meta: {
    range: "address",
    title: "资产治理",
    isFlat: true,
    permission: "ipAddressPlan"
  },
  name: "addressPlan",
  redirect: { name: "ipam-address-plan" },

  children: [
    {
      name: "ipam-address-plan",
      path: "/address/ipam/plans",
      component: () => import(/* webpackChunkName: "ipam-address-plan" */ "@/views/ipam-manage/address-plan"),
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
    }
  ]
};
