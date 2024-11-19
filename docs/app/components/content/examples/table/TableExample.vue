<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

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
}, {
  id: '4590',
  date: '2024-03-09T14:20:00',
  status: 'paid',
  email: 'noah.clark@example.com',
  amount: 573
}, {
  id: '4589',
  date: '2024-03-09T11:35:00',
  status: 'failed',
  email: 'isabella.lee@example.com',
  amount: 389
}, {
  id: '4588',
  date: '2024-03-08T22:50:00',
  status: 'refunded',
  email: 'liam.walker@example.com',
  amount: 701
}, {
  id: '4587',
  date: '2024-03-08T20:15:00',
  status: 'paid',
  email: 'charlotte.hall@example.com',
  amount: 856
}, {
  id: '4586',
  date: '2024-03-08T17:40:00',
  status: 'paid',
  email: 'mason.young@example.com',
  amount: 492
}, {
  id: '4585',
  date: '2024-03-08T14:55:00',
  status: 'failed',
  email: 'amelia.king@example.com',
  amount: 637
}, {
  id: '4584',
  date: '2024-03-08T12:30:00',
  status: 'paid',
  email: 'elijah.wright@example.com',
  amount: 784
}, {
  id: '4583',
  date: '2024-03-08T09:45:00',
  status: 'refunded',
  email: 'harper.scott@example.com',
  amount: 345
}, {
  id: '4582',
  date: '2024-03-07T23:10:00',
  status: 'paid',
  email: 'evelyn.green@example.com',
  amount: 918
}, {
  id: '4581',
  date: '2024-03-07T20:25:00',
  status: 'paid',
  email: 'logan.baker@example.com',
  amount: 567
}])

const columns: TableColumn<Payment>[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'ariaLabel': 'Select all'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'ariaLabel': 'Select row'
  }),
  enableSorting: false,
  enableHiding: false
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
  header: ({ column }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Email',
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  },
  cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
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
}, {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const items = [{
      type: 'label',
      label: 'Actions'
    }, {
      label: 'Copy payment ID',
      onSelect() {
        navigator.clipboard.writeText(row.original.id)

        toast.add({
          title: 'Payment ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    }, {
      label: row.getIsExpanded() ? 'Collapse' : 'Expand',
      onSelect() {
        row.toggleExpanded()
      }
    }, {
      type: 'separator'
    }, {
      label: 'View customer'
    }, {
      label: 'View payment details'
    }]

    return h('div', { class: 'text-right' }, h(UDropdownMenu, {
      content: {
        align: 'end'
      },
      items
    }, () => h(UButton, {
      icon: 'i-lucide-ellipsis-vertical',
      color: 'neutral',
      variant: 'ghost',
      class: 'ml-auto'
    })))
  }
}]

const table = useTemplateRef('table')

function randomize() {
  data.value = [...data.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
  <div class="flex-1 divide-y divide-[var(--ui-border-accented)] w-full">
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]"
        placeholder="Filter emails..."
        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
      />

      <UButton color="neutral" label="Randomize" @click="randomize" />

      <UDropdownMenu
        :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
          label: upperFirst(column.id),
          type: 'checkbox' as const,
          checked: column.getIsVisible(),
          onUpdateChecked(checked: boolean) {
            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
          },
          onSelect(e?: Event) {
            e?.preventDefault()
          }
        }))"
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class="ml-auto"
        />
      </UDropdownMenu>
    </div>

    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      sticky
      class="h-96"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>

    <div class="px-4 py-3.5 text-sm text-[var(--ui-text-muted)]">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>
  </div>
</template>
