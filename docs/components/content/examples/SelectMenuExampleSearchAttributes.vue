<script setup>
const options = [
  { id: 1, name: 'Wade Cooper', favoriteColors: ['red', 'yellow'] },
  { id: 2, name: 'Arlene Mccoy', favoriteColors: ['blue', 'yellow'] },
  { id: 3, name: 'Devon Webb', favoriteColors: ['black', 'blue'] },
  { id: 4, name: 'Tom Cook', favoriteColors: ['yellow', 'blue'] },
  { id: 5, name: 'Tanya Fox', favoriteColors: ['green', 'red'] }
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
      <span v-for="color in person.favoriteColors" :key="color.id" class="h-2 w-2 rounded-full mr-2" :class="`bg-${color}-500`" />
      <span class="truncate">{{ person.name }}</span>
    </template>
  </USelectMenu>
</template>
