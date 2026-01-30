<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Item Deleted',
    description: h('span', {}, [
      'You have successfully deleted the item ',
      h('span', { class: 'text-primary font-bold' }, '#15'),
      ' from your account.'
    ]),
    icon: 'i-lucide-delete'
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
