import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginUser, logoutUser, registerUser, getCurrentUser } from "@/utils/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);
  const loading = ref(false);
  const error = ref(null);

  // Clear user & token
  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // Login
  async function login(email, password) {
    loading.value = true;
    error.value = null;
    try {
      const response = await loginUser(email, password);
      const authToken = response.token;
      const userData = response.user;

      if (!authToken) throw new Error("No token received from server");

      user.value = userData;
      token.value = authToken;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);

      return { success: true, user: userData };
    } catch (err) {
      error.value = err.message || "Login failed";
      console.error("Login error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Register
  async function register(userData) {
    loading.value = true;
    error.value = null;
    try {
      const response = await registerUser(userData);
      return { success: true, message: response.message || "Registered successfully" };
    } catch (err) {
      error.value = err.message || "Registration failed";
      console.error("Registration error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout() {
    try {
      await logoutUser();
      console.log("Server logout successful");
    } catch (err) {
      console.warn("Logout API error (ignored):", err.message);
    } finally {
      clearAuth();
    }
  }

  // Fetch current user on app start
  async function fetchCurrentUser() {
    if (!token.value) return;
    try {
      const response = await getCurrentUser();
      user.value = response.user || null;
    } catch (err) {
      console.warn("Failed to fetch user, clearing auth...");
      clearAuth();
    }
  }

  // Computed auth state
  const isAuthenticated = computed(() => !!token.value);

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearAuth,
    fetchCurrentUser,
    isAuthenticated,
  };
});
