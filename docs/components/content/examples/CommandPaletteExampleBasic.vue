<script setup lang="ts">
const people = [
  { id: 1, label: 'Wade Cooper' },
  { id: 2, label: 'Arlene Mccoy' },
  { id: 3, label: 'Devon Webb' },
  { id: 4, label: 'Tom Cook' },
  { id: 5, label: 'Tanya Fox' },
  { id: 6, label: 'Hellen Schmidt' },
  { id: 7, label: 'Caroline Schultz' },
  { id: 8, label: 'Mason Heaney' },
  { id: 9, label: 'Claudie Smitham' },
  { id: 10, label: 'Emil Schaefer' }
]

const selected = ref([people[3]])
</script>

<template>
  <UCommandPalette
    v-model="selected"
    multiple
    nullable
    :autoselect="false"
    :groups="[{ key: 'people', commands: people }]"
    :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
  />
</template>
