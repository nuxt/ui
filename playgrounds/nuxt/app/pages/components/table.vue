<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useClipboard, refDebounced } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

type Payment = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  firstName: string
  lastName: string
  email: string
  amount: number
}

const table = useTemplateRef('table')

const virtualize = ref(false)

const statuses: Payment['status'][] = ['paid', 'failed', 'refunded']
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'mail.com']
const firstNames = ['john', 'jane', 'alex', 'sarah', 'mike', 'emma', 'david', 'lisa', 'chris', 'anna']
const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez']

function makeData(id: number | string, index?: number): Payment {
  const i = index ?? Number(id)
  const firstName = firstNames[i % firstNames.length]!
  const lastName = lastNames[i % lastNames.length]!

  return {
    id: id.toString(),
    date: index !== undefined ? new Date(Date.now() - index * 3600000 * 2).toISOString() : new Date().toISOString(),
    firstName,
    lastName,
    status: statuses[i % statuses.length]!,
    email: `${firstName}.${lastName}${i > 100 ? Math.floor(i / 10) : ''}@${domains[i % domains.length]}`,
    amount: Math.floor(Math.random() * 900) + 100
  }
}

const data = useState<Payment[]>('data', () => Array.from({ length: 1000 }, (_, i) => makeData(45800 - i, i)))

function getRowItems(row: TableRow<Payment>) {
  return [{
    type: 'label' as const,
    label: 'Actions'
  }, {
    label: 'Copy payment ID',
    onSelect() {
      copy(row.original.id)

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
    type: 'separator' as const
  }, {
    label: 'View customer'
  }, {
    label: 'View payment details'
  }]
}

const columns: TableColumn<Payment>[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'aria-label': 'Select all'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'aria-label': 'Select row'
  }),
  enableSorting: false,
  enableHiding: false,
  size: 32
}, {
  accessorKey: 'id',
  header: ({ column }) => getPinnedHeader(column, '#', 'left'),
  cell: ({ row }) => `#${row.getValue('id')}`,
  size: 84
}, {
  accessorKey: 'date',
  header: 'Date',
  meta: {
    class: {
      td: 'text-center font-semibold',
      th: 'text-right text-green-500 w-48'
    }
  },
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
  header: ({ column }) => getPinnedHeader(column, 'Status', 'left'),
  cell: ({ row }) => {
    const color = ({
      paid: 'success' as const,
      failed: 'error' as const,
      refunded: 'neutral' as const
    })[row.getValue('status') as string]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
  },
  size: 102
}, {
  accessorKey: 'firstName',
  header: ({ column }) => getPinnedHeader(column, 'First Name', 'left'),
  meta: {
    class: {
      td: 'capitalize'
    }
  },
  size: 128
}, {
  accessorKey: 'lastName',
  header: ({ column }) => getPinnedHeader(column, 'Last Name', 'left'),
  meta: {
    class: {
      td: 'capitalize'
    }
  },
  size: 128
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
  meta: {
    class: {
      td: 'lowercase'
    }
  }
}, {
  accessorKey: 'amount',
  header: ({ column }) => getPinnedHeader(column, 'Amount', 'right'),
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right font-medium'
    }
  },
  footer: ({ column }) => {
    const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<Payment>) => acc + Number.parseFloat(row.getValue('amount')), 0)
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(total)
    return `Total: ${formatted}`
  },
  cell: ({ row }) => {
    const amount = Number.parseFloat(row.getValue('amount'))
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  },
  size: 117
}, {
  id: 'actions',
  enableHiding: false,
  meta: {
    class: {
      td: 'text-right'
    }
  },
  cell: ({ row }) => {
    return h(UDropdownMenu, {
      'content': {
        align: 'end'
      },
      'items': getRowItems(row),
      'aria-label': 'Actions dropdown'
    }, () => h(UButton, {
      'icon': 'i-lucide-ellipsis-vertical',
      'color': 'neutral',
      'variant': 'ghost',
      'aria-label': 'Actions dropdown'
    }))
  },
  size: 64
}]

