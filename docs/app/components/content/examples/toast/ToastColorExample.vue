<script setup lang="ts">
import type { ToastProps } from '@nuxt/ui'

const props = defineProps<{
  color: ToastProps['color']
}>()

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    icon: 'i-lucide-wifi',
    color: props.color
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
