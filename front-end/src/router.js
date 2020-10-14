import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import Grid from "vue-js-grid";
import Constants from './Constants'
import VueSimpleAlert from "vue-simple-alert";
import Cookies from 'vue-cookie';
import Logout from './views/Logout';

Vue.use(Cookies);
Vue.use(VueSimpleAlert);
Vue.use(Constants);
Vue.use(Grid);
Vue.use(Router)

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'publicstickers',
      component: DashboardLayout,
      children: [
        {
          path: '/publicstickers/:query?',
          name: 'Public Stickers',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/PublicStickers.vue')
        },
        {
          path: '/myfavorite',
          name: 'My Favorite',
          component: () => import(/* webpackChunkName: "demo" */ './views/MyFavorite.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "demo" */ './views/UserProfile.vue')
        },
        {
          path: '/maps',
          name: 'maps',
          component: () => import(/* webpackChunkName: "demo" */ './views/Maps.vue')
        },
        {
          path: '/tables',
          name: 'tables',
          component: () => import(/* webpackChunkName: "demo" */ './views/Tables.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import(/* webpackChunkName: "demo" */ './views/Register.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'logout',
      component: Logout,
      children:[{
        path: '/logout',
        name: 'logout'
      }]
    },
    {
      path: '/main',
      redirect: 'main',
      component: () => import('./components/Main.vue'),
      children: [{
        path: '/main',
        name: 'main'
      }]
      // component: () => import('./components/Redirect.vue'), 
      // children: [{
      //   path: '/static',
      //   name: 'static',
      // }]
    }
  ],
  methods:{

  }
})
