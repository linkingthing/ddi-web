
export default [
    {
      name: 'option-config',
      path: '/dhcp-service/option-config',
      component: () => import(/* webpackChuckName: "option-config" */ "./../views/dhcp-service/option-config")
    },
    {
      name: 'device-manage',
      path: '/dhcp-service/device-manage',
      component: () => import(/* webpackChuckName: "device-manage" */ "./../views/dhcp-service/device-manage")
    }
  ]
  