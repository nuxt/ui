<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

type Payment = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const data = ref<Payment[]>([{
  id: '4600',
  date: '2024-03-11T15:30:00',
  status: 'paid',
  email: 'james.anderson@example.com',
  amount: 594
}, {
  id: '4599',
  date: '2024-03-11T10:10:00',
  status: 'failed',
  email: 'mia.white@example.com',
  amount: 276
}, {
  id: '4598',
  date: '2024-03-11T08:50:00',
  status: 'refunded',
  email: 'william.brown@example.com',
  amount: 315
}, {
  id: '4597',
  date: '2024-03-10T19:45:00',
  status: 'paid',
  email: 'emma.davis@example.com',
  amount: 529
}, {
  id: '4596',
  date: '2024-03-10T15:55:00',
  status: 'paid',
  email: 'ethan.harris@example.com',
  amount: 639
}])

const columns: TableColumn<Payment>[] = [{
  id: 'expand',
  cell: ({ row }) => h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    icon: 'i-lucide-chevron-down',
    square: true,
    ui: {
      leadingIcon: ['transition-transform', row.getIsExpanded() ? 'duration-200 rotate-180' : '']
    },
    onClick: () => row.toggleExpanded()
  })
}, {
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
  accessorKey: 'status',
  header: 'Status',
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

const expanded = ref({ 1: true })
</script>

<template>
  <UTable
    v-model:expanded="expanded"
    :data="data"
    :columns="columns"
    :ui="{ tr: 'data-[expanded=true]:bg-[var(--ui-bg-elevated)]/50' }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <pre>{{ row.original }}</pre>
    </template>
  </UTable>
</template>
