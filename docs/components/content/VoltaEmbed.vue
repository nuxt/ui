<template>
  <iframe :src="src" class="w-full min-h-[calc(100vh/1.5)] border border-gray-200 dark:border-gray-800 rounded-md" />
</template>

<script setup lang="ts">
const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

const src = computed(() => `https://volta.net/embed/${props.token}`)
</script>
