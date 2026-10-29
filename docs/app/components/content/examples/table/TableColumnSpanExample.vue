<script setup lang="ts">
import { cellSpanningFeature } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

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

const features = { cellSpanningFeature }

const columns: TableColumn<Product>[] = [{
  accessorKey: 'category',
  header: 'Category',
  spanRows: true,
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
  <UTable :data="data" :columns="columns" :features="features" class="flex-1" />
</template>
