<template>
  <div class="flex justify-center mt-6 space-x-2">
    <button
      :disabled="currentPage <= 1"
      @click="$emit('change-page', currentPage - 1)"
      class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
    >
      Prev
    </button>
    <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
    <button
      :disabled="currentPage >= totalPages"
      @click="$emit('change-page', currentPage + 1)"
      class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
    >
      Next
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  }
})

defineEmits(['change-page'])
</script>