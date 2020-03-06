import Vue from 'vue'
import Router from 'vue-router'
const Cache = require("../util/store").default("localStorage");

import Login from '../views/login'
import Layout from '../views/Layout'
import node from './node';
import dns from './dns';
import address from './address';

Vue.use(Router)
const router = new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'Index',
        component: Layout,
        redirect: '/node',
        meta: {
            range: 'node',
        },
        children: [
            ...node,
            ...dns,
            ...address,
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