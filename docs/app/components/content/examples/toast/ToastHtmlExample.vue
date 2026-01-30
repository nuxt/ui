<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    title: h('span', {}, [
      'Item ',
      h('span', { class: 'text-primary font-bold' }, '#15'),
      ' deleted'
    ]),
    description: h('span', {}, [
      'You have successfully deleted the item from your ',
      h('span', { class: 'font-bold' }, 'account'),
      '.'
    ]),
    icon: 'i-lucide-trash-2'
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
