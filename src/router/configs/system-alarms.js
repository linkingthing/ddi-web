import Layout from '@/views/layout';

export default {
	path: '/system/alarm',
	component: Layout,
	meta: {
		range: 'system',
		title: '告警管理'
  },
	name: 'system-alarms',
	children: [
		{
			name: 'alarm-config',
			path: '/system/alarm/thresholds',
			component: () => import('@/views/system/alarm/alarm-config'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警配置'
			}
		},
		{
			name: 'alarm-notice',
			path: '/system/alarms-notice',
			component: () => import('@/views/system/alarm/alarm-notice'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警信息'
			}
		},
		{
			name: 'alarm-info',
			path: '/system/alarms-info',
			component: () => import('@/views/system/alarm/alarm-info'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '告警通知'
			}
		}
	]
};
