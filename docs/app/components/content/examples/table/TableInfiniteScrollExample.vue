<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')

type Product = {
  id: number
  title: string
  slug: string
  price: string
  images: string[]
}

const offset = ref(0)
const url = computed(() => `https://api.escuelajs.co/api/v1/products?offset=${offset.value}&limit=10`)

const { data, status, execute } = await useFetch<Product[]>(url, {
  key: 'table-products',
  transform: (data) => {
    return data?.map(product => ({
      id: product.id,
      title: product.title,
      slug: `https://api.escuelajs.co/api/v1/products/slug/${product.slug}`,
      price: `${product.price} €`,
      images: [product.images[0]!]
    })) || []
  },
  lazy: true,
  immediate: false,
  watch: [offset]
})

execute()

const products = ref<Product[]>([])

watch(data, () => {
  products.value = [
    ...products.value,
    ...data.value || []
  ]
})

const columns: TableColumn<Product>[] = [{
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'images',
  header: 'Image',
  cell: ({ row }) => h('img', { src: row.original.images[0], class: 'h-12 w-auto' })
}, {
  accessorKey: 'title',
  header: 'Name'
}, {
  accessorKey: 'price',
  header: 'Price'
}, {
  accessorKey: 'slug',
  header: 'Link',
  cell: ({ row }) => h(UButton, {
    icon: 'i-lucide:arrow-up-right',
    link: true,
    to: row.original.slug || '',
    target: '_blank'
  })
}]

const table = useTemplateRef('table')

const onScroll = async () => {
  const wrapperElement = table.value?.wrapperElement?.$el

  if (!wrapperElement) return

  // This products API provides only 50 items, if you know the max amount of items your API provides you can add it here
  if (offset.value >= 40) return

  if (status.value === 'pending') return

  // In this example we trigger the API call when the container is 2/3 scrolled, you can implement your own logic to trigger the data fetching
  if (wrapperElement.scrollTop + wrapperElement.clientHeight >= (wrapperElement.scrollHeight * 2) / 3) {
    offset.value += 10
  }
}
</script>

<template>
  <UTable
    ref="table"
    :data="products"
    :columns="columns"
    :loading="status === 'pending'"
    class="flex-1 h-80"
    @scroll="onScroll"
  />
</template>
