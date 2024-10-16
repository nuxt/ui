<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { Ref } from 'vue'
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type {
  Row,
  ColumnDef,
  ColumnFiltersState,
  // ColumnPinningState,
  RowSelectionState,
  SortingState,
  ExpandedState,
  VisibilityState,
  // PaginationState,
  Updater
  // Table as TableApi
} from '@tanstack/vue-table'
import _appConfig from '#build/app.config'
import theme from '#build/ui/table'

const appConfig = _appConfig as AppConfig & { ui: { table: Partial<typeof theme> } }

const table = tv({ extend: tv(theme), ...(appConfig.ui?.table || {}) })

export type TableColumn<T> = ColumnDef<T>
export interface TableData {
  [key: string]: any
}

export interface TableProps<T> {
  // paginationOptions?: Omit<PaginationOptions, 'getPaginationRowModel' | 'onPaginationChange'>
  columns?: TableColumn<T>[]
  data: T[]
  class?: any
  ui?: Partial<typeof table.slots>
}

export interface TableSlots<T> {
  expanded(props: { row: Row<T> }): any
  empty(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends TableData">
import { computed } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { upperFirst } from 'scule'

const props = defineProps<TableProps<T>>()
defineSlots<TableSlots<T>>()

// eslint-disable-next-line vue/no-dupe-keys
const ui = table()

const globalFilterState = defineModel<string>('globalFilter', { default: undefined })
const columnFiltersState = defineModel<ColumnFiltersState>('columnFilters', { default: [] })
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility', { default: {} })
// const columnPinningState = defineModel<ColumnPinningState>('columnPinning', { default: {} })
const rowSelectionState = defineModel<RowSelectionState>('rowSelection', { default: {} })
const sortingState = defineModel<SortingState>('sorting', { default: [] })
const expandedState = defineModel<ExpandedState>('expanded', { default: {} })
// const paginationState = defineModel<PaginationState>('pagination', { default: undefined })

const columns = computed<TableColumn<T>[]>(() => props.columns ?? Object.keys(props.data[0] ?? {}).map((accessorKey: string) => ({ accessorKey, header: upperFirst(accessorKey) })))

const tableApi = useVueTable({
  get data() { return props.data },
  get columns() { return columns.value },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  // getPaginationRowModel: getPaginationRowModel()
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onGlobalFilterChange: updaterOrValue => valueUpdater(updaterOrValue, globalFilterState),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFiltersState),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibilityState),
  // onColumnPinningChange: updaterOrValue => valueUpdater(updaterOrValue, columnPinningState),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelectionState),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sortingState),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expandedState),
  // onPaginationChange: updaterOrValue => valueUpdater(updaterOrValue, paginationState),
  state: {
    get globalFilter() {
      return globalFilterState.value
    },
    get columnFilters() {
      return columnFiltersState.value
    },
    get columnVisibility() {
      return columnVisibilityState.value
    },
    get expanded() {
      return expandedState.value
    },
    get rowSelection() {
      return rowSelectionState.value
    },
    get sorting() {
      return sortingState.value
    }
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
            <tr :data-state="row.getIsSelected() ? 'selected' : undefined" :class="ui.tr({ class: [props.ui?.tr] })">
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
          <td :colspan="columns?.length" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty">
              No results
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
