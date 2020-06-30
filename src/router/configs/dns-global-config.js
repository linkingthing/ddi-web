import Layout from '@/views/layout';

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点（暂未使用）
 * meta.hideTitle: 表示是否将标题在面包屑上展示
 */

export default {
	path: '/dns/dns/config',
	component: Layout,
	meta: {
		title: '全局配置',
		range: 'dns',
		isFlat: true
	},
	children: [
		{
			icon: 'icon-global-config',
			name: 'global-config',
      meta: {
        title: '全局配置',
        range: 'dns',
      },
			path: '/dns/dns/config',
			component: () => import(/* webpackChuckName: "option-config" */ '@/views/dns/global-config')
		}
	]
};
