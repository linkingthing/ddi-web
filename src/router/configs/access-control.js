import Layout from "@/views/layout"

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
    path: "",
    component: Layout,
    icon: "icon-access-control",
    meta:{
        title: "视图管理",
        range:"dns"
    },
    name:"access-control",
    children:[
        {
            // 访问控制列表
            name: 'access-control-list',
            path: '/dns/dns/acls',
            component: () => import(/* webpackChunkName: "access-control-list" */ "@/views/access-control/access-control-list"),
            meta: {
                title: 'ACL列表'
            }
        },
        {
            // 视图管理
            name: 'view-manage',
            path: '/dns/dns/views',
            component: () =>  import(/* webpackChunkName: "view-manage" */ "@/views/access-control/view-manage"),
            meta: {
                title: '视图配置'
            }
        },
        {
            // 解析优先级
            name: 'analysis-priority',
            path: '/dns/access-control/analysis-priority',
            component: () => import(/* webpackChunkName: "analysis-riority" */ '@/views/access-control/analysis-priority'),
            meta: {
                notInMenu:true,
                title: '解析优先级'
            }
        }
    ]
}
