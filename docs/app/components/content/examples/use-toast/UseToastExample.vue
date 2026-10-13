<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    title: 'New message',
    description: 'You have a new message from Benjamin.',
    actions: [{
      icon: 'i-lucide-reply',
      label: 'Reply',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        toast.add({ title: 'Reply sent', color: 'success' })
      }
    }]
  })
}
</script>

<template>
  <UButton label="Show toast" @click="showToast" />
</template>
