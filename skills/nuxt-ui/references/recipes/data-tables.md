# Data Tables

Complete patterns for displaying and managing tabular data.

## Basic table

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const data = ref([
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'Editor' }
])

const columns: TableColumn<typeof data.value[number]>[] = [{
  accessorKey: 'name',
  header: 'Name'
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'role',
  header: 'Role'
}]
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

const rows = ref([
  { name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob', email: 'bob@example.com', role: 'Editor', status: 'Inactive' }
])

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

Row selection uses TanStack Table's `rowSelection` state — a `Record<string, true>` keyed by row id (the row index unless `get-row-id` is set). Unselected rows are absent from it. Set `get-row-id` to a stable unique string ID when replacing data, filtering it before passing it to the table, or fetching server pages.

```vue
<script setup lang="ts">
import type { RowSelectionState } from '@tanstack/vue-table'

const table = useTemplateRef('table')
const rowSelection = ref<RowSelectionState>({})
</script>

<template>
  <UTable ref="table" v-model:row-selection="rowSelection" :data="data" :columns="columns" :get-row-id="row => row.id" />

  <div class="px-4 py-3.5 text-sm text-muted">
    {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
    {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
  </div>
</template>
```

This example assumes each record has a unique string `id`. With server-side pagination, selected row models only include records in the current input data. For cross-page bulk actions, keep the selected IDs in `rowSelection` rather than deriving the full selection from `getSelectedRowModel()` or `getFilteredSelectedRowModel()`. Decide whether page or filter changes should clear selection.

Add a checkbox column using the `h` function. Use tri-state `modelValue` (`true`, `false`, or `'indeterminate'`) for the "select all" header. `getIsSomePageRowsSelected()` is true as soon as one row is selected, so check `getIsAllPageRowsSelected()` first:

```ts
import { h } from 'vue'

const UCheckbox = resolveComponent('UCheckbox')

const columns: TableColumn[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false,
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'aria-label': 'Select all'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'aria-label': 'Select row'
  })
},
// ... other columns
]
```

## With pagination

Pagination is not in `UTable`'s default features: register `rowPaginationFeature` and a `paginatedRowModel` through the `features` prop (read once, so declare it in the script). Bind `v-model:pagination`, then wire `UPagination` to it and to the table API. `UPagination`'s `total` is total **items** (not pages) — it calculates page count from `total / items-per-page`.

```vue
<script setup lang="ts">
import { createPaginatedRowModel, rowPaginationFeature } from '@tanstack/vue-table'

const table = useTemplateRef('table')

const features = { rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})
</script>

<template>
  <UTable
    ref="table"
    v-model:pagination="pagination"
    :data="data"
    :columns="columns"
    :features="features"
  />

  <div class="flex justify-end p-4">
    <UPagination
      :page="pagination.pageIndex + 1"
      :items-per-page="pagination.pageSize"
      :total="table?.tableApi?.getFilteredRowModel().rows.length"
      @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
    />
  </div>
</template>
```

## With async data (Nuxt)

Use `status === 'pending' || status === 'idle'` for loading state — `idle` covers the initial render before `useLazyFetch` starts.

```vue
<script setup lang="ts">
const { data, status } = useLazyFetch('/api/users', { server: false })
</script>

<template>
  <UTable :data="data" :columns="columns" :loading="status === 'pending' || status === 'idle'" />
</template>
```

For server-side pagination:

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

  <div class="flex justify-end p-4">
    <UPagination v-model:page="page" :total="data?.total" :items-per-page="data?.pageSize" />
  </div>
</template>
```

## Updating large datasets

UTable deep-watches `data` by default. For rows managed through array replacement, disable deep watching with `:watch-options="{ deep: false }"`. Replace the array and each changed row so the table refreshes its row models.

```vue
<script setup lang="ts">
const rows = shallowRef([{ id: '1', name: 'Alice' }])

function renameRow(id: string, name: string) {
  rows.value = rows.value.map(row => row.id === id ? { ...row, name } : row)
}
</script>

<template>
  <UTable :data="rows" :watch-options="{ deep: false }" />
</template>
```

With deep watching disabled, do not rely on `push()`, `splice()`, or nested edits alone to refresh table row models. Keep the default watcher when in-place mutation is part of the update model.

The separate `virtualize` option limits rendered rows for large datasets. It does not disable deep watching. Check the installed Nuxt UI version for virtualization support and its sticky or pinning restrictions.

## Tips

- Table is built on [TanStack Table v9](https://tanstack.com/table/v9) — columns use `ColumnDef` format with `accessorKey`, `header`, `cell`
- Sorting, filtering, expanding, row selection, column visibility, pinning and sizing, and row pinning are registered by default. Pagination, grouping and faceting go through the `features` prop
- Feature options (`enableRowSelection`, `enableMultiSort`, `manualPagination`...) go in the `options` prop
- Pinning uses `start` / `end`, not `left` / `right`
- Use `#<column>-cell` and `#<column>-header` template slots to customize rendering with Vue templates
- Alternatively, use the `h` function inside `header` and `cell` column properties for inline rendering
- Row data in slots is accessed via `row.original` (not `row` directly)
- Use `v-model:row-selection` for selection, `v-model:sorting` for sort state
- Wrap tables in `UDashboardPanel` with `#header` toolbar for the dashboard pattern
- For empty states, use the `#empty` slot
