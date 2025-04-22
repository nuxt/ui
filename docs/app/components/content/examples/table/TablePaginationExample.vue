<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

const table = useTemplateRef('table')

type Payment = {
  id: string
  date: string
  email: string
  amount: number
}
const data = ref<Payment[]>([{
  id: '4600',
  date: '2024-03-11T15:30:00',
  email: 'james.anderson@example.com',
  amount: 594
}, {
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
  amount: 529
}, {
  id: '4596',
  date: '2024-03-10T15:55:00',
  email: 'ethan.harris@example.com',
  amount: 639
}, {
  id: '4595',
  date: '2024-03-10T13:20:00',
  email: 'sophia.miller@example.com',
  amount: 428
}, {
  id: '4594',
  date: '2024-03-10T11:05:00',
  email: 'noah.wilson@example.com',
  amount: 673
}, {
  id: '4593',
  date: '2024-03-09T22:15:00',
  email: 'olivia.jones@example.com',
  amount: 382
}, {
  id: '4592',
  date: '2024-03-09T20:30:00',
  email: 'liam.taylor@example.com',
  amount: 547
}, {
  id: '4591',
  date: '2024-03-09T18:45:00',
  email: 'ava.thomas@example.com',
  amount: 291
}, {
  id: '4590',
  date: '2024-03-09T16:20:00',
  email: 'lucas.martin@example.com',
  amount: 624
}, {
  id: '4589',
  date: '2024-03-09T14:10:00',
  email: 'isabella.clark@example.com',
  amount: 438
}, {
  id: '4588',
  date: '2024-03-09T12:05:00',
  email: 'mason.rodriguez@example.com',
  amount: 583
}, {
  id: '4587',
  date: '2024-03-09T10:30:00',
  email: 'sophia.lee@example.com',
  amount: 347
}, {
  id: '4586',
  date: '2024-03-09T08:15:00',
  email: 'ethan.walker@example.com',
  amount: 692
}, {
  id: '4585',
  date: '2024-03-08T23:40:00',
  email: 'amelia.hall@example.com',
  amount: 419
}, {
  id: '4584',
  date: '2024-03-08T21:25:00',
  email: 'oliver.young@example.com',
  amount: 563
}, {
  id: '4583',
  date: '2024-03-08T19:50:00',
  email: 'aria.king@example.com',
  amount: 328
}, {
  id: '4582',
  date: '2024-03-08T17:35:00',
  email: 'henry.wright@example.com',
  amount: 647
}, {
  id: '4581',
  date: '2024-03-08T15:20:00',
  email: 'luna.lopez@example.com',
  amount: 482
}])
const columns: TableColumn<Payment>[] = [{
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

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <UTable
      ref="table"
      v-model:pagination="pagination"
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1"
    />

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
