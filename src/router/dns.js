const config = r => require.ensure([], () => r(require('@/views/dns/authority/config')), 'dnsLayout')
const parameterSet = r => require.ensure([], () => r(require('@/views/dns/authority/parameterSet')), 'dnsLayout')
const authorityZoneQuery = r => require.ensure([], () => r(require('@/views/dns/authority/zoneQuery')), 'dnsLayout')
const resourceRecord = r => require.ensure([], () => r(require('@/views/dns/authority/resourceRecord')), 'dnsLayout')

const defaultA4Compose = r => require.ensure([], () => r(require('@/views/dns/recursion/defaultA4Compose')), 'dnsLayout')
const A4ComposeView = r => require.ensure([], () => r(require('@/views/dns/recursion/A4ComposeView')), 'dnsLayout')
const A4Compose = r => require.ensure([], () => r(require('@/views/dns/recursion/A4Compose')), 'dnsLayout')

const zoneForward = r => require.ensure([], () => r(require('@/views/dns/forward/zoneForward')), 'dnsLayout')
const zoneQueryForward = r => require.ensure([], () => r(require('@/views/dns/forward/zoneQueryForward')), 'dnsLayout')
const forwardList = r => require.ensure([], () => r(require('@/views/dns/forward/forwardList')), 'dnsLayout')



const viewManage = r => require.ensure([], () => r(require('@/views/dns/accessControl/viewManage')), 'dnsLayout')


const networkSwitching = r => require.ensure([], () => r(require('@/views/dns/networkSwitching')), 'dnsLayout')
const alarmList = r => require.ensure([], () => r(require('@/views/dns/alarmList')), 'dnsLayout')
const eviceStatistics = r => require.ensure([], () => r(require('@/views/dns/eviceStatistics')), 'dnsLayout')
const nat66Analysis = r => require.ensure([], () => r(require('@/views/dns/nat66Analysis')), 'dnsLayout')
const networkConvertAnalysis = r => require.ensure([], () => r(require('@/views/dns/networkConvertAnalysis')), 'dnsLayout')
const ipv6Support = r => require.ensure([], () => r(require('@/views/dns/ipv6Support')), 'dnsLayout')
const logStatistics = r => require.ensure([], () => r(require('@/views/dns/logStatistics')), 'dnsLayout')
const blacklistAndwhitelist = r => require.ensure([], () => r(require('@/views/dns/blacklistAndwhitelist')), 'dnsLayout')
const developmentcontrol = r => require.ensure([], () => r(require('@/views/dns/developmentcontrol')), 'dnsLayout')
const networkSecurity = r => require.ensure([], () => r(require('@/views/dns/networkSecurity')), 'dnsLayout')
const alarmSet = r => require.ensure([], () => r(require('@/views/dns/alarmSet')), 'dnsLayout')
const redirect = r => require.ensure([], () => r(require('@/views/dns/redirect')), 'dnsLayout')

const dnsLayout = r => require.ensure([], () => r(require('@/views/layout/dnsLayout')), 'dnsLayout')

export default {
    path: '/dns',
    name: 'dns',
    redirect: '/dns/config',
    component: dnsLayout,
    children: [
        {
            // 配置组管理
            name: 'configGroup',
            path: '/dns/config',
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
            // 访问控制列表
            name: 'eviceStatistics',
            path: '/dns/eviceStatistics',
            component: eviceStatistics,
            meta: {
                range: 'dns',
                title: '访问控制列表'
            }
        },
        {
            // A4地址合成
            name: 'defaultA4Compose',
            path: '/dns/recursion/defaultA4Compose',
            component: defaultA4Compose,
            meta: {
                range: 'dns',
                title: '默认A4地址合成'
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
            // 网络转换
            name: 'networkSwitching',
            path: '/dns/networkSwitching/:tab',
            component: networkSwitching,
            meta: {
                range: 'dns',
            }
        },
        {
            // 告警列表
            name: 'alarmList',
            path: '/dns/alarmList',
            component: alarmList,
            meta: {
                range: 'dns',
            }
        },

        {
            // NAT66统计分析
            name: 'nat66Analysis',
            path: '/dns/nat66Analysis',
            component: nat66Analysis,
            meta: {
                range: 'dns',
            }
        },
        {
            // 网络转换业务统计
            name: 'networkConvertAnalysis',
            path: '/dns/networkConvertAnalysis',
            component: networkConvertAnalysis,
            meta: {
                range: 'dns',
            }
        },


        {
            // 默认转发
            name: 'networkSecurity',
            path: '/dns/networkSecurity',
            component: networkSecurity,
            meta: {
                range: 'dns',
                title: '默认转发'
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
            // IPv6支持度
            name: 'ipv6Support',
            path: '/dns/ipv6Support',
            component: ipv6Support,
            meta: {
                range: 'dns'
            }
        },
        {
            // DDOS防护
            name: 'logStatistics',
            path: '/dns/logStatistics',
            component: logStatistics,
            meta: {
                range: 'dns',
                title: 'DDOS防护'
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
        {
            // 重定向
            name: 'redirect',
            path: '/dns/redirect',
            component: redirect,
            meta: {
                range: 'dns',
                title: '重定向'
            }
        },




        {
            // 告警设置
            name: 'alarmSet',
            path: '/dns/alarmSet',
            component: alarmSet,
            meta: {
                range: 'dns'
            }
        },
        {
            // 重定向
            name: 'parameterSet',
            path: '/dns/parameterSet',
            component: parameterSet,
            meta: {
                range: 'dns',
                title: '重定向'
            }
        }]
}