<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type Payment = {
  id: string
  date: string
  email: string
  amount: number
}

const data = ref<Payment[]>([{
  id: '4600',
  date: '2024-03-11T15:30:00',
  email: 'james.anderson@example.com',
  amount: 594
}, {
  id: '4599',
  date: '2024-03-11T10:10:00',
  email: 'mia.white@example.com',
  amount: 276
}, {
  id: '4598',
  date: '2024-03-11T08:50:00',
  email: 'william.brown@example.com',
  amount: 315
}, {
  id: '4597',
  date: '2024-03-10T19:45:00',
  email: 'emma.davis@example.com',
  amount: 529
}, {
  id: '4596',
  date: '2024-03-10T15:55:00',
  email: 'ethan.harris@example.com',
  amount: 639
}])

const columns: TableColumn<Payment>[] = [{
  accessorKey: 'id',
  header: '#',
  size: 100,
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: 'Date',
  size: 160,
  cell: ({ row }) => {
    return new Date(row.getValue('date')).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
}, {
  accessorKey: 'email',
  header: 'Email',
  size: 280
}, {
  accessorKey: 'amount',
  header: 'Amount',
  size: 140,
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(Number.parseFloat(row.getValue('amount')))
  }
}]
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :default-column="{ enableResizing: true, minSize: 80 }"
    :ui="{ base: 'table-fixed', td: 'truncate' }"
    class="flex-1"
  />
</template>
