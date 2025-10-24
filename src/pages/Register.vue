<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form @submit.prevent="handleRegister" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <!-- Name -->
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Enter your name"
          required
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="loading"
        />
      </div>

      <!-- Email -->
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

      <!-- Password -->
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

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || !email || !password || !name"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-4 text-center text-sm">
        {{ error }}
      </p>

      <!-- Optional helper -->
      <div class="mt-4 text-center text-sm text-gray-600">
        <p>
          Already have an account?
          <RouterLink to="/login" class="text-green-600 hover:underline">
            Login
          </RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { registerUser } from '@/utils/api'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function handleRegister() {
  error.value = null
  loading.value = true

  try {
    // ✅ Send correct object shape
    const res = await registerUser({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    console.log('Register success:', res)

    // ✅ Automatically log in after registration
    await auth.login(email.value, password.value)

    // ✅ Redirect to homepage or login
    router.push('/login')
  } catch (err) {
    console.error('Register error:', err)
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>