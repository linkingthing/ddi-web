import Layout from '@/views/layout';

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 * meta.isSingle：表示这个菜单是单节点
 */

export default {
	path: '/monitor',
	component: Layout,
	meta: {
		range: 'monitor',
		title: '监控分析',
		isFlat: true
	},
	name: 'monitor',
	children: [
		{
			name: 'nodeManage',
			path: '/monitor',
			component: () => import('@/views/node'),
			icon: 'icon-node',
			meta: {
				range: 'monitor',
				title: '概览'
			}
		},
		{
			name: 'DNSDashboard',
			path: '/monitor/dns',
			component: () => import('@/views/node/DNSDashboard'),
			icon: 'icon-dns',
			meta: {
				title: 'DNS统计'
			}
		},
		{
			name: 'DHCPDashboard',
			path: '/monitor/dhcp',
			component: () => import('@/views/node/DHCPDashboard'),
			icon: 'icon-dhcp',
			meta: {
				from: 'monitor',
				title: 'DHCP统计'
			}
		},
		{
			name: 'ControllerDashboard',
			path: '/monitor/controller',
			component: () => import('@/views/node/ControllerDashboard'),
			icon: 'icon-controller',
			meta: {
				range: 'nodeManage',
				title: '监测'
			}
		}
	]
};
