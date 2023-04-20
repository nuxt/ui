<script setup>
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref([])
</script>

<template>
  <USelectMenu v-model="selected" :options="people" multiple>
    <template #label>
      <span v-if="selected.length" class="font-medium truncate">{{ selected.join(', ') }}</span>
      <span v-else class="block truncate text-gray-400 dark:text-gray-500">Select people</span>
    </template>
  </USelectMenu>
</template>
