<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type Person = {
  id: number
  name: string
  email: string
  age: number
}

const data: Person[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', age: 36 },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', age: 85 }
]

const columns: TableColumn<Person>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    header: 'Person',
    columns: [
      { accessorKey: 'name', header: 'Name' },
      {
        header: 'Details',
        columns: [
          { accessorKey: 'email', header: 'Email' },
          { accessorKey: 'age', header: 'Age' }
        ]
      }
    ]
  }
]

const showAge = ref(true)
const columnVisibility = computed(() => ({ age: showAge.value }))
</script>

<template>
  <Navbar>
    <USwitch v-model="showAge" label="Show age" />
  </Navbar>

  <UTable
    :column-visibility="columnVisibility"
    :data="data"
    :columns="columns"
    caption="Grouped headers with different depths"
    class="w-full"
    :ui="{ th: 'border border-default', td: 'border border-default' }"
  />
</template>
