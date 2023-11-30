<script setup>
const options = [
  { id: 1, name: 'Wade Cooper', favoriteColors: ['red', 'yellow'] },
  { id: 2, name: 'Arlene Mccoy', favoriteColors: ['blue', 'yellow'] },
  { id: 3, name: 'Devon Webb', favoriteColors: ['green', 'blue'] },
  { id: 4, name: 'Tom Cook', favoriteColors: ['blue', 'red'] },
  { id: 5, name: 'Tanya Fox', favoriteColors: ['green', 'red'] },
  { id: 5, name: 'Hellen Schmidt', favoriteColors: ['green', 'yellow'] }
]

const selected = ref(options[1])
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="options"
    class="w-full lg:w-96"
    placeholder="Select an user"
    searchable
    searchable-placeholder="Search by name or favorite colors"
    option-attribute="name"
    by="id"
    :search-attributes="['name', 'favoriteColors']"
  >
    <template #option="{ option: person }">
      <span v-for="color in person.favoriteColors" :key="color.id" class="h-2 w-2 rounded-full" :class="`bg-${color}-500 dark:bg-${color}-400`" />
      <span class="truncate">{{ person.name }}</span>
    </template>
  </USelectMenu>
</template>
