<template>
  <div id="app">
    <!-- Show navbar only on authenticated pages -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- Main content -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

// Hide navbar on login and register pages
const isAuthPage = computed(() => {
  return route.name === 'Login' || route.name === 'Register'
})
</script>

<style>
/* Add any global styles here */
#app {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>