function getPinnedHeader(column: Column<Payment>, label: string, position: 'left' | 'right') {
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

const loading = ref(true)
const columnPinning = ref({
  left: ['select'],
  right: ['actions']
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 50
})

function addElement() {
  const maxId = Math.max(...data.value.map(item => Number(item.id)))
  data.value.unshift(makeData(maxId + 1))
}

function randomize() {
  data.value.sort(() => Math.random() - 0.5)
}

const rowSelection = ref<Record<string, boolean>>({})

function onSelect(e: Event, row: TableRow<Payment>) {
  row.toggleSelected(!row.getIsSelected())
}

const contextmenuRow = ref<TableRow<Payment> | null>(null)
const contextmenuItems = computed(() => contextmenuRow.value ? getRowItems(contextmenuRow.value) : [])

function onContextmenu(e: Event, row: TableRow<Payment>) {
  contextmenuRow.value = row
}

const popoverOpen = ref(false)
const popoverOpenDebounced = refDebounced(popoverOpen, 1)
const popoverAnchor = ref({ x: 0, y: 0 })
const popoverRow = ref<TableRow<Payment> | null>(null)

const reference = computed(() => ({
  getBoundingClientRect: () =>
    ({
      width: 0,
      height: 0,
      left: popoverAnchor.value.x,
      right: popoverAnchor.value.x,
      top: popoverAnchor.value.y,
      bottom: popoverAnchor.value.y,
      ...popoverAnchor.value
    } as DOMRect)
}))

function onHover(_e: Event, row: TableRow<Payment> | null) {
  popoverRow.value = row

  popoverOpen.value = !!row
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1300)
})
</script>

<template>
  <Navbar>
    <USwitch v-model="virtualize" label="Virtualize" />

    <UInput
      :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
      class="max-w-sm"
      placeholder="Filter emails..."
      @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
    />

    <UButton color="neutral" label="Randomize" @click="randomize" />
    <UButton color="neutral" label="Add element" @click="addElement" />

    <UDropdownMenu
      :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
        label: upperFirst(column.id),
        type: 'checkbox' as const,
        checked: column.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
        },
        onSelect(e: Event) {
          e.preventDefault()
        }
      }))"
      :content="{ align: 'end' }"
    >
      <UButton
        label="Columns"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-down"
        class="ms-auto"
      />
    </UDropdownMenu>
  </Navbar>

  <div class="flex flex-col gap-4 w-full h-full">
    <UContextMenu :items="contextmenuItems">
      <UTable
        ref="table"
        :key="String(virtualize)"
        :data="data"
        :columns="columns"
        :column-pinning="columnPinning"
        :row-selection="rowSelection"
        :loading="loading"
        :virtualize="virtualize"
        v-bind="virtualize ? {} : {
          data,
          pagination,
          paginationOptions: {
            getPaginationRowModel: getPaginationRowModel()
          }
        }"
        sticky
        class="border border-accented rounded-sm"
        @select="onSelect"
        @contextmenu="onContextmenu"
        @pointermove="(ev: PointerEvent) => {
          popoverAnchor.x = ev.clientX
          popoverAnchor.y = ev.clientY
        }"
        @hover="onHover"
      >
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>
    </UContextMenu>

    <UPopover :content="{ side: 'top', sideOffset: 16, updatePositionStrategy: 'always' }" :open="popoverOpenDebounced" :reference="reference">
      <template #content>
        <div class="p-4">
          {{ popoverRow?.original?.id }}
        </div>
      </template>
    </UPopover>

    <div class="flex items-center justify-between gap-3">
      <div class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </div>

      <div class="flex items-center gap-1.5">
        <UPagination
          :disabled="!!virtualize"
          :page="(table?.tableApi?.getState().pagination.pageIndex ?? 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize ?? 10"
          :total="table?.tableApi?.getFilteredRowModel().rows.length || 0"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>
