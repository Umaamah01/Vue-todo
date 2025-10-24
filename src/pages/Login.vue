<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
          autofocus
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="loading"
        />
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
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

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || !email.trim() || !password"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-4 text-center text-sm">{{ error }}</p>

      <!-- Helper -->
      <div class="mt-4 text-center text-sm text-gray-600">
        <p>
          Don’t have an account?
          <RouterLink to="/register" class="text-green-600 hover:underline">Register</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function handleLogin() {
  error.value = null
  loading.value = true

  try {
    // Trim email before sending
    await auth.login(email.value.trim(), password.value)

    // Redirect to home after login
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
