<script setup lang="ts">
const toast = useToast()

const props = defineProps<{
  description: string
}>()

function showToast() {
  toast.add({
    title: 'Uh oh! Something went wrong.',
    description: props.description,
    actions: [{
      icon: 'i-heroicons-arrow-path-20-solid',
      label: 'Retry',
      color: 'gray',
      variant: 'outline',
      onClick: (e) => {
        e?.stopPropagation()
      }
    }]
  })
}
</script>

<template>
  <UButton label="Show toast" color="gray" variant="outline" @click="showToast" />
</template>
