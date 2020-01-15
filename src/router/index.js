import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login'
import Index from '../views/index'
// space6
import space6Layout from '../views/space6Layout'
import space6 from '../views/space6'
const networkSwitching = r => require.ensure([], () => r(require('../views/networkSwitching')), 'space6Layout')
const appUpgrade = r => require.ensure([], () => r(require('../views/appUpgrade')), 'space6Layout')
const alarmList = r => require.ensure([], () => r(require('../views/alarmList')), 'space6Layout')
const eviceStatistics = r => require.ensure([], () => r(require('../views/eviceStatistics')), 'space6Layout')
const deviceMonitor = r => require.ensure([], () => r(require('../views/deviceMonitor')), 'space6Layout')
const dsliteAnalysis = r => require.ensure([], () => r(require('../views/dsliteAnalysis')), 'space6Layout')
const nat66Analysis = r => require.ensure([], () => r(require('../views/nat66Analysis')), 'space6Layout')
const networkConvertAnalysis = r => require.ensure([], () => r(require('../views/networkConvertAnalysis')), 'space6Layout')
const dsliteBusinessAnalysis = r => require.ensure([], () => r(require('../views/dsliteBusinessAnalysis')), 'space6Layout')
const appUpgradeBusinessAnalysis = r => require.ensure([], () => r(require('../views/appUpgradeBusinessAnalysis')), 'space6Layout')
const configGroupMg = r => require.ensure([], () => r(require('../views/configGroupMg')), 'space6Layout')
const ipv6Support = r => require.ensure([], () => r(require('../views/ipv6Support')), 'space6Layout')
const logStatistics = r => require.ensure([], () => r(require('../views/logStatistics')), 'space6Layout')
const blacklistAndwhitelist = r => require.ensure([], () => r(require('../views/blacklistAndwhitelist')), 'space6Layout')
const developmentcontrol = r => require.ensure([], () => r(require('../views/developmentcontrol')), 'space6Layout')
const thresholdList = r => require.ensure([], () => r(require('../views/thresholdList')), 'space6Layout')
const limitingUserBroadband = r => require.ensure([], () => r(require('../views/limitingUserBroadband')), 'space6Layout')
const limitingWebsiteBroadband = r => require.ensure([], () => r(require('../views/limitingWebsiteBroadband')), 'space6Layout')
const restrictWebsiteVisits = r => require.ensure([], () => r(require('../views/restrictWebsiteVisits')), 'space6Layout')
const networkSecurity = r => require.ensure([], () => r(require('../views/networkSecurity')), 'space6Layout')
const applicationFirewall = r => require.ensure([], () => r(require('../views/applicationFirewall')), 'space6Layout')
const alarmSet = r => require.ensure([], () => r(require('../views/alarmSet')), 'space6Layout')
const registration = r => require.ensure([], () => r(require('../views/registration')), 'space6Layout')
const redirect = r => require.ensure([], () => r(require('../views/redirect')), 'space6Layout')
// import space6Layout from '../views/space6Layout'

