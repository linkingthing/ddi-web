const configGroupMg = r => require.ensure([], () => r(require('@/views/dns/authority/configGroupMg')), 'dnsLayout')
const parameterSet = r => require.ensure([], () => r(require('@/views/dns/authority/parameterSet')), 'dnsLayout')


const limitingUserBroadband = r => require.ensure([], () => r(require('@/views/dns/recursion/limitingUserBroadband')), 'dnsLayout')
const limitingWebsiteBroadband = r => require.ensure([], () => r(require('@/views/dns/recursion/limitingWebsiteBroadband')), 'dnsLayout')

const networkSwitching = r => require.ensure([], () => r(require('@/views/dns/networkSwitching')), 'dnsLayout')
const appUpgrade = r => require.ensure([], () => r(require('@/views/dns/appUpgrade')), 'dnsLayout')
const alarmList = r => require.ensure([], () => r(require('@/views/dns/alarmList')), 'dnsLayout')
const eviceStatistics = r => require.ensure([], () => r(require('@/views/dns/eviceStatistics')), 'dnsLayout')
const deviceMonitor = r => require.ensure([], () => r(require('@/views/dns/deviceMonitor')), 'dnsLayout')
const dsliteAnalysis = r => require.ensure([], () => r(require('@/views/dns/dsliteAnalysis')), 'dnsLayout')
const nat66Analysis = r => require.ensure([], () => r(require('@/views/dns/nat66Analysis')), 'dnsLayout')
const networkConvertAnalysis = r => require.ensure([], () => r(require('@/views/dns/networkConvertAnalysis')), 'dnsLayout')
const dsliteBusinessAnalysis = r => require.ensure([], () => r(require('@/views/dns/dsliteBusinessAnalysis')), 'dnsLayout')
const appUpgradeBusinessAnalysis = r => require.ensure([], () => r(require('@/views/dns/appUpgradeBusinessAnalysis')), 'dnsLayout')
const ipv6Support = r => require.ensure([], () => r(require('@/views/dns/ipv6Support')), 'dnsLayout')
const logStatistics = r => require.ensure([], () => r(require('@/views/dns/logStatistics')), 'dnsLayout')
const blacklistAndwhitelist = r => require.ensure([], () => r(require('@/views/dns/blacklistAndwhitelist')), 'dnsLayout')
const developmentcontrol = r => require.ensure([], () => r(require('@/views/dns/developmentcontrol')), 'dnsLayout')
const thresholdList = r => require.ensure([], () => r(require('@/views/dns/thresholdList')), 'dnsLayout')
const restrictWebsiteVisits = r => require.ensure([], () => r(require('@/views/dns/restrictWebsiteVisits')), 'dnsLayout')
const networkSecurity = r => require.ensure([], () => r(require('@/views/dns/networkSecurity')), 'dnsLayout')
const applicationFirewall = r => require.ensure([], () => r(require('@/views/dns/applicationFirewall')), 'dnsLayout')
const alarmSet = r => require.ensure([], () => r(require('@/views/dns/alarmSet')), 'dnsLayout')
const registration = r => require.ensure([], () => r(require('@/views/dns/registration')), 'dnsLayout')
const redirect = r => require.ensure([], () => r(require('@/views/dns/redirect')), 'dnsLayout')

const dnsLayout = r => require.ensure([], () => r(require('@/views/dns/dnsLayout')), 'dnsLayout')

export default {
    path: '/dns',
    name: 'dns',
    redirect: '/dns/configGroupMg',
    component: dnsLayout,
    children: [
        {
            // 配置组管理
            name: 'configGroupMg',
            path: '/dns/configGroupMg',
            component: configGroupMg,
            meta: {
                range: 'dns',
                oneTitle: '配置管理',
                title: '配置管理',
                icon: 'ios-aperture-outline',
            }
        },
        {
            // 访问控制列表
            name: 'eviceStatistics',
            path: '/dns/eviceStatistics',
            component: eviceStatistics,
            meta: {
                range: 'dns',
                oneTitle: '访问控制',
                title: '访问控制列表'
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
            // 视图管理
            name: 'deviceMonitor',
            path: '/dns/deviceMonitor',
            component: deviceMonitor,
            meta: {
                range: 'dns',
                oneTitle: '访问控制',
                title: '视图管理'
            }
        },
        {
            // DSLITE统计分析
            name: 'dsliteAnalysis',
            path: '/dns/dsliteAnalysis',
            component: dsliteAnalysis,
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
            // 区域转发
            name: 'dsliteBusinessAnalysis',
            path: '/dns/dsliteBusinessAnalysis',
            component: dsliteBusinessAnalysis,
            meta: {
                range: 'dns',
                title: '区域转发'
            }
        },

        {
            // 区域查询
            name: 'appUpgradeBusinessAnalysis',
            path: '/dns/appUpgradeBusinessAnalysis',
            component: appUpgradeBusinessAnalysis,
            meta: {
                range: 'dns',
                title: '区域查询',
                icon: 'dashboard'
            }
        },
        {
            // 资源记录
            name: 'appUpgrade',
            path: '/dns/appUpgrade',
            component: appUpgrade,
            meta: {
                range: 'dns',
                title: '资源记录',
                icon: 'dashboard'
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
                oneTitle: '安全管理',
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
                oneTitle: '安全管理',
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
                oneTitle: '安全管理',
                title: '开发控制'
            }
        },
        {
            // 用户注册
            name: 'registration',
            path: '/dns/registration',
            component: registration,
            meta: {
                range: 'dns',
                oneTitle: '系统管理',
                title: '用户注册'

            }
        },
        {
            // 重定向
            name: 'redirect',
            path: '/dns/redirect',
            component: redirect,
            meta: {
                range: 'dns',
                oneTitle: '权威管理',
                title: '重定向'

            }
        },
        {
            // 告警阀值列表
            name: 'thresholdList',
            path: '/dns/thresholdList',
            component: thresholdList,
            meta: {
                range: 'dns'
            }
        },
        {
            // 限制用户带宽
            name: 'limitingUserBroadband',
            path: '/dns/limitingUserBroadband',
            component: limitingUserBroadband,
            meta: {
                range: 'dns'
            }
        },
        {
            // A4地址合成
            name: 'limitingWebsiteBroadband',
            path: '/dns/limitingWebsiteBroadband',
            component: limitingWebsiteBroadband,
            meta: {
                range: 'dns',
                oneTitle: '递归管理',
                title: 'A4地址合成'
            }
        },
        {
            // 限制网站访问量
            name: 'restrictWebsiteVisits',
            path: '/dns/restrictWebsiteVisits',
            component: restrictWebsiteVisits,
            meta: {
                range: 'dns'
            }
        },
        {
            // 默认转发
            name: 'networkSecurity',
            path: '/dns/networkSecurity',
            component: networkSecurity,
            meta: {
                range: 'dns',
                oneTitle: '转发管理',
                title: '默认转发'
            }
        },
        {
            // 区域转发
            name: 'applicationFirewall',
            path: '/dns/applicationFirewall',
            component: applicationFirewall,
            meta: {
                range: 'dns',
                oneTitle: '转发管理',
                title: '区域转发'

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