import Layout from '@/views/layout';

export default {
	path: '/system/alarms',
	component: Layout,
	meta: {
		range: 'system',
		title: '告警管理'
	},
	name: 'system-alarms',
	children: [
		{
			name: 'alarm-config',
			path: '/system/alarms/alarms',
			component: () => import('@/views/system/alarm/alarm-config'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警配置'
			}
		},
		{
			name: 'alarm-info',
			path: '/system/alarms-fin',
			component: () => import('@/views/system/alarm/alarm-info'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警信息'
			}
		},
		{
			name: 'alarm-config',
			path: '/system/alarms-info',
			component: () => import('@/views/system/alarm/alarm-config'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警通知'
			}
		}
	]
};