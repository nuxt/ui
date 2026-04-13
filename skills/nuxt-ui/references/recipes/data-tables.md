# Data Tables

Complete patterns for displaying and managing tabular data.

## Basic table

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const columns: TableColumn<typeof data[number]>[] = [{
  accessorKey: 'name',
  header: 'Name'
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'role',
  header: 'Role'
}]

const data = ref([
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'Editor' }
])
</script>

<template>
  <UTable :data="data" :columns="columns" />
</template>
```

## With search and filters (dashboard)

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const search = ref('')
const roleFilter = ref('All')

const columns: TableColumn[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions' }
]

const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const matchesSearch = !search.value || row.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesRole = roleFilter.value === 'All' || row.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Users" />

      <UDashboardToolbar>
        <template #left>
          <UInput v-model="search" icon="i-lucide-search" placeholder="Search users..." />
        </template>
        <template #right>
          <USelect v-model="roleFilter" :items="['All', 'Admin', 'Editor', 'Viewer']" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable :data="filteredRows" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="row.original.status === 'Active' ? 'success' : 'neutral'" :label="row.original.status" variant="subtle" />
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu
            :items="[
              [{ label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => edit(row.original) }],
              [{ label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => remove(row.original) }]
            ]"
          >
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
```

## With row selection

Row selection uses TanStack Table's `rowSelection` state — a `Record<string, boolean>` keyed by row index.

```vue
<script setup lang="ts">
const rowSelection = ref<Record<string, boolean>>({})

const selectedCount = computed(() => Object.keys(rowSelection.value).length)
</script>

<template>
  <UTable v-model:row-selection="rowSelection" :data="rows" :columns="columns" />

  <div v-if="selectedCount" class="flex items-center gap-2 p-4">
    <span class="text-sm text-muted">{{ selectedCount }} selected</span>
    <UButton label="Delete selected" color="error" variant="soft" size="sm" />
  </div>
</template>
```

Add a checkbox column using the `h` function:

```ts
import { h } from 'vue'

const columns: TableColumn[] = [{
  id: 'select',
  header: ({ table }) => h(resolveComponent('UCheckbox'), {
    modelValue: table.getIsAllPageRowsSelected(),
    indeterminate: table.getIsSomePageRowsSelected(),
    'onUpdate:modelValue': (value: boolean) => table.toggleAllPageRowsSelected(value)
  }),
  cell: ({ row }) => h(resolveComponent('UCheckbox'), {
    modelValue: row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value)
  })
},
// ... other columns
]
```

## With pagination

```vue
<script setup lang="ts">
const page = ref(1)
const pageSize = 10

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / pageSize))
</script>

<template>
  <UTable :data="paginatedRows" :columns="columns" />

  <div class="flex justify-center p-4">
    <UPagination v-model="page" :total="totalPages" />
  </div>
</template>
```

## With async data (Nuxt)

```vue
<script setup lang="ts">
const page = ref(1)

const { data, status } = await useAsyncData(
  'users',
  () => $fetch('/api/users', { query: { page: page.value } }),
  { watch: [page] }
)
</script>

<template>
  <UTable :data="data?.items" :columns="columns" :loading="status === 'pending'" />

  <div class="flex justify-center p-4">
    <UPagination v-model="page" :total="data?.totalPages" />
  </div>
</template>
```

## Tips

- Table is built on [TanStack Table](https://tanstack.com/table/latest) — columns use `ColumnDef` format with `accessorKey`, `header`, `cell`
- Use `#<column>-cell` and `#<column>-header` template slots to customize rendering with Vue templates
- Alternatively, use the `h` function inside `header` and `cell` column properties for inline rendering
- Row data in slots is accessed via `row.original` (not `row` directly)
- Use `v-model:row-selection` for selection, `v-model:sorting` for sort state
- Wrap tables in `UDashboardPanel` with `#header` toolbar for the dashboard pattern
- For empty states, use the `#empty` slot
