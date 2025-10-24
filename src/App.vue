<template>
  <div id="app">
    <!-- Show navbar only on authenticated pages -->
    <NavBar v-if="!isAuthPage" />
    
    <!-- Main content -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue' // Make sure the file is NavBar.vue

const route = useRoute()

// Hide navbar on login and register pages
const isAuthPage = computed(() => {
  return route.name === 'Login' || route.name === 'Register'
})
</script>

<style>
/* Global styles */
#app {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
