import Layout from "@/views/layout";

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 * meta.isSingle：表示这个菜单是单节点
 */

export default {        
    path:"",
    component:Layout,
    meta:{
        range:"node",
        isSingle:true
    },
    name: "node-manage",
    children:[
        {
            name: 'nodeManage',
            path: '/node',
            component: () => import('@/views/node'),
            icon:"icon-node",
            meta:{
                range:"node",
                title:"节点管理"
            }
        },
        {
            name: 'DNSDashboard',
            path: '/node/dns',
            component: () => import('@/views/node/DNSDashboard'),
            meta:{
                notInMenu:true,
                from:"nodeManage",
                title:"DNS服务器"
            }
        },
        {
            name: 'DHCPDashboard',
            path: '/node/dhcp',
            component: () => import('@/views/node/DHCPDashboard'),
            meta:{
                notInMenu:true,
                from:"nodeManage",
                title:"DHCP服务器"
            }
        },
        {
            name: 'ControllerDashboard',
            path: '/node/controller',
            component: () => import('@/views/node/ControllerDashboard'),
            meta:{
                notInMenu:true,
                from:"nodeManage",
                title:"Conroller服务器"
            }
        }
    ]
};
