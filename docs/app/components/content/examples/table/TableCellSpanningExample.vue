<script setup lang="ts">
import { cellSpanningFeature } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'

type Product = {
  category: string
  name: string
  price: number
  stock: number
  total?: boolean
}

const products = ref<Product[]>([
  { category: 'Electronics', name: 'Laptop', price: 999, stock: 45 },
  { category: 'Electronics', name: 'Phone', price: 699, stock: 120 },
  { category: 'Electronics', name: 'Tablet', price: 499, stock: 78 },
  { category: 'Clothing', name: 'T-Shirt', price: 29, stock: 200 },
  { category: 'Clothing', name: 'Jeans', price: 59, stock: 150 }
])

const data = computed(() => [
  ...products.value,
  { category: 'Total', name: '', price: 0, stock: products.value.reduce((sum, product) => sum + product.stock, 0), total: true }
])

const features = { cellSpanningFeature }

const meta = {
  class: {
    tr: (row: TableRow<Product>) => row.original.total ? 'font-semibold' : ''
  }
}

const columns: TableColumn<Product>[] = [{
  accessorKey: 'category',
  header: 'Category',
  spanRows: true,
  // The total row's label spans the name column too.
  spanColumns: ({ row }) => row.original.total ? 2 : 1,
  meta: {
    class: {
      td: 'font-medium align-middle border-e border-default'
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
      th: 'text-end',
      td: 'text-end'
    }
  },
  cell: ({ row }) => {
    if (row.original.total) {
      return ''
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(row.getValue('price'))
  }
}, {
  accessorKey: 'stock',
  header: 'Stock',
  meta: {
    class: {
      th: 'text-end',
      td: 'text-end'
    }
  }
}]
</script>

<template>
  <UTable :data="data" :columns="columns" :features="features" :meta="meta" class="flex-1" />
</template>
