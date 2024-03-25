<script setup lang="ts">
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref(people[0])
</script>

<template>
  <USelectMenu v-model="selected" :options="people" searchable>
    <template #option-empty="{ query }">
      <q>{{ query }}</q> not found
    </template>
  </USelectMenu>
</template>
