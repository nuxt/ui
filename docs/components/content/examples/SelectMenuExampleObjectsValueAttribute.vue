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

const selected = ref(people[0].id)

const current = computed(() => people.find(person => person.id === selected.value))
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="people"
    placeholder="Select people"
    value-attribute="id"
    option-attribute="name"
  >
    <template #label>
      {{ current.name }}
    </template>
  </USelectMenu>
</template>
