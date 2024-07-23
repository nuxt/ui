<script setup lang="ts">
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
}, {
  id: 7,
  name: 'Emily Selman',
  title: 'VP, User Experience',
  email: '',
  role: 'Admin'
}, {
  id: 8,
  name: 'Kristin Watson',
  title: 'VP, Human Resources',
  email: '',
  role: 'Member'
}, {
  id: 9,
  name: 'Emma Watson',
  title: 'Front-end Developer',
  email: '',
  role: 'Member'
}, {
  id: 10,
  name: 'John Doe',
  title: 'Designer',
  email: '',
  role: 'Admin'
}, {
  id: 11,
  name: 'Jane Doe',
  title: 'Director of Product',
  email: '',
  role: 'Member'
}, {
  id: 12,
  name: 'John Smith',
  title: 'Copywriter',
  email: '',
  role: 'Admin'
}, {
  id: 13,
  name: 'Jane Smith',
  title: 'Senior Designer',
  email: '',
  role: 'Owner'
}]

const page = ref(1)
const pageCount = 5

const rows = computed(() => {
  return people.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
</script>

<template>
  <div>
    <UTable :rows="rows" />

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="people.length" />
    </div>
  </div>
</template>
