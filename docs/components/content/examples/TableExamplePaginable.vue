<script setup>
const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}]

const page = ref(1)
const pageCount = 2

const peoplePage = computed(() => {
  return people.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
</script>

<template>
  <div class="flex flex-col gap-y-2 pb-2">
    <UTable :rows="peoplePage" />
    <UPagination v-model="page" :page-count="pageCount" :total="people.length" class="place-self-center" />
  </div>
</template>
