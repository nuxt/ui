<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { columnFacetingFeature, createFacetedRowModel, createFacetedUniqueValues } from '@tanstack/vue-table'
import type { TableColumn, TableFeatures } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

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
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'status',
  header: 'Status',
  filterFn: 'equals',
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
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(Number.parseFloat(row.getValue('amount')))

    return h('div', { class: 'text-right font-medium' }, formatted)
  }
}]

const features = {
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues()
}

const table = useTemplateRef('table')

const statusColumn = computed((): Column<TableFeatures, Payment> | undefined => table.value?.tableApi?.getColumn('status'))

const statusItems = computed((): { label: string, value: string }[] => [
  { label: 'All statuses', value: 'all' },
  ...Array.from(statusColumn.value?.getFacetedUniqueValues() ?? [], ([value, count]) => ({
    label: `${value} (${count})`,
    value
  }))
])
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-4 py-3.5 border-b border-strong">
      <USelect
        :model-value="(statusColumn?.getFilterValue() as string | undefined) ?? 'all'"
        :items="statusItems"
        class="w-48 capitalize"
        :ui="{ item: 'capitalize' }"
        @update:model-value="statusColumn?.setFilterValue($event === 'all' ? undefined : $event)"
      />
    </div>

    <UTable ref="table" :data="data" :columns="columns" :features="features" />
  </div>
</template>
