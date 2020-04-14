export default [
    // 访问控制
    {
        // 访问控制列表
        name: 'access-control-list',
        path: '/access-control/list',
        component: () => import(/* webpackChunkName: "access-control-list" */ "@/views/access-control/access-control-list"),
        meta: {
            range: 'dns',
            title: '访问控制列表'
        }
    },
    {
        // 视图管理
        name: 'view-manage',
        path: '/access-control/view-manage',
        component: () =>  import(/* webpackChunkName: "view-manage" */ "@/views/access-control/view-manage"),
        meta: {
            range: 'dns',
            title: '视图管理'
        }
    },
    {
        // 解析优先级
        name: 'analysis-priority',
        path: '/access-control/analysis-priority',
        component: () => import(/* webpackChunkName: "analysis-riority" */ '@/views/access-control/analysis-priority'),
        meta: {
            range: 'dns',
            title: '解析优先级'
        }
    }
  ]
  