<script setup lang="ts">
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref()
const query = ref('Wade')
</script>

<template>
  <USelectMenu
    v-model="selected"
    v-model:query="query"
    :options="people"
    placeholder="Select a person"
    searchable
  />
</template>
