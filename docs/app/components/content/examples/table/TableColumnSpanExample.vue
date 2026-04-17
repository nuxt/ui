<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Cell } from '@tanstack/vue-table'

type Product = {
  category: string
  name: string
  price: number
  stock: number
}

const data = ref<Product[]>([
  { category: 'Electronics', name: 'Laptop', price: 999, stock: 45 },
  { category: 'Electronics', name: 'Phone', price: 699, stock: 120 },
  { category: 'Electronics', name: 'Tablet', price: 499, stock: 78 },
  { category: 'Clothing', name: 'T-Shirt', price: 29, stock: 200 },
  { category: 'Clothing', name: 'Jeans', price: 59, stock: 150 }
])

function getCategoryRowSpan(cell: Cell<Product, unknown>) {
  const category = cell.row.original.category
  const rows = cell.getContext().table.getRowModel().rows
  const rowIndex = rows.findIndex((r: typeof rows[number]) => r.id === cell.row.id)

  if (rowIndex > 0 && rows[rowIndex - 1]!.original.category === category) {
    return '1'
  }

  let span = 1
  for (let i = rowIndex + 1; i < rows.length; i++) {
    if (rows[i]!.original.category === category) span++
    else break
  }

  return `${span}`
}

function getCategoryClass(cell: Cell<Product, unknown>) {
  const category = cell.row.original.category
  const rows = cell.getContext().table.getRowModel().rows
  const rowIndex = rows.findIndex((r: typeof rows[number]) => r.id === cell.row.id)

  if (rowIndex > 0 && rows[rowIndex - 1]!.original.category === category) {
    return 'hidden'
  }

  return 'font-medium align-middle border-r border-default'
}

const columns: TableColumn<Product>[] = [{
  accessorKey: 'category',
  header: 'Category',
  meta: {
    rowspan: {
      td: getCategoryRowSpan
    },
    class: {
      td: getCategoryClass
    }
  }
}, {
  accessorKey: 'name',
  header: 'Name'
}, {
  accessorKey: 'price',
  header: 'Price',
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right'
    }
  },
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(row.getValue('price'))
  }
}, {
  accessorKey: 'stock',
  header: 'Stock',
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right'
    }
  }
}]
</script>

<template>
  <UTable :data="data" :columns="columns" class="flex-1" />
</template>
