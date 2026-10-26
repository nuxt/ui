<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { columnOrderingFeature } from '@tanstack/vue-table'
import type { TableColumn, TableFeatures } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')

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
  accessorKey: 'id',
  header: ({ column }) => getHeader(column, '#'),
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'status',
  header: ({ column }) => getHeader(column, 'Status')
}, {
  accessorKey: 'email',
  header: ({ column }) => getHeader(column, 'Email')
}, {
  accessorKey: 'amount',
  header: ({ column }) => getHeader(column, 'Amount'),
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(Number.parseFloat(row.getValue('amount')))
  }
}]

const features = { columnOrderingFeature }

const columnOrder = ref(['id', 'status', 'email', 'amount'])

function moveColumn(id: string, offset: number) {
  const order = [...columnOrder.value]
  const index = order.indexOf(id)
  order.splice(index, 1)
  order.splice(index + offset, 0, id)
  columnOrder.value = order
}

function getHeader(column: Column<TableFeatures, Payment>, label: string) {
  const index = columnOrder.value.indexOf(column.id)

  return h('div', { class: 'flex items-center gap-1' }, [
    h(UButton, {
      'icon': 'i-lucide-chevron-left',
      'color': 'neutral',
      'variant': 'ghost',
      'size': 'xs',
      'class': 'rtl:rotate-180',
      'disabled': index === 0,
      'aria-label': `Move ${label} back`,
      'onClick': () => moveColumn(column.id, -1)
    }),
    label,
    h(UButton, {
      'icon': 'i-lucide-chevron-right',
      'color': 'neutral',
      'variant': 'ghost',
      'size': 'xs',
      'class': 'rtl:rotate-180',
      'disabled': index === columnOrder.value.length - 1,
      'aria-label': `Move ${label} forward`,
      'onClick': () => moveColumn(column.id, 1)
    })
  ])
}
</script>

<template>
  <UTable v-model:column-order="columnOrder" :data="data" :columns="columns" :features="features" class="flex-1" />
</template>
