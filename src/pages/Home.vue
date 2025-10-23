<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-6">📝 Todo List</h1>

      <!-- Add Todo -->
      <div class="mb-6 flex gap-2">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Enter todo title..."
          class="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="adding"
          @keyup.enter="addTodo"
        />
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="adding || !newTodo.trim()"
          @click="addTodo"
        >
          {{ adding ? 'Adding...' : 'Add' }}
        </button>
      </div>

      <!-- Search Todos -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search todos..."
          class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Loading / Error / Empty State -->
      <div v-if="loading" class="text-center text-gray-500 py-8">
        Loading todos...
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <div v-else-if="filteredTodos.length === 0" class="text-center text-gray-500 py-8">
        {{ searchQuery ? 'No todos found matching your search' : 'No todos yet. Add one above!' }}
      </div>

      <!-- Todos List -->
      <ul v-else class="space-y-4">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition-shadow"
        >
          <div class="flex-1">
            <h2 class="text-lg font-semibold" :class="{ 'line-through text-gray-400': todo.completed }">
              {{ todo.name || todo.title }}
            </h2>
            <p class="text-sm text-gray-500">
              Status: <span :class="getStatusClass(todo.status)">{{ todo.status }}</span>
            </p>
          </div>
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
            @click="goToTodo(todo.id)"
          >
            View
          </button>
        </li>
      </ul>

      <!-- Pagination -->
      <Pagination
        v-if="!loading && !error && todos.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="loadPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { fetchTodos, createTodo } from "@/utils/api"
import Pagination from "@/components/Pagination.vue"

const newTodo = ref("")
const searchQuery = ref("")
const todos = ref([])
const loading = ref(true)
const error = ref(null)
const adding = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const router = useRouter()

// Add new todo
async function addTodo() {
  if (!newTodo.value.trim()) return
  
  adding.value = true
  try {
    const created = await createTodo({ title: newTodo.value })
    todos.value.unshift(created) // add to top
    newTodo.value = ""
  } catch (err) {
    console.error('Error adding todo:', err)
    alert(err.message || 'Failed to add todo')
  } finally {
    adding.value = false
  }
}

// Load todos from API
async function loadPage(page = 1) {
  loading.value = true
  error.value = null
  try {
    const response = await fetchTodos(page)
    todos.value = response.data
    totalPages.value = response.meta.totalPages
    currentPage.value = page
  } catch (err) {
    console.error('Error loading todos:', err)
    error.value = err.message || 'Failed to load todos'
  } finally {
    loading.value = false
  }
}

// Filter todos based on search query
const filteredTodos = computed(() => {
  if (!searchQuery.value.trim()) return todos.value
  return todos.value.filter(todo =>
    (todo.title || todo.name)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
})

// Get status badge color class
function getStatusClass(status) {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'completed') return 'text-green-600 font-semibold'
  if (statusLower === 'pending') return 'text-yellow-600 font-semibold'
  if (statusLower === 'in progress') return 'text-blue-600 font-semibold'
  return 'text-gray-600'
}

// Navigate to todo details
function goToTodo(id) {
  router.push(`/todos/${id}`)
}

onMounted(() => loadPage())
</script>