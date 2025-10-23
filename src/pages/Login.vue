<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="loading"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="loading"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || !email || !password"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="text-red-500 mt-4 text-center text-sm">
        {{ error }}
      </p>

      <!-- Optional: Add forgot password / sign up links -->
      <div class="mt-4 text-center text-sm text-gray-600">
        <p>Demo credentials: admin@example.com / password</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

// Handle login
async function handleLogin() {
  // Clear previous error
  error.value = null
  loading.value = true

  try {
    // Simulate API delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (email.value === 'admin@example.com' && password.value === 'password') {
      await auth.login({ email: email.value })
      
      // Get redirect path from query params or default to home
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>