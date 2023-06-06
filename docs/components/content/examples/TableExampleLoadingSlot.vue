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

const isLoading = ref(true);
</script>

<template>
  <UTable :rows="people" :columns="columns" :is-loading="isLoading">
    <template #loading-state>
      <div class="flex items-center justify-center">
        <span class="py-10">Loading...</span>
      </div>
    </template>
  </UTable>
</template>
