<script setup lang="ts">
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref(people[0])
const selected2 = ref([people[0]])
</script>

<template>
  single: <USelectMenu v-model="selected" :options="people" clearable />
  multiple: <USelectMenu v-model="selected2" :options="people" clearable multiple />
</template>
