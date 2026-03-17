<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    id: 'copy',
    title: 'Copied to clipboard',
    icon: 'i-lucide-circle-check',
    duration: 0
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
