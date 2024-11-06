<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

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
  header: ({ column }) => getHeader(column, 'ID'),
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: ({ column }) => getHeader(column, 'Date'),
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
  header: ({ column }) => getHeader(column, 'Status'),
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
  header: ({ column }) => getHeader(column, 'Email')
}, {
  accessorKey: 'amount',
  header: ({ column }) => h('div', { class: 'text-right' }, getHeader(column, 'Amount')),
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)

    return h('div', { class: 'text-right font-medium' }, formatted)
  }
}]

function getHeader(column: Column<Payment>, label: string) {
  const isSorted = column.getIsSorted()

  return h(UDropdownMenu, {
    content: {
      align: 'start'
    },
    items: [{
      label: 'Asc',
      type: 'checkbox',
      icon: 'i-lucide-arrow-up-narrow-wide',
      checked: isSorted === 'asc',
      onSelect: () => {
        if (isSorted === 'asc') {
          column.clearSorting()
        } else {
          column.toggleSorting(false)
        }
      }
    }, {
      label: 'Desc',
      icon: 'i-lucide-arrow-down-wide-narrow',
      type: 'checkbox',
      checked: isSorted === 'desc',
      onSelect: () => {
        if (isSorted === 'desc') {
          column.clearSorting()
        } else {
          column.toggleSorting(true)
        }
      }
    }]
  }, () => h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
    class: '-mx-2.5 data-[state=open]:bg-[var(--ui-bg-elevated)]'
  }))
}

const sorting = ref([{
  id: 'id',
  desc: false
}])
</script>

<template>
  <UTable
    v-model:sorting="sorting"
    :data="data"
    :columns="columns"
    class="flex-1"
  />
</template>
