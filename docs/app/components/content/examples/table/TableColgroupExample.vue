<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const data = [
  { id: '101', status: 'Paid', amount: '$42.00' },
  { id: '102', status: 'Pending', amount: '$128.50' },
  { id: '103', status: 'Refunded', amount: '$9.75' }
]

const columns: TableColumn<typeof data[number]>[] = [{
  accessorKey: 'id',
  header: 'Order'
}, {
  header: 'Payment',
  columns: [{
    accessorKey: 'status',
    header: 'Status'
  }, {
    accessorKey: 'amount',
    header: 'Amount'
  }]
}]
</script>

<template>
  <UTable :data="data" :columns="columns" :ui="{ base: 'w-full table-fixed' }">
    <template #colgroup>
      <colgroup>
        <col class="w-24">
      </colgroup>
      <colgroup>
        <col class="w-28">
        <col>
      </colgroup>
    </template>
  </UTable>
</template>
