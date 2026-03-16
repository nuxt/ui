<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { RowPinningState } from '@tanstack/table-core'

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
}, {
  id: '4595',
  date: '2024-03-10T13:40:00',
  status: 'refunded',
  email: 'ava.thomas@example.com',
  amount: 428
}, {
  id: '4594',
  date: '2024-03-10T09:15:00',
  status: 'paid',
  email: 'michael.wilson@example.com',
  amount: 683
}, {
  id: '4593',
  date: '2024-03-09T20:25:00',
  status: 'failed',
  email: 'olivia.taylor@example.com',
  amount: 947
}, {
  id: '4592',
  date: '2024-03-09T18:45:00',
  status: 'paid',
  email: 'benjamin.jackson@example.com',
  amount: 851
}, {
  id: '4591',
  date: '2024-03-09T16:05:00',
  status: 'paid',
  email: 'sophia.miller@example.com',
  amount: 762
}])

const columns: TableColumn<Payment>[] = [{
  id: 'pin',
  cell: ({ row }) => h(UButton, {
    'icon': 'i-lucide-star',
    'color': row.getIsPinned() ? 'primary' : 'neutral',
    'variant': 'ghost',
    'aria-label': row.getIsPinned() ? 'Unpin row' : 'Pin row to top',
    'onClick': () => {
      if (row.getIsPinned()) {
        row.pin(false)
      } else {
        row.pin('top')
      }
    }
  })
}, {
  accessorKey: 'date',
  header: 'Date',
  cell: ({ row }) => {
    return new Date(row.getValue('date')).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
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
  header: 'Amount',
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right font-medium'
    }
  },
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }
}]

const rowPinning = ref<RowPinningState>({ top: ['4599', '4597'], bottom: [] })
</script>

<template>
  <UTable
    v-model:row-pinning="rowPinning"
    :data="data"
    :columns="columns"
    :get-row-id="(row: Payment) => row.id"
    class="flex-1 h-96"
  />
</template>
