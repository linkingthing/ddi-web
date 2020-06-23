import Layout from '@/views/layout';

export default {
	path: '/system',
	component: Layout,
	meta: {
		range: 'system',
		title: '日志信息'
	},
	name: 'system-log',
	redirect: { name: 'operate-logs' },
	children: [
		{
			name: 'operate-logs',
			path: '/system/log/logs',
			component: () => import(/* webpackChuckName: "operate-logs" */ '@/views/system/log/operate-logs'),
			icon: 'icon-node',
			meta: {
				range: 'system',
				title: '操作日志'
			}
		}
	]
};