// import space6 from '../views/space6'
// import networkSwitching from '../views/networkSwitching'
// import appUpgrade from '../views/appUpgrade'
// import clusterMg from '../views/clusterMg'
// import alarmList from '../views/alarmList'
// import eviceStatistics from '../views/eviceStatistics'
// import deviceMonitor from '../views/deviceMonitor'
// import dsliteAnalysis from '../views/dsliteAnalysis'
// import nat66Analysis from '../views/nat66Analysis'
// import networkConvertAnalysis from '../views/networkConvertAnalysis'
// import dsliteBusinessAnalysis from '../views/dsliteBusinessAnalysis'
// import appUpgradeBusinessAnalysis from '../views/appUpgradeBusinessAnalysis'
// import configGroupMg from '../views/configGroupMg'
// import ipv6Support from '../views/ipv6Support'
// import logStatistics from '../views/logStatistics'
// import thresholdList from '../views/thresholdList'
// import limitingUserBroadband from '../views/limitingUserBroadband'
// import limitingWebsiteBroadband from '../views/limitingWebsiteBroadband'
// import restrictWebsiteVisits from '../views/restrictWebsiteVisits'
// import networkSecurity from '../views/networkSecurity'
// import applicationFirewall from '../views/applicationFirewall'
// import alarmSet from '../views/alarmSet'
// dns
const dnsLayout = r => require.ensure([], () => r(require('../views/dnsLayout')), 'dnsLayout')
const forwardDomain = r => require.ensure([], () => r(require('../views/forwardDomain')), 'dnsLayout')
const analyticalSetup = r => require.ensure([], () => r(require('../views/analyticalSetup')), 'dnsLayout')
const reverseIp = r => require.ensure([], () => r(require('../views/reverseIp')), 'dnsLayout')
const recursionAnalysis = r => require.ensure([], () => r(require('../views/recursionAnalysis')), 'dnsLayout')
const forwardConfig = r => require.ensure([], () => r(require('../views/forwardConfig')), 'dnsLayout')
const sysConfig = r => require.ensure([], () => r(require('../views/sysConfig')), 'dnsLayout')
const sysMonitor = r => require.ensure([], () => r(require('../views/sysMonitor')), 'dnsLayout')
const linkConfig = r => require.ensure([], () => r(require('../views/linkConfig')), 'dnsLayout')
const linkPort = r => require.ensure([], () => r(require('../views/linkPort')), 'dnsLayout')
const ipLibrary = r => require.ensure([], () => r(require('../views/ipLibrary')), 'dnsLayout')
const blacklist = r => require.ensure([], () => r(require('../views/blacklist')), 'dnsLayout')
const parameterSet = r => require.ensure([], () => r(require('../views/parameterSet')), 'dnsLayout')
// import dnsLayout from '../views/dnsLayout'
// import forwardDomain from '../views/forwardDomain'
// import analyticalSetup from '../views/analyticalSetup'
// import reverseIp from '../views/reverseIp'
// import recursionAnalysis from '../views/recursionAnalysis'
// import forwardConfig from '../views/forwardConfig'
// import sysConfig from '../views/sysConfig'
// import sysMonitor from '../views/sysMonitor'
// import linkConfig from '../views/linkConfig'
// import linkPort from '../views/linkPort'
// import ipLibrary from '../views/ipLibrary'
// import blacklist from '../views/blacklist'
// import parameterSet from '../views/parameterSet'
// dhcp
const dhcpLayout = r => require.ensure([], () => r(require('../views/dhcpLayout')), 'dhcpLayout')
const subnetList = r => require.ensure([], () => r(require('../views/subnetList')), 'dhcpLayout')
const addressPool = r => require.ensure([], () => r(require('../views/addressPool')), 'dhcpLayout')
// const addressPool = r => require.ensure([], () => r(require('../views/addressPool')))
const staticBinding = r => require.ensure([], () => r(require('../views/staticBinding')), 'dhcpLayout')
// import dhcpLayout from '../views/dhcpLayout'
// import subnetList from '../views/subnetList'
// import addressPool from '../views/addressPool'
// import staticBinding from '../views/staticBinding'
// 系统管理
const sysLayout = r => require.ensure([], () => r(require('../views/sysLayout')), 'sysLayout')
const userList = r => require.ensure([], () => r(require('../views/userList')), 'sysLayout')
const roleMg = r => require.ensure([], () => r(require('../views/roleMg')), 'sysLayout')
const sysLog = r => require.ensure([], () => r(require('../views/sysLog')), 'sysLayout')
// import sysLayout from '../views/sysLayout'
// import userList from '../views/userList'
// import roleMg from '../views/roleMg'
// import sysLog from '../views/sysLog'
// 设备管理
// const deviceLayout = r => require.ensure([], () => r(require('../views/deviceLayout')), 'deviceLayout')
// const deviceMg = r => require.ensure([], () => r(require('../views/deviceMg')), 'deviceLayout')
// const serviceMg = r => require.ensure([], () => r(require('../views/serviceMg')), 'deviceLayout')
// import deviceLayout from '../views/deviceLayout'
// import deviceMg from '../views/deviceMg'
// import serviceMg from '../views/serviceMg'
// 集群管理
const colonyLayout = r => require.ensure([], () => r(require('../views/colonyLayout')), 'colonyLayout')
const clusterMg = r => require.ensure([], () => r(require('../views/clusterMg')), 'colonyLayout')
const deviceMg = r => require.ensure([], () => r(require('../views/deviceMg')), 'colonyLayout')
const serviceMg = r => require.ensure([], () => r(require('../views/serviceMg')), 'colonyLayout')

