<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')

type Payment = {
  id: string
  date: string
  email: string
  amount: number
  children?: Payment[]
}

const data = ref<Payment[]>([{
  id: '4600',
  date: '2024-03-11T15:30:00',
  email: 'james.anderson@example.com',
  amount: 594,
  children: [
    {
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
      amount: 529,
      children: [
        {
          id: '4592',
          date: '2024-03-09T18:45:00',
          email: 'benjamin.jackson@example.com',
          amount: 851
        }, {
          id: '4591',
          date: '2024-03-09T16:05:00',
          email: 'sophia.miller@example.com',
          amount: 762
        }, {
          id: '4590',
          date: '2024-03-09T14:20:00',
          email: 'noah.clark@example.com',
          amount: 573,
          children: [
            {
              id: '4596',
              date: '2024-03-10T15:55:00',
              email: 'ethan.harris@example.com',
              amount: 639
            }, {
              id: '4595',
              date: '2024-03-10T13:40:00',
              email: 'ava.thomas@example.com',
              amount: 428
            }
          ]
        }
      ]
    }
  ]
}, {
  id: '4589',
  date: '2024-03-09T11:35:00',
  email: 'isabella.lee@example.com',
  amount: 389
}])

const columns: TableColumn<Payment>[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'aria-label': 'Select all'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected() ? true : row.getIsSomeSelected() ? 'indeterminate' : false,
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'aria-label': 'Select row'
  })
}, {
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => {
    return h(
      'div',
      {
        style: {
          paddingLeft: `${row.depth}rem`
        },
        class: 'flex items-center gap-2'
      },
      [
        h(UButton, {
          color: 'neutral',
          variant: 'outline',
          size: 'xs',
          icon: row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus',
          class: !row.getCanExpand() && 'invisible',
          ui: {
            base: 'p-0 rounded-sm',
            leadingIcon: 'size-4'
          },
          onClick: row.getToggleExpandedHandler()
        }),
        row.getValue('id') as string
      ]
    )
  }
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

const expanded = ref({ 0: true })
</script>

<template>
  <UTable
    v-model:expanded="expanded"
    :data="data"
    :columns="columns"
    :get-sub-rows="row => row.children"
    class="flex-1"
    :ui="{
      base: 'border-separate border-spacing-0',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      tr: 'group',
      td: 'empty:p-0 group-has-[td:not(:empty)]:border-b border-default'
    }"
  />
</template>
