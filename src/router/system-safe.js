export default [
  {
    // 并发控制
    name: "concurrency-control",
    path: "/system-safe/concurrency-control",
    component: () => import(/* webpackChunkName: "concurrency-control" */ "./../views/system-safe/concurrency-control"),
    meta: {
      range: "dns",
      title: "并发控制"
    }
  },
  {
    // 黑白名单(安全管理)
    name: "black-white-list-manage",
    path: "/system-safe/black-white-list-manage",
    component: () => import(/* webpackChunkName: "black-white-list-manage" */ "./../views/system-safe/black-white-list-manage"),
    meta: {
      range: "dns",
      title: "黑白名单"
    }
  }
];