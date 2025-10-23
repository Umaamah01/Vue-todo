<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div v-if="loading" class="text-gray-500 text-center text-lg">
      Loading todo details...
    </div>
    <div v-else-if="error" class="text-red-500 text-center text-lg">
      {{ error }}
    </div>

    <div v-else-if="todo" class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-3" :class="{ 'line-through text-gray-400': todo.completed }">
        {{ todo.name || todo.title }}
      </h1>
      
      <div class="space-y-2 mb-4">
        <p class="text-gray-600">
          <span class="font-semibold">Status:</span> 
          <span :class="getStatusClass(todo.status)">{{ todo.status }}</span>
        </p>
        <p class="text-gray-600">
          <span class="font-semibold">Priority:</span> 
          <span :class="getPriorityClass(todo.priority)">{{ todo.priority }}</span>
        </p>
        <p class="text-gray-600">
          <span class="font-semibold">Completed:</span> 
          {{ todo.completed ? '✅ Yes' : '❌ No' }}
        </p>
        <p class="text-gray-600">
          <span class="font-semibold">Description:</span> 
          {{ todo.description || 'No description available' }}
        </p>
      </div>

      <!-- Todo actions component with event handlers -->
      <TodoActions 
        :todo="todo" 
        @update="handleUpdate"
        @delete="handleDelete"
      />

      <button 
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4 transition-colors w-full" 
        @click="goBack"
      >
        ← Back to Todos
      </button>
    </div>

    <!-- Fallback for no todo found -->
    <div v-else class="text-gray-500 text-center text-lg">
      Todo not found
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { fetchTodoById } from "@/utils/api"
import TodoActions from "@/components/TodoActions.vue"

const route = useRoute()
const router = useRouter()
const todo = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      throw new Error('Invalid todo ID')
    }
    todo.value = await fetchTodoById(id)
  } catch (err) {
    console.error('Error fetching todo:', err)
    error.value = err.message || 'Failed to load todo details'
  } finally {
    loading.value = false
  }
})

// Handle todo update from TodoActions
function handleUpdate(updatedTodo) {
  todo.value = { ...todo.value, ...updatedTodo }
}

// Handle todo deletion from TodoActions
function handleDelete() {
  // TodoActions already navigates to home, but we can add cleanup here if needed
  router.push("/")
}

function goBack() {
  router.push("/")
}

// Get status color class
function getStatusClass(status) {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'completed') return 'text-green-600 font-semibold'
  if (statusLower === 'pending') return 'text-yellow-600 font-semibold'
  if (statusLower === 'in progress') return 'text-blue-600 font-semibold'
  return 'text-gray-600'
}

// Get priority color class
function getPriorityClass(priority) {
  const priorityLower = priority?.toLowerCase()
  if (priorityLower === 'high') return 'text-red-600 font-semibold'
  if (priorityLower === 'medium') return 'text-orange-600 font-semibold'
  if (priorityLower === 'low') return 'text-green-600 font-semibold'
  return 'text-gray-600'
}
</script>