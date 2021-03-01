import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
  path: "",
  component: Layout,
  icon: "icon-dhcp",
  name: "dhcp-dhcp",
  meta: {
    title: "IP地址分配",
    range: "address",
    permission: "dhcpServe"
  },
  children: [
    {
      name: "subnet-pool-subnet",
      path: "/address/dhcp/subnets",
      component: () =>
        import(
          /* webpackChunkName: "subnet-pool-subnet" */ "@/views/dhcp-service/address-pool/subnet-list"
        ),
      meta: {
        title: "子网管理",
        permission: "addressPoolManage"
      }
    },
    {
      name: "dhcp-pools",
      path: "/address/dhcp/pools",
      redirect: "address-pool-list",
      component: () => import("@/views/dhcp-service/address-pool/pools-layout"),
      meta: {
        notInMenu: true,
        permission: "addressPoolManage"
      },
      children: [
        {
          name: "address-pool-list",
          path: "/address/dhcp/subnets/:id/pools",
          component: () =>
            import(
              /* webpackChunkName: "address-pool-list" */ "@/views/dhcp-service/address-pool/pool-list"
            ),
          meta: {
            notInMenu: true,
            active: "subnet-pool-subnet",
            from: "subnet-pool-subnet",
            title: ":subnet",
            permission: "addressPoolManage"
          }
        },
        {
          name: "address-pdpool-list",
          path: "/address/dhcp/subnets/:id/pdpools",
          component: () =>
            import(
              /* webpackChunkName: "address-pdpool-list" */ "@/views/dhcp-service/address-pool/pdpool-list"
            ),
          meta: {
            notInMenu: true,
            active: "subnet-pool-subnet",
            from: "subnet-pool-subnet",
            title: ":subnet",
            permission: "addressPoolpdpool"
          }
        },
        {
          name: "address-reservations-list",
          path: "/address/dhcp/subnets/:id/reservations",
          component: () =>
            import(
              /* webpackChunkName: "address-reservations-list" */ "@/views/dhcp-service/address-pool/reservations-list"
            ),
          meta: {
            notInMenu: true,
            active: "subnet-pool-subnet",
            from: "subnet-pool-subnet",
            title: ":subnet",
            permission: "addressPoolReservation"
          }
        },
        {
          name: "static-address",
          path: "/address/dhcp/subnets/:id/staticaddresses",
          component: () =>
            import(
              /* webpackChunkName: "static-address" */ "@/views/dhcp-service/address-pool/static-address"
            ),
          meta: {
            notInMenu: true,
            active: "subnet-pool-subnet",
            from: "subnet-pool-subnet",
            title: ":subnet",
            permission: "addressPoolStatic"
          }
        }
      ]
    },
    {
      name: "dhcp-config",
      path: "/address/dhcp/config",
      redirect: "/address/dhcp/dhcpconfigs",
      meta: {
        title: "DHCP基础配置",
        hideTitle: true,
        permission: "dhcpBaseConfig"
      },
      component: () => import("@/views/dhcp-service/option-config/layout"),
      children: [
        {
          name: "option-dhcpconfigs",
          path: "/address/dhcp/dhcpconfigs",
          component: () =>
            import(
              /* webpackChunkName: "option-config" */ "@/views/dhcp-service/option-config/dhcp-configs"
            ),
          meta: {
            notInMenu: true,
            from: "dhcp-config",
            title: "DHCP基础配置",
            active: "dhcp-config",
            permission: "dhcpBaseConfig"
          }
        },
        {
          name: "option-clientclasses",
          path: "/address/dhcp/clientclasses",
          component: () =>
            import(
              /* webpackChunkName: "option-config" */ "@/views/dhcp-service/option-config/client-classes"
            ),
          meta: {
            notInMenu: true,
            active: "dhcp-config",
            from: "dhcp-config",
            title: "option60",
            permission: "option60"
          }
        }
      ]
    },
    {
      name: "dynamic-address-pool-template",
      path: "/address/dhcp/dynamic-address-pool-template",
      component: () =>
        import(
          /* webpackChunkName: "subnet-pool-subnet" */ "@/views/dhcp-service/dynamic-address-pool-template"
        ),
      meta: {
        title: "动态地址池模板",
        // permission: "addressPoolManage"
      }
    },
  ]
};
