import Layout from '@/views/layout';

/**
 * meta.notInMenu：表示不在菜单中显示
 * meta.isRootMen：表示是根节点
 */

export default {
	path: '',
	component: Layout,
	icon: 'icon-recursive',
	name: 'dhcp-dhcp',
	meta: {
		title: 'DHCP服务',
		range: 'address'
	},
	children: [
		{
			name: 'subnet-pool-subnet',
			path: '/address/dhcp/subnets',
			component: () => import(/* webpackChuckName: "subnet-pool-subnet" */ '@/views/dhcp-service/address-pool/subnet-list'),
			meta: {
				title: '地址池管理'
			}
		},
		{
			name: 'dhcp-pools',
			path: '/address/dhcp/pools',
			redirect: 'address-pool-list',
			component: () => import('@/views/dhcp-service/address-pool/pools-layout'),
			meta: {
        		notInMenu: true,
			},
			children: [
				{
					name: 'address-pool-list',
					path: '/address/dhcp/subnets/:id/pools',
					component: () => import(/* webpackChuckName: "address-pool-list" */ '@/views/dhcp-service/address-pool/pool-list'),
					meta: {
						notInMenu: true,
						from: 'subnet-pool-subnet',
						title: ':address'
					}
				},
				{
					name: 'address-pdpool-list',
					path: '/address/dhcp/subnets/:id/pdpools',
<<<<<<< HEAD
					component: () =>
						import(/* webpackChuckName: "address-pdpool-list" */ '@/views/dhcp-service/address-pool/pdpool-list'),
=======
					component: () => import(/* webpackChuckName: "address-pool-list" */ '@/views/dhcp-service/address-pool/pdpool-list'),
>>>>>>> ffaf0e0855cc073f773956d300b51a83f0b1945e
					meta: {
						notInMenu: true,
						from: 'subnet-pool-subnet',
						title: ':address'
					}
				},
				{
					name: 'address-reservations-list',
					path: '/address/dhcp/subnets/:id/reservations',
					component: () =>
						import(/* webpackChuckName: "address-reservations-list" */ '@/views/dhcp-service/address-pool/reservations-list'),
					meta: {
						notInMenu: true,
						from: 'subnet-pool-subnet',
						title: ':address'
					}
				}
			]
		},
		{
			name: 'dhcp-config',
			path: '/address/dhcp/config',
			redirect: '/address/dhcp/dhcpconfigs',
			meta: {
				title: '基础配置'
			},
			component: () => import('@/views/dhcp-service/option-config/layout'),
			children: [
				{
					name: 'option-dhcpconfigs',
					path: '/address/dhcp/dhcpconfigs',
					component: () => import(/* webpackChuckName: "option-config" */ '@/views/dhcp-service/option-config/dhcp-configs'),
					meta: {
						notInMenu: true,
						title: '基础配置'
					}
				},
				{
					name: 'option-clientclasses',
					path: '/address/dhcp/clientclasses',
					component: () => import(/* webpackChuckName: "option-config" */ '@/views/dhcp-service/option-config/client-classes'),
					meta: {
						notInMenu: true,
						title: '基础配置'
					}
				}
			]
		}
	]
};
