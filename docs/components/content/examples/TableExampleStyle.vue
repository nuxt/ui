<script setup>
const columns = [{
  key: 'id',
  label: '#'
}, {
  key: 'quantity',
  label: 'quantity'
}, {
  key: 'name',
  label: 'Name'
}]

const items = [{
  id: 1,
  name: 'Apple',
  quantity: { value: 100, class: 'bg-green-200' }
}, {
  id: 2,
  name: 'Orange',
  quantity: { value: 0 },
  class: 'bg-red-200 animate-pulse'
}, {
  id: 3,
  name: 'Banana',
  quantity: { value: 30, class: 'bg-green-200' }
}, {
  id: 4,
  name: 'Mango',
  quantity: { value: 5, class: 'bg-green-200' }
}]
</script>

<template>
  <UTable :rows="items" :columns="columns">
    <template #quantity-data="{ row }">
      {{ row.quantity.value }}
    </template>
  </UTable>
</template>
