
export default [
  {
    name: 'ip-address-manage',
    path: '/address-manage/child-net',
    component: () => import(/* webpackChuckName: "child-net" */ "./../views/address-manage/child-net/list")
  },
  {
    name: 'address-manage/ip-manage',
    path: '/address-manage/ip-manage',
    component: () => import(/* webpackChuckName: "ip-manage" */ "./../views/address-manage/child-net/ip-manage")
  },
  {
    name: 'option-config',
    path: '/address-manage/option-config',
    component: () => import(/* webpackChuckName: "option-config" */ "./../views/address-manage/option-config")
  },
  {
    name: 'address-manage/device-manage',
    path: '/address-manage/device-manage',
    component: () => import(/* webpackChuckName: "device-manage" */ "./../views/address-manage/device-manage")
  },
  {
    name: 'address-pool-manage',
    path: '/address-manage/addess-pool-manage',
    component: () => import(/* webpackChuckName: "addess-pool-manage" */ "./../views/address-manage/child-net/address-pool")
  },
  {
    name: 'ip-address-devide',
    path: '/address-manage/tree',
    component: () => import('@/views/address-plan/tree.vue')
  },
]
