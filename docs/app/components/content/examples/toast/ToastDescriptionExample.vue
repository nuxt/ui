<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
}>()

const toast = useToast()

function showToast() {
  toast.add(props)
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
