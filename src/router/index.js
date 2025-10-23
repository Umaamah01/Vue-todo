import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import TodoDetails from '@/pages/TodoDetails.vue'
import Login from '@/pages/Login.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // Protect home page
  },
  { 
    path: '/todos/:id', 
    name: 'TodoDetails',
    component: TodoDetails,
    meta: { requiresAuth: true } // Protect todo details
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Login,
    meta: { guest: true } // Redirect to home if already logged in
  },
  // Redirect /dashboard to home (since they're the same)
  { 
    path: '/dashboard', 
    redirect: '/'
  },
  // 404 catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = auth.isAuthenticated

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login with the original destination
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath }
    })
  } 
  // Check if route is for guests only (like login page)
  else if (to.meta.guest && isAuthenticated) {
    // Redirect authenticated users away from login
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router