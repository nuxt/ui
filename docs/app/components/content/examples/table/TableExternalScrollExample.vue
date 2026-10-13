<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

type Payment = {
  id: string
  date: string
  customer: string
  email: string
  method: string
  status: 'paid' | 'failed' | 'refunded'
  amount: number
}

const names = ['James Anderson', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'Michael Davis']
const methods = ['Visa', 'Mastercard', 'PayPal', 'Amex']
const statuses = ['paid', 'failed', 'refunded'] as const

const data = ref<Payment[]>(Array.from({ length: 1000 }, (_, i) => {
  const customer = names[i % names.length]!
  return {
    id: `4600-${i}`,
    date: '2024-03-11T15:30:00',
    customer,
    email: `${customer.toLowerCase().replace(' ', '.')}@example.com`,
    method: methods[i % methods.length]!,
    status: statuses[i % statuses.length]!,
    amount: 100 + ((i * 37) % 900)
  }
}))

// The container owns the scroll; the table virtualizes against it so the header and rows share one scrollbar.
const container = useTemplateRef('container')
const title = useTemplateRef('title')
const getScrollElement = () => container.value

// `scrollMargin` is the table's offset within the scroll element (border-box height of the title above it).
const { height: titleHeight } = useElementSize(title, undefined, { box: 'border-box' })

const columns: TableColumn<Payment>[] = [{
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: 'Date',
  cell: ({ row }) => new Date(row.getValue('date')).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}, {
  accessorKey: 'customer',
  header: 'Customer'
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'method',
  header: 'Method'
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
  accessorKey: 'amount',
  header: 'Amount',
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right font-medium'
    }
  },
  cell: ({ row }) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number.parseFloat(row.getValue('amount')))
}]
</script>

<template>
  <div
    ref="container"
    class="w-full h-96 overflow-auto"
  >
    <div
      ref="title"
      class="sticky left-0 z-10 flex items-end justify-between gap-4 p-6 bg-elevated/50"
    >
      <div>
        <h2 class="text-2xl font-bold text-highlighted">
          Payments
        </h2>
        <p class="text-muted">
          The title stays put while the wide table scrolls both axes under one scrollbar.
        </p>
      </div>
      <UBadge
        color="neutral"
        variant="subtle"
        :label="`${data.length} rows`"
      />
    </div>

    <UTable
      sticky
      :data="data"
      :columns="columns"
      :virtualize="{ scrollMargin: titleHeight, getScrollElement }"
      :ui="{ base: 'min-w-[1200px]' }"
    />
  </div>
</template>
