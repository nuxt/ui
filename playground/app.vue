<script setup>
const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'actions',
  },
]

const people = [
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    email: 'jane.cooper@example.com',
    role: 'Admin',
  },
  {
    name: 'Cody Fisher',
    title: 'Product Directives Officer',
    email: 'cody.fisher@example.com',
    role: 'Owner',
  },
]

const responsive = {
  'default': {
    columns: ['name', 'email'],
  },
  'sm': {
    columns: ['name', 'title', 'email'],
  },
  'xl': {
    columns: ['name', 'title', 'email', 'role'],
  },
  '3xl': {
    columns: ['name', 'title', 'email', 'role', 'actions'],
  },
}

const pending = ref(true)
</script>

<template>
  <UContainer class="flex min-h-screen items-center">
    <UCard
      class="flex-1"
      :ui="{
        background: 'bg-gray-50 dark:bg-gray-800/50',
        ring: 'ring-1 ring-gray-300 dark:ring-gray-700',
        divide: 'divide-y divide-gray-300 dark:divide-gray-700',
        header: { base: 'font-bold' },
      }"
    >
      <UTableResponsive :responsive="responsive" :rows="people" :columns="columns" :loading="pending" />
    </UCard>
  </UContainer>
</template>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
