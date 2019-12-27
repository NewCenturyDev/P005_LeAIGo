import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Model from '@/components/Model'
import Demo from '@/components/Demo'
import Status from '@/components/Status'
//import Search from '@/components/Search'
//import Create from '@/components/Create'

Vue.use(Router)
export const router = new Router({
    mode: 'history',
    routes: [
        {path: '/', name: 'main', component: Main},
        {path: '/auth', name: 'login', component: Login},
        {path: '/auth/register', name: 'register', component: Register},
        {path: '/model', name:'model', component: Model},
        {path: '/demo', name:'demo', component: Demo},
        {path: '/status', name:'status', component: Status}
    ]
})