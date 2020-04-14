
export default [
  {
    name: 'subnet-manage',
    path: '/ipam-manage/subnet-manage',
    component: () => import(/* webpackChuckName: "subnet-manage" */ "./../views/ipam-manage/subnet-manage/list")
  },
  {
    name: 'ip-manage',
    path: '/ipam-manage/ip-manage',
    component: () => import(/* webpackChuckName: "ip-manage" */ "./../views/ipam-manage/subnet-manage/ip-manage")
  },
  {
    name: 'address-pool-manage',
    path: '/ipam-manage/addess-pool-manage',
    component: () => import(/* webpackChuckName: "addess-pool-manage" */ "./../views/ipam-manage/subnet-manage/address-pool")
  },
  {
    name: 'ip-address-devide',
    path: '/ipam-manage/address-devide',
    component: () => import(/* webpackChuckName: "ip-address-devide" */ './../views/ipam-manage/address-devide')
  }
]
