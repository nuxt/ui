<script setup lang="ts">
const searchTerm = ref('D')
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const selected = ref('Backlog')
</script>

<template>
  <UInputMenu v-model="selected" v-model:search-term="searchTerm" :items="items" />
</template>
