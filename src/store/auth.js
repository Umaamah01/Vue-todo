import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Initialize user from localStorage on store creation
  const user = ref(null)
  const token = ref(null)

  // Initialize from localStorage
  function initializeAuth() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (err) {
        console.error('Error parsing stored auth data:', err)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }

  // Call initialization immediately
  initializeAuth()

  // Login function
  function login(userData) {
    user.value = userData
    
    // In a real app, you'd get this token from your API response
    const authToken = 'demo-token-' + Date.now()
    token.value = authToken

    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  // Logout function
  function logout() {
    user.value = null
    token.value = null

    // Clear from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Computed property for authentication status
  const isAuthenticated = computed(() => {
    return !!user.value && !!token.value
  })

  // Get auth header for API calls
  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return { 
    user, 
    token,
    login, 
    logout, 
    isAuthenticated,
    getAuthHeader
  }
})