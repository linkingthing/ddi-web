const config = r => require.ensure([], () => r(require('@/views/dns/authority/config')), 'dnsLayout')
const authorityZoneQuery = r => require.ensure([], () => r(require('@/views/dns/authority/zoneQuery')), 'dnsLayout')
const resourceRecord = r => require.ensure([], () => r(require('@/views/dns/authority/resourceRecord')), 'dnsLayout')
const redirectView = r => require.ensure([], () => r(require('@/views/dns/authority/redirectView')), 'dnsLayout')
const redirect = r => require.ensure([], () => r(require('@/views/dns/authority/redirect')), 'dnsLayout')

const A4ComposeView = r => require.ensure([], () => r(require('@/views/dns/recursion/A4ComposeView')), 'dnsLayout')
const A4Compose = r => require.ensure([], () => r(require('@/views/dns/recursion/A4Compose')), 'dnsLayout')

const zoneForward = r => require.ensure([], () => r(require('@/views/dns/forward/zoneForward')), 'dnsLayout')
const zoneQueryForward = r => require.ensure([], () => r(require('@/views/dns/forward/zoneQueryForward')), 'dnsLayout')
const forwardList = r => require.ensure([], () => r(require('@/views/dns/forward/forwardList')), 'dnsLayout')

const accessControlList = r => require.ensure([], () => r(require('@/views/dns/accessControl/accessControlList')), 'dnsLayout')
const viewManage = r => require.ensure([], () => r(require('@/views/dns/accessControl/viewManage')), 'dnsLayout')

const blacklistAndwhitelist = r => require.ensure([], () => r(require('@/views/dns/blacklistAndwhitelist')), 'dnsLayout')
const developmentcontrol = r => require.ensure([], () => r(require('@/views/dns/developmentcontrol')), 'dnsLayout')


export default [

    {
        // 配置组管理
        name: 'configGroup',
        path: '/dns/authority/config',
        component: config,
        meta: {
            range: 'dns',
            title: '配置管理',
            parent: null,
        }
    },
    {
        // 权威区域查询
        name: 'authorityZoneQuery',
        path: '/dns/authority/zoneQuery',
        component: authorityZoneQuery,
        meta: {
            range: 'dns',
            title: '区域查询',
            parent: 'configGroup',
        }
    },
    {
        // 资源记录
        name: 'resourceRecord',
        path: '/dns/authority/resourceRecord',
        component: resourceRecord,
        meta: {
            range: 'dns',
            title: '资源记录',
            parent: 'authorityZoneQuery'
        }
    },
    {
        // 重定向
        name: 'redirectView',
        path: '/dns/authority/redirectView',
        component: redirectView,
        meta: {
            range: 'dns',
            title: '重定向视图',

        }
    },
    {
        // 重定向
        name: 'redirect',
        path: '/dns/authority/redirect',
        component: redirect,
        meta: {
            range: 'dns',
            title: '重定向',
            parent: 'redirectView'
        }
    },

    {
        name: 'A4ComposeView',
        path: '/dns/recursion/A4ComposeView',
        component: A4ComposeView,
        meta: {
            range: 'dns',
            title: 'A4地址合成视图'
        }
    },
    {
        name: 'A4Compose',
        path: '/dns/recursion/view/A4Compose',
        component: A4Compose,
        meta: {
            range: 'dns',
            parent: 'A4ComposeView',
            title: 'A4地址合成'
        }
    },

    {
        // 区域转发
        name: 'zoneForward',
        path: '/dns/forward/zoneForward',
        component: zoneForward,
        meta: {
            range: 'dns',
            title: '转发视图'
        }
    },
    {
        name: 'zoneQueryForward',
        path: '/dns/forword/zoneQueryForward',
        component: zoneQueryForward,
        meta: {
            range: 'dns',
            title: '转发区域',
            parent: 'zoneForward'
        }
    },
    {
        name: 'forwardList',
        path: '/dns/forword/forwardList',
        component: forwardList,
        meta: {
            range: 'dns',
            title: '区域转发列表',
            parent: 'zoneQueryForward'
        }
    },

    // 访问控制
    {
        // 访问控制列表
        name: 'accessControlList',
        path: '/dns/accessControl/accessControlList',
        component: accessControlList,
        meta: {
            range: 'dns',
            title: '访问控制列表'
        }
    },
    {
        // 视图管理
        name: 'viewManage',
        path: '/dns/accessControl/viewManage',
        component: viewManage,
        meta: {
            range: 'dns',
            title: '视图管理'
        }
    },

    {
        // 黑白名单
        name: 'blacklistAndwhitelist',
        path: '/dns/blacklistAndwhitelist',
        component: blacklistAndwhitelist,
        meta: {
            range: 'dns',
            title: '黑白名单'
        }
    },

    {
        // 开发控制
        name: 'developmentcontrol',
        path: '/dns/developmentcontrol',
        component: developmentcontrol,
        meta: {
            range: 'dns',
            title: '开发控制'
        }
    },

]
