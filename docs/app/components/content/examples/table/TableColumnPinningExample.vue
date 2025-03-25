<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

type Payment = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const data = ref<Payment[]>([{
  id: '46000000000000000000000000000000000000000',
  date: '2024-03-11T15:30:00',
  status: 'paid',
  email: 'james.anderson@example.com',
  amount: 594000
}, {
  id: '45990000000000000000000000000000000000000',
  date: '2024-03-11T10:10:00',
  status: 'failed',
  email: 'mia.white@example.com',
  amount: 276000
}, {
  id: '45980000000000000000000000000000000000000',
  date: '2024-03-11T08:50:00',
  status: 'refunded',
  email: 'william.brown@example.com',
  amount: 315000
}, {
  id: '45970000000000000000000000000000000000000',
  date: '2024-03-10T19:45:00',
  status: 'paid',
  email: 'emma.davis@example.com',
  amount: 5290000
}, {
  id: '45960000000000000000000000000000000000000',
  date: '2024-03-10T15:55:00',
  status: 'paid',
  email: 'ethan.harris@example.com',
  amount: 639000
}])

const columns: TableColumn<Payment>[] = [{
  accessorKey: 'id',
  header: ({ column }) => getHeader(column, 'ID', 'left'),
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: ({ column }) => getHeader(column, 'Date', 'left')
}, {
  accessorKey: 'status',
  header: ({ column }) => getHeader(column, 'Status', 'left'),
  cell: ({ row }) => {
    const color = ({
      paid: 'success' as const,
      failed: 'error' as const,
      refunded: 'neutral' as const
    })[row.getValue('status') as string]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
  }
}, {
  accessorKey: 'email',
  header: ({ column }) => getHeader(column, 'Email', 'left')
}, {
  accessorKey: 'amount',
  header: ({ column }) => h('div', { class: 'text-right' }, getHeader(column, 'Amount', 'right')),
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)

    return h('div', { class: 'text-right font-medium' }, formatted)
  }
}]

function getHeader(column: Column<Payment>, label: string, position: 'left' | 'right') {
  const isPinned = column.getIsPinned()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isPinned ? 'i-lucide-pin-off' : 'i-lucide-pin',
    class: '-mx-2.5',
    onClick() {
      column.pin(isPinned === position ? false : position)
    }
  })
}

const columnPinning = ref({
  left: [],
  right: ['amount']
})
</script>

<template>
  <UTable
    v-model:column-pinning="columnPinning"
    :data="data"
    :columns="columns"
    class="flex-1"
  />
</template>
