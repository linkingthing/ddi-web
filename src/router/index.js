import Vue from 'vue'
import Router from 'vue-router'
const Cache = require("../util/store").default("localStorage");

import Login from '../views/login'
import Index from '../views/index'
import node from './node';
import dns from './dns';

// 系统管理
const sysLayout = r => require.ensure([], () => r(require('../views/sysLayout')), 'sysLayout')
const userList = r => require.ensure([], () => r(require('../views/userList')), 'sysLayout')
const roleMg = r => require.ensure([], () => r(require('../views/roleMg')), 'sysLayout')
const sysLog = r => require.ensure([], () => r(require('../views/sysLog')), 'sysLayout')

Vue.use(Router)
const router = new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'Index',
        component: Index,
        redirect: '/node',
        meta: {
            range: 'node',
        },
        children: [
            node,
            dns,
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
                    }, {
                        // 角色管理
                        name: 'roleMg',
                        path: '/sysLayout/roleMg',
                        component: roleMg,
                        meta: {
                            range: 'sysLayout',
                        }
                    }, {
                        // 系统日志
                        name: 'sysLog',
                        path: '/sysLayout/sysLog',
                        component: sysLog,
                        meta: {
                            range: 'sysLayout'
                        }
                    }]
            },
        ]
    },
    {
        // 登陆页
        path: '/login',
        name: 'Login',
        component: Login
    },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = Cache.get('token');
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

export default router;