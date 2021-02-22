import axios from 'axios'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

/** Define routes.
 * @description All routes are open to public!! To restrict to only logged-in users,
 *              add a 'meta' property of: { auth: true }. Use an auth value of 'public' 
 *              to prevent logged-in users from accessing the route.
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Actions to take before rendering next route
router.beforeEach(async (to, from, next) => {
  var user;

  // Update currentUser
  try {
    let result = await axios.get('/currentUser');
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
