<script setup lang="ts">
const people = [
  { name: 'Wade Cooper', online: true },
  { name: 'Arlene Mccoy', online: false },
  { name: 'Devon Webb', online: false },
  { name: 'Tom Cook', online: true },
  { name: 'Tanya Fox', online: false },
  { name: 'Hellen Schmidt', online: true },
  { name: 'Caroline Schultz', online: true },
  { name: 'Mason Heaney', online: false },
  { name: 'Claudie Smitham', online: true },
  { name: 'Emil Schaefer', online: false }
]

const selected = ref(people[3])
</script>

<template>
  <USelectMenu v-model="selected" :options="people" option-attribute="name">
    <template #label>
      <span :class="[selected.online ? 'bg-green-400' : 'bg-gray-200', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true" />
      <span class="truncate">{{ selected.name }}</span>
    </template>

    <template #option="{ option: person }">
      <span :class="[person.online ? 'bg-green-400' : 'bg-gray-200', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true" />
      <span class="truncate">{{ person.name }}</span>
    </template>
  </USelectMenu>
</template>
