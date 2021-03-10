import axios from 'axios'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import NotFound from '../views/404.vue'

Vue.use(VueRouter)

/** Define routes.
 * @description All routes are open to public!! To restrict to only logged-in users,
 *              add a 'meta' property of: { auth: true }. Use an auth value of 'public' 
 *              to prevent logged-in users from accessing the route.
 * 
 * @see https://router.vuejs.org/guide/advanced/meta.html
 * 
 */
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/signup',
    name: 'Sign Up',
    meta: {
      auth: 'public'    /** Only allow user that are NOT logged-in. */
    },
    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/signin',
    name: 'Sign In',
    meta: {
      auth: 'public'    /** Only allow user that are NOT logged-in. */
    },
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/new',
    name: 'New Posting',
    meta: {
      auth: true        /** Protected route! Only authenticated users may enter. */ 
    },
    component: () => import('../views/NewPosting.vue')
  },
  {
    path: '/postings/:id',
    name: 'View Posting',
    meta: {
      auth: true        /** Protected route! Only authenticated users may enter. */ 
    },
    component: () => import('../views/ViewPosting.vue')
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  // mode: 'history',           /** Don't use history API: https://router.vuejs.org/guide/essentials/history-mode.html#caveat */
  base: process.env.BASE_URL,
  routes
})

/**
 * Actions to take before rendering next route
 * 
 * @see https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
 * 
 */
router.beforeEach(async (to, from, next) => {
  let user;

  // Update currentUser
  try {
    const result = await axios.get('/currentUser');
    user = result.data;

    Vue.prototype.$currentUser = user || null;

  } catch (error) {
    Vue.prototype.$currentUser = null; 
  }

  // Check whether user has access to the route or not
  if(to.matched.some(r => { return r.meta.auth === 'public' }))
  {
    // This is a route that no logged in user should see
    if(user)
      return next('/');
    
    return next();
  }

  // If route is private, only logged in user should be allowed
  if(to.matched.some(r => { return r.meta.auth === true }))
  {
    if(user)
      return next();
    
    return next('/');
  }

  return next();
})

export default router
