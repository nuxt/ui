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
      <div class="flex items-center justify-center">
          <span class="py-10">No Data.</span>
      </div>
    </template>
  </UTable>
</template>
