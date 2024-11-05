<script setup lang='ts'>
const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member',
  hasExpand: false
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin',
  hasExpand: true
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member',
  hasExpand: false
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin',
  hasExpand: true
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner',
  hasExpand: false
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member',
  hasExpand: true
}]

const expand = ref({
  openedRows: [people.find(v => v.hasExpand)],
  row: {}
})
</script>

<template>
  <UTable v-model:expand="expand" :rows="people">
    <template #expand="{ row }">
      <div class="p-4">
        <pre>{{ row }}</pre>
      </div>
    </template>
    <template #expand-action="{ row, isExpanded, toggle }">
      <UButton v-if="row.hasExpand" @click="toggle">
        {{ isExpanded ? 'collapse' : 'expand' }}
      </UButton>
    </template>
  </UTable>
</template>
