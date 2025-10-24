import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import TodoDetails from '@/pages/TodoDetails.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue' // ✅ added
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
  { 
    path: '/register',      // ✅ New route for registration
    name: 'Register',
    component: Register,
    meta: { guest: true }
  },
  { 
    path: '/dashboard', 
    redirect: '/'           // optional redirect
  },
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

// ✅ Navigation Guard (for authentication)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = auth.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
