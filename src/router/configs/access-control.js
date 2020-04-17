import Layout from "@/views/layout"

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
    path: "",
    component: Layout,
    icon: "icon-access-control",
    meta:{
        title: "访问控制",
        range:"dns"
    },
    name:"access-control",
    children:[
        {
            // 访问控制列表
            name: 'access-control-list',
            path: '/access-control/list',
            component: () => import(/* webpackChunkName: "access-control-list" */ "@/views/access-control/access-control-list"),
            meta: {
                title: '访问控制列表'
            }
        },
        {
            // 视图管理
            name: 'view-manage',
            path: '/access-control/view-manage',
            component: () =>  import(/* webpackChunkName: "view-manage" */ "@/views/access-control/view-manage"),
            meta: {
                title: '视图管理'
            }
        },
        {
            // 解析优先级
            name: 'analysis-priority',
            path: '/access-control/analysis-priority',
            component: () => import(/* webpackChunkName: "analysis-riority" */ '@/views/access-control/analysis-priority'),
            meta: {
                notInMenu:true,
                title: '解析优先级'
            }
        }
    ]
}
  