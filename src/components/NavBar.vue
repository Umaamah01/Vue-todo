<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo / Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors"
          >
            📝 Todo App
          </router-link>
        </div>

        <!-- User Menu (only show when authenticated) -->
        <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
          <!-- User Info -->
          <div class="hidden sm:block">
            <span class="text-sm text-gray-600">
              Welcome,
              <span class="font-semibold">{{ auth.user?.name || auth.user?.email }}</span>
            </span>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            :disabled="loggingOut"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>

        <!-- Login Button (only show when not authenticated) -->
        <div v-else>
          <router-link
            to="/login"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            Login
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const router = useRouter()
const loggingOut = ref(false)

async function handleLogout() {
  if (loggingOut.value) return

  loggingOut.value = true

  try {
    // Attempt server logout
    await auth.logout()
    console.log("Server logout successful")
  } catch (err) {
    console.error("Logout API error:", err)
  } finally {
    // Always clear auth (handles $reset problem)
    auth.clearAuth()
    console.log("Local auth cleared")

    loggingOut.value = false
    router.push('/login')
  }
}
</script>
