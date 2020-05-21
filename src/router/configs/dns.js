import Layout from '@/views/layout';

const A4ComposeView = (r) => require.ensure([], () => r(require('@/views/dns/recursion/A4ComposeView')), 'dnsLayout');
const A4Compose = (r) => require.ensure([], () => r(require('@/views/dns/recursion/A4Compose')), 'dnsLayout');

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
	path: '/dns',
	component: Layout,
	icon: 'icon-authority',
	meta: {
		title: '权威服务',
		range: 'dns'
	},
	name: 'dns-service',
	redirect: { name: 'config-group' },
	children: [
		{
			// 配置组管理
			name: 'config-group',
			path: '/dns/dns/views_zones',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/authority/config'),
			meta: {
				title: '区配置'
			}
		},
		{
			// 权威区域查询
			name: 'authority-zone-query',
			path: '/dns/dns/views/:id/zones',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/authority/zoneQuery'),
			meta: {
				title: '区域查询',
				notInMenu: true,
				from: 'config-group'
			}
		},
		{
			// 资源记录
			name: 'resource-record',
			path: '/dns/authority/resourceRecord',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/authority/resourceRecord'),
			meta: {
				title: '资源记录',
				notInMenu: true,
				from: 'authority-zone-query'
			}
		},
		{
			// 重定向
			name: 'redirect-view',
			path: '/dns/authority/redirectView',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/authority/redirectView'),
			meta: {
				title: '重定向'
			}
		},
		{
			// 重定向
			name: 'redirect',
			path: '/dns/authority/redirect',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/authority/redirect'),
			meta: {
				title: '重定向',
				notInMenu: true,
				from: 'redirect-view'
			}
		},

		{
			name: 'a4-compose-view',
			path: '/dns/recursion/A4ComposeView',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/recursion/A4ComposeView'),
			meta: {
				notInMenu: true,
				title: 'DNS64'
			}
		},
		{
			name: 'a4-compose',
			path: '/dns/recursion/view/A4Compose',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/recursion/A4Compose'),
			meta: {
				notInMenu: true,
				from: 'a4-compose-view',
				title: 'A4地址合成'
			}
		}
	]
};
