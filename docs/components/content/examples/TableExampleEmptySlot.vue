<script setup>
const columns = [{
  key: 'name',
  label: 'Name'
}, {
  key: 'title',
  label: 'Title'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'role',
  label: 'Role'
}, {
  key: 'actions'
}]

const people = []
</script>

<template>
  <UTable :rows="people" :columns="columns">
    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-5">
          <span>No people</span>
          <UButton color="primary" label="Add People" size="sm" class="rounded-full mt-2"/>
      </div>
    </template>
  </UTable>
</template>
