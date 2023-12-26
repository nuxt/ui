<script setup>
const people = [{
  id: 1,
  name: 'Wade Cooper'
}, {
  id: 2,
  name: 'Arlene Mccoy'
}, {
  id: 3,
  name: 'Devon Webb'
}, {
  id: 4,
  name: 'Tom Cook'
}]

const selected = ref(people[0].name)
</script>

<template>
  <UInputMenu
    v-model="selected"
    :options="people"
    value-attribute="name"
    option-attribute="name"
  />
</template>
