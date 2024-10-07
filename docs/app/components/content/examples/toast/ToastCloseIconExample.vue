<script setup lang="ts">
const props = defineProps<{
  closeIcon: string
}>()

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    closeIcon: props.closeIcon
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
