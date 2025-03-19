<script setup lang="ts">
const toast = useToast()

const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()

function showToast() {
  toast.add({
    title: 'Uh oh! Something went wrong.',
    orientation: props.orientation,
    actions: [{
      icon: 'i-lucide-refresh-cw',
      label: 'Retry',
      color: 'neutral',
      variant: 'outline',
      onClick: (e) => {
        e?.stopPropagation()
      }
    }]
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
