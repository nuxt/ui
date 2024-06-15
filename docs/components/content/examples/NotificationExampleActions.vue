<script setup lang="ts">
const toast = useToast()

const actions = ref([{
  label: 'Action 1',
  click: () => alert('Action 1 clicked!')
}, {
  label: 'Action 2',
  click: () => alert('Action 2 clicked!')
}])
</script>

<template>
  <UButton label="Show toast" @click="toast.add({ title: 'With actions', actions })" />
</template>
