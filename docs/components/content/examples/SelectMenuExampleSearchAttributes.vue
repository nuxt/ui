<script setup lang="ts">
const options = [
  { id: 1, name: 'Wade Cooper', colors: ['red', 'yellow'] },
  { id: 2, name: 'Arlene Mccoy', colors: ['blue', 'yellow'] },
  { id: 3, name: 'Devon Webb', colors: ['green', 'blue'] },
  { id: 4, name: 'Tom Cook', colors: ['blue', 'red'] },
  { id: 5, name: 'Tanya Fox', colors: ['green', 'red'] },
  { id: 5, name: 'Hellen Schmidt', colors: ['green', 'yellow'] }
]

const selected = ref(options[1])
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="options"
    placeholder="Select a person"
    searchable
    searchable-placeholder="Search by name or color"
    option-attribute="name"
    by="id"
    :search-attributes="['name', 'colors']"
  >
    <template #option="{ option: person }">
      <span v-for="color in person.colors" :key="color.id" class="h-2 w-2 rounded-full" :class="`bg-${color}-500 dark:bg-${color}-400`" />
      <span class="truncate">{{ person.name }}</span>
    </template>
  </USelectMenu>
</template>
