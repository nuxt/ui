<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable.mjs'

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
}])

const columns: TableColumn<Payment>[] = [{
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: 'Date',
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
  header: 'Email'
}, {
  accessorKey: 'amount',
  header: () => h('div', { class: 'text-right' }, 'Amount'),
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
    return h('div', { class: 'text-right font-medium' }, formatted)
  }
}]

useSortable('.my-table-tbody', data, {
  animation: 150
})
</script>

<template>
  <div class="w-full">
    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      :ui="{
        tbody: 'my-table-tbody'
      }"
    />
  </div>
</template>
