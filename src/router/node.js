
export default [
    {
        name: 'nodeManage',
        path: '/node',
        component: () => import('@/views/node'),
    },
    {
        name: 'DNSDashboard',
        path: '/node/dns',
        component: () => import('@/views/node/DNSDashboard'),
    },

]
