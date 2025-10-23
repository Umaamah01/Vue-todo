<template>
  <div class="flex space-x-2 mt-4">
    <!-- Complete / Undo button -->
    <button
      class="px-3 py-1 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :class="todo.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'"
      :disabled="loading"
      @click="toggleComplete"
    >
      {{ loading ? 'Loading...' : (todo.completed ? 'Undo' : 'Complete') }}
    </button>

    <!-- Delete button -->
    <button
      class="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
      @click="deleteTodoItem"
    >
      {{ loading ? 'Deleting...' : 'Delete' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { updateTodo, deleteTodo } from "@/utils/api"
import { useRouter } from "vue-router"

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const router = useRouter()
const loading = ref(false)

async function toggleComplete() {
  loading.value = true
  try {
    const updated = await updateTodo(props.todo.id, {
      completed: !props.todo.completed,
    })
    // Emit event instead of mutating prop directly
    emit('update', updated)
  } catch (err) {
    console.error('Error updating todo:', err)
    alert(err.message || 'Failed to update todo')
  } finally {
    loading.value = false
  }
}

async function deleteTodoItem() {
  if (!confirm("Are you sure you want to delete this todo?")) return
  loading.value = true
  try {
    await deleteTodo(props.todo.id)
    // Emit delete event
    emit('delete', props.todo.id)
    router.push("/")
  } catch (err) {
    console.error('Error deleting todo:', err)
    alert(err.message || 'Failed to delete todo')
  } finally {
    loading.value = false
  }
}
</script>