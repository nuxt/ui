<script setup lang="ts">
const users = [
  { id: 1, label: 'Durward Reynolds' },
  { id: 2, label: 'Kenton Towne' },
  { id: 3, label: 'Therese Wunsch' },
  { id: 4, label: 'Benedict Kessler' },
  { id: 5, label: 'Katelyn Rohan' }
]

const searchTerm = ref('Th')
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="[{ id: 'users', items: users }]"
    class="flex-1"
  />
</template>
