<script setup lang="ts">
const items = Array(5000).fill(0).map((_, i) => ({ label: `item-${i}`, value: i }))

const groups = [{
  id: 'items',
  items
}]
</script>

<template>
  <UCommandPalette virtualize :fuse="{ resultLimit: 5000 }" :groups="groups" class="flex-1 h-80" />
</template>
