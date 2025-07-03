<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { getGroupedRowModel } from '@tanstack/vue-table'
import type { GroupingOptions } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')

type Account = {
  id: string
  name: string
}

type PaymentStatus = 'paid' | 'failed' | 'refunded'

type Payment = {
  id: string
  date: string
  status: PaymentStatus
  email: string
  amount: number
  account: Account
}

const getColorByStatus = (status: PaymentStatus) => {
  return {
    paid: 'success',
    failed: 'error',
    refunded: 'neutral'
  }[status]
}

const data = ref<Payment[]>([
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594,
    account: {
      id: '1',
      name: 'Account 1'
    }
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276,
    account: {
      id: '2',
      name: 'Account 2'
    }
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315,
    account: {
      id: '1',
      name: 'Account 1'
    }
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    status: 'paid',
    email: 'emma.davis@example.com',
    amount: 529,
    account: {
      id: '2',
      name: 'Account 2'
    }
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    status: 'paid',
    email: 'ethan.harris@example.com',
    amount: 639,
    account: {
      id: '1',
      name: 'Account 1'
    }
  }
])

const columns: TableColumn<Payment>[] = [
  {
    id: 'title',
    header: 'Item'
  },
  {
    id: 'account_id',
    accessorKey: 'account.id'
  },
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) =>
      row.getIsGrouped()
        ? `${row.getValue('id')} records`
        : `#${row.getValue('id')}`,
    aggregationFn: 'count'
  },
  {
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
    },
    aggregationFn: 'max'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      class: {
        td: 'w-full'
      }
    },
    cell: ({ row }) =>
      row.getIsGrouped()
        ? `${row.getValue('email')} customers`
        : row.getValue('email'),
    aggregationFn: 'uniqueCount'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
    aggregationFn: 'sum'
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: 'remove',
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :grouping="['account_id', 'status']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #title-cell="{ row }">
      <div v-if="row.getIsGrouped()" class="flex items-center">
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <UButton
          variant="outline"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
          @click="row.toggleExpanded()"
        />
        <strong v-if="row.groupingColumnId === 'account_id'">{{
          row.original.account.name
        }}</strong>
        <UBadge
          v-else-if="row.groupingColumnId === 'status'"
          :color="getColorByStatus(row.original.status)"
          class="capitalize"
          variant="subtle"
        >
          {{ row.original.status }}
        </UBadge>
      </div>
    </template>
  </UTable>
</template>
