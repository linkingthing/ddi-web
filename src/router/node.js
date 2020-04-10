
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
    {
        name: 'DHCPDashboard',
        path: '/node/dhcp',
        component: () => import('@/views/node/DHCPDashboard'),
    },
    {
        name: 'ControllerDashboard',
        path: '/node/controller',
        component: () => import('@/views/node/ControllerDashboard'),
    },

]
