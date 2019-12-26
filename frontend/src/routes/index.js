import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import IndexPage from '@/components/Main'
import BlockPage from '@/components/Block'
import LoginPage from '@/components/Login'
//import ResgisterPage from '@/pages/Register'


export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/block',
      name: 'BlockPage',
      component: BlockPage
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    /*
    {
      path: '/register',
      name: 'ResgisterPage',
      component: ResgisterPage
    }
    */
  ]
})