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
  role: 'Admin',
  disabledExpand: true
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
  role: 'Admin',
  disabledExpand: true
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
  role: 'Member',
  disabledExpand: true
}]
const columns = [
  {
    label: 'Name',
    key: 'name'
  },
  {
    label: 'title',
    key: 'title'
  },
  {
    label: 'Email',
    key: 'email'
  },
  {
    label: 'role',
    key: 'role'
  }
]

const expand = ref({
  openedRows: [],
  row: null
})
</script>

<template>
  <UTable v-model:expand="expand" :rows="people" :columns="columns">
    <template #expand="{ row }">
      <div class="p-4">
        <pre>{{ row }}</pre>
      </div>
    </template>
  </UTable>
</template>