//不是首先加载的模块使用异步按需加载
// const Index = r => require.ensure([], () => r(require('../views/index')), 'index')


Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [{
            path: '/',
            name: 'Index',
            component: Index,
            redirect: '/space6Layout/space6',
            meta: {
              range: 'space6Layout',
            },
            // redirect: '/space6Layout/eviceStatistics',
            children: [{
                path: '/space6Layout',
                name: 'space6Layout',
                redirect: '/space6Layout/space6',
                component: space6Layout,
                children: [
                {
                    // space6
                    name: 'space6',
                    path: '/space6Layout/space6',
                    component: space6,
                    meta: {
                      range: 'space6Layout',
                      title: 'Home'
                    }
                },
                {
                    // 访问控制列表
                    name: 'eviceStatistics',
                    path: '/space6Layout/eviceStatistics',
                    component: eviceStatistics,
                    meta: {
                      range: 'space6Layout',
                      oneTitle:'访问控制',
                      title:'访问控制列表'
                    }
                },

                {
                    // 网络转换
                    name: 'networkSwitching',
                    path: '/space6Layout/networkSwitching/:tab',
                    component: networkSwitching,
                    meta: {
                      range: 'space6Layout',
                    }
                },
                {
                    // 告警列表
                    name: 'alarmList',
                    path: '/space6Layout/alarmList',
                    component: alarmList,
                    meta: {
                        range: 'space6Layout',
                    }
                },

                {
                    // 视图管理
                    name: 'deviceMonitor',
                    path: '/space6Layout/deviceMonitor',
                    component: deviceMonitor,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'访问控制',
                        title:'视图管理'
                    }
                },{
                    // DSLITE统计分析
                    name: 'dsliteAnalysis',
                    path: '/space6Layout/dsliteAnalysis',
                    component: dsliteAnalysis,
                    meta: {
                        range: 'space6Layout', 
                    }
                },{
                    // NAT66统计分析
                    name: 'nat66Analysis',
                    path: '/space6Layout/nat66Analysis',
                    component: nat66Analysis,
                    meta: {
                        range: 'space6Layout', 
                    }
                },{
                    // 网络转换业务统计
                    name: 'networkConvertAnalysis',
                    path: '/space6Layout/networkConvertAnalysis',
                    component: networkConvertAnalysis,
                    meta: {
                        range: 'space6Layout', 
                    }
                },{
                    // 区域转发
                    name: 'dsliteBusinessAnalysis',
                    path: '/space6Layout/dsliteBusinessAnalysis',
                    component: dsliteBusinessAnalysis,
                    meta: {
                        range: 'space6Layout', 
                        title: '区域转发'
                    }
                },

                {
                // 配置组管理
                name: 'configGroupMg',
                path: '/space6Layout/configGroupMg',
                component: configGroupMg,
                meta: {
                    range: 'space6Layout',
                    oneTitle:'配置管理',
                    title:'配置管理',
                    icon:'dashboard',
                }
                },
                {
                    // 区域查询
                    name: 'appUpgradeBusinessAnalysis',
                    path: '/space6Layout/appUpgradeBusinessAnalysis',
                    component: appUpgradeBusinessAnalysis,
                    meta: {
                        range: 'space6Layout',
                        title:'区域查询',
                        icon:'dashboard'
                    }
                },
                {
                // 资源记录
                name: 'appUpgrade',
                path: '/space6Layout/appUpgrade',
                component: appUpgrade,
                meta: {
                    range: 'space6Layout',
                    title: '资源记录',
                    icon:'dashboard'}
                },
                {
                    // IPv6支持度
                    name: 'ipv6Support',
                    path: '/space6Layout/ipv6Support',
                    component: ipv6Support,
                    meta: {
                        range: 'space6Layout'
                    }
                },
                {
                    // DDOS防护
                    name: 'logStatistics',
                    path: '/space6Layout/logStatistics',
                    component: logStatistics,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'安全管理',
                        title:'DDOS防护'
                    }
                },
                {
                    // 黑白名单
                    name: 'blacklistAndwhitelist',
                    path: '/space6Layout/blacklistAndwhitelist',
                    component: blacklistAndwhitelist,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'安全管理',
                        title:'黑白名单'
                    }
                },
                {
                    // 开发控制
                    name: 'developmentcontrol',
                    path: '/space6Layout/developmentcontrol',
                    component: developmentcontrol,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'安全管理',
                        title:'开发控制'
                    }
                },
                {
                    // 用户注册
                    name: 'registration',
                    path: '/space6Layout/registration',
                    component: registration,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'系统管理',
                        title:'用户注册'

                    }
                },
                {
                    // 重定向
                    name: 'redirect',
                    path: '/space6Layout/redirect',
                    component: redirect,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'权威管理',
                        title:'重定向'

                    }
                },
                {
                    // 告警阀值列表
                    name: 'thresholdList',
                    path: '/space6Layout/thresholdList',
                    component: thresholdList,
                    meta: {
                        range: 'space6Layout'
                    }
                },{
                    // 限制用户带宽
                    name: 'limitingUserBroadband',
                    path: '/space6Layout/limitingUserBroadband',
                    component: limitingUserBroadband,
                    meta: {
                        range: 'space6Layout'
                    }
                },{
                    // A4地址合成
                    name: 'limitingWebsiteBroadband',
                    path: '/space6Layout/limitingWebsiteBroadband',
                    component: limitingWebsiteBroadband,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'递归管理',
                        title:'A4地址合成'
                    }
                },{
                    // 限制网站访问量
                    name: 'restrictWebsiteVisits',
                    path: '/space6Layout/restrictWebsiteVisits',
                    component: restrictWebsiteVisits,
                    meta: {
                        range: 'space6Layout'
                    }
                },{
                    // 默认转发
                    name: 'networkSecurity',
                    path: '/space6Layout/networkSecurity',
                    component: networkSecurity,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'转发管理',
                        title:'默认转发'
                    }
                },{
                    // 区域转发
                    name: 'applicationFirewall',
                    path: '/space6Layout/applicationFirewall',
                    component: applicationFirewall,
                    meta: {
                        range: 'space6Layout',
                        oneTitle:'转发管理',
                        title: '区域转发'

                    }
                },{
                    // 告警设置
                    name: 'alarmSet',
                    path: '/space6Layout/alarmSet',
                    component: alarmSet,
                    meta: {
                        range: 'space6Layout'
                    }
                },{
                    // 重定向
                    name: 'parameterSet',
                    path: '/space6Layout/parameterSet',
                    component: parameterSet,
                    meta: {
                        range: 'space6Layout',
                        title:'重定向'
                    }
                }]
            },{
                path: '/dns',
                component: dnsLayout,
                redirect: '/dnsLayout/forwardDomain',
                meta: {
                    range: 'dnsLayout'
                },
                children: [
                  {
                    // 正向域名设置
                    name: 'forwardDomain',
                    path: '/dnsLayout/forwardDomain',
                    component: forwardDomain,
                    meta: {
                      range: 'dnsLayout',
                      title: 'Home'
                    }
                },{
                    // 解析设置
                    name: 'analyticalSetup',
                    path: '/dnsLayout/analyticalSetup',
                    component: analyticalSetup,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 反向IP设置
                    name: 'reverseIp',
                    path: '/dnsLayout/reverseIp',
                    component: reverseIp,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 递归解析
                    name: 'recursionAnalysis',
                    path: '/dnsLayout/recursionAnalysis',
                    component: recursionAnalysis,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 递归解析
                    name: 'forwardConfig',
                    path: '/dnsLayout/forwardConfig',
                    component: forwardConfig,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 系统配置
                    name: 'sysConfig',
                    path: '/dnsLayout/sysConfig',
                    component: sysConfig,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 系统监控
                    name: 'sysMonitor',
                    path: '/dnsLayout/sysMonitor',
                    component: sysMonitor,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 链路配置
                    name: 'linkConfig',
                    path: '/dnsLayout/linkConfig',
                    component: linkConfig,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 链路端口
                    name: 'linkPort',
                    path: '/dnsLayout/linkPort',
                    component: linkPort,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // ip库配置
                    name: 'ipLibrary',
                    path: '/dnsLayout/ipLibrary',
                    component: ipLibrary,
                    meta: {
                        range: 'dnsLayout',
                    }
                },{
                    // 黑名单配置
                    name: 'blacklist',
                    path: '/dnsLayout/blacklist',
                    component: blacklist,
                    meta: {
                        range: 'dnsLayout',
                    }
                }]
            },
            {
                path: '/dhcp',
                component: dhcpLayout,
                redirect: '/dhcpLayout/subnetList',
                meta: {
                    range: 'dhcpLayout'
                },
                children: [
                  {
                   // 子网列表
                   name: 'subnetList',
                   path: '/dhcpLayout/subnetList',
                   component: subnetList,
                   meta: {
                       range: 'dhcpLayout',
                       title: 'Home'
                   }
                },
                {
                    // 地址池配置列表
                    name: 'addressPool',
                    path: '/dhcpLayout/addressPool',
                    component: addressPool,
                    meta: {
                        range: 'dhcpLayout',
                    }
                },
                {
                    // 静态绑定
                    name: 'staticBinding',
                    path: '/dhcpLayout/staticBinding',
                    component: staticBinding,
                    meta: {
                        range: 'dhcpLayout',
                    }
                 }]
            },
            {
                path: '/sys',
                component: sysLayout,
                redirect: '/sysLayout/userList',
                meta: {
                    range: 'sysLayout'
                },
                children: [
                  {
                    // 用户管理
                    name: 'userList',
                    path: '/sysLayout/userList',
                    component: userList,
                    meta: {
                        range: 'sysLayout',
                        title: 'Home'
                    }
                },{
                    // 角色管理
                    name: 'roleMg',
                    path: '/sysLayout/roleMg',
                    component: roleMg,
                    meta: {
                        range: 'sysLayout',
                    }
                },{
                    // 系统日志
                    name: 'sysLog',
                    path: '/sysLayout/sysLog',
                    component: sysLog,
                    meta: {
                        range: 'sysLayout'
                    }
                }]
            },{
                path: '/colony',
                component: colonyLayout,
                redirect: '/colonyLayout/clusterMg',
                meta: {
                    range: 'colonyLayout'
                },
                children: [
                  {
                    // 集群管理
                    name: 'clusterMg',
                    path: '/colonyLayout/clusterMg',
                    component: clusterMg,
                    meta: {
                        range: 'colonyLayout',
                        title: 'Home'
                    }
                },{
                    // 设备管理
                    name: 'deviceMg',
                    path: '/colonyLayout/deviceMg',
                    component: deviceMg,
                    meta: {
                        range: 'colonyLayout',
                    }
                },{
                    // 设备服务管理
                    name: 'serviceMg',
                    path: '/colonyLayout/serviceMg',
                    component: serviceMg,
                    meta: {
                        range: 'colonyLayout'
                    }
                }]
            }]
        },
        {
        // 登陆页
        path: '/login',
        name: 'Login',
        component: Login
    },
    ]
})
