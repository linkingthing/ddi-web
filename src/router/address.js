
export default [
  {
    name: 'address-manage/child-net',
    path: '/address-manage/child-net',
    component: () => import(/* webpackChuckName: "child-net" */ "./../views/address-manage/child-net/list")
  },
  {
    name: 'address-manage/ip-manage',
    path: '/address-manage/ip-manage',
    component: () => import(/* webpackChuckName: "ip-manage" */ "./../views/address-manage/child-net/ip-manage")
  },
  {
    name: 'address-manage/address-pool',
    path: '/address-manage/address-pool',
    component: () => import(/* webpackChuckName: "address-pool" */ "./../views/address-manage/child-net/address-pool")
  },
  {
    name: 'address-manage/option-config',
    path: '/address-manage/option-config',
    component: () => import(/* webpackChuckName: "option-config" */ "./../views/address-manage/option-config")
  },
  {
    name: 'address-manage/device-manage',
    path: '/address-manage/device-manage',
    component: () => import(/* webpackChuckName: "device-manage" */ "./../views/address-manage/device-manage")
  },
  {
    name: 'address-manage/addess-pool-manage',
    path: '/address-manage/addess-pool-manage',
    component: () => import(/* webpackChuckName: "addess-pool-manage" */ "./../views/address-manage/address-pool-config")
  },
  {
    path: '/address-manage/tree',
    component: () => import('@/views/address-plan/tree.vue')
},
]
