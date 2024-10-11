<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type { ColumnDef, ColumnFiltersState, ExpandedState, SortingState, VisibilityState, Updater } from '@tanstack/vue-table'
import _appConfig from '#build/app.config'
import theme from '#build/ui/table'

const appConfig = _appConfig as AppConfig & { ui: { table: Partial<typeof theme> } }

const table = tv({ extend: tv(theme), ...(appConfig.ui?.table || {}) })

export interface TableProps<T> {
  columns?: ColumnDef<T>[]
  data: T[]
  class?: any
  ui?: Partial<typeof table.slots>
}

export type TableEmits = {}

export interface TableSlots<T> {
  expanded: { row: T }
}
</script>

<script setup lang="ts" generic="T">
import { ref, computed, type Ref } from 'vue'
import { FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { upperFirst } from 'scule'

const props = defineProps<TableProps<T>>()
defineEmits<TableEmits>()
defineSlots<TableSlots<T>>()

// eslint-disable-next-line vue/no-dupe-keys
const ui = table()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const columns = computed<ColumnDef<T>[]>(() => props.columns ?? Object.keys(props.data[0] ?? {}).map((accessorKey: string) => ({ accessorKey, header: upperFirst(accessorKey) })))

const tableApi = useVueTable({
  data: props.data,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value }
  }
})

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

defineExpose({
  tableApi
})
</script>

<template>
  <div :class="ui.root({ class: [props.class, props.ui?.root] })">
    <table :class="ui.base({ class: [props.ui?.base] })">
      <thead :class="ui.thead({ class: [props.ui?.thead] })">
        <tr v-for="headerGroup in tableApi.getHeaderGroups()" :key="headerGroup.id" :class="ui.tr({ class: [props.ui?.tr] })">
          <th v-for="header in headerGroup.headers" :key="header.id" :class="ui.th({ class: [props.ui?.th] })">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody :class="ui.tbody({ class: [props.ui?.tbody] })">
        <template v-if="tableApi.getRowModel().rows?.length">
          <template v-for="row in tableApi.getRowModel().rows" :key="row.id">
            <tr :data-state="row.getIsSelected() && 'selected'" :class="ui.tr({ class: [props.ui?.tr] })">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" :class="ui.td({ class: [props.ui?.td] })">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
            <tr v-if="row.getIsExpanded()" :class="ui.tr({ class: [props.ui?.tr] })">
              <td :colspan="row.getAllCells().length" :class="ui.td({ class: [props.ui?.td] })">
                <slot name="expanded" :row="row" />
              </td>
            </tr>
          </template>
        </template>

        <tr v-else :class="ui.tr({ class: [props.ui?.tr] })">
          <td
            :colspan="columns?.length"
            class="h-24 text-center"
          >
            No results.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
