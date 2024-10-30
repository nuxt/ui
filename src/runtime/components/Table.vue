<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { Ref, Reactive } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type {
  Row,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  RowSelectionState,
  SortingState,
  ExpandedState,
  VisibilityState,
  GlobalFilterOptions,
  ColumnFiltersOptions,
  ColumnPinningOptions,
  VisibilityOptions,
  ExpandedOptions,
  SortingOptions,
  RowSelectionOptions,
  Updater
} from '@tanstack/vue-table'
import _appConfig from '#build/app.config'
import theme from '#build/ui/table'

const appConfig = _appConfig as AppConfig & { ui: { table: Partial<typeof theme> } }

const table = tv({ extend: tv(theme), ...(appConfig.ui?.table || {}) })

type TableVariants = VariantProps<typeof table>

export type TableColumn<T> = ColumnDef<T>

export interface TableData {
  [key: string]: any
}

export interface TableProps<T> {
  data?: T[]
  columns?: TableColumn<T>[]
  /**
   * Whether the table should have a sticky header.
   * @defaultValue false
   */
  sticky?: boolean
  /** Whether the table should be in loading state. */
  loading?: boolean
  loadingColor?: TableVariants['loadingColor']
  loadingAnimation?: TableVariants['loadingAnimation']
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  columnFiltersOptions?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
   */
  rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>
  class?: any
  ui?: Partial<typeof table.slots>
}

export interface TableSlots<T> {
  expanded(props: { row: Reactive<Row<T>> }): any
  empty(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends TableData">
import { computed } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { upperFirst } from 'scule'

const props = defineProps<TableProps<T>>()
defineSlots<TableSlots<T>>()

const data = computed(() => props.data ?? [])
const columns = computed<TableColumn<T>[]>(() => props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey: string) => ({ accessorKey, header: upperFirst(accessorKey) })))

const ui = computed(() => table({
  sticky: props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation
}))

const globalFilterState = defineModel<string>('globalFilter', { default: undefined })
const columnFiltersState = defineModel<ColumnFiltersState>('columnFilters', { default: [] })
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility', { default: {} })
const columnPinningState = defineModel<ColumnPinningState>('columnPinning', { default: {} })
const rowSelectionState = defineModel<RowSelectionState>('rowSelection', { default: {} })
const sortingState = defineModel<SortingState>('sorting', { default: [] })
const expandedState = defineModel<ExpandedState>('expanded', { default: {} })

const tableApi = useVueTable({
  data,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  ...(props.globalFilterOptions || {}),
  onGlobalFilterChange: updaterOrValue => valueUpdater(updaterOrValue, globalFilterState),
  ...(props.columnFiltersOptions || {}),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFiltersState),
  ...(props.visibilityOptions || {}),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibilityState),
  ...(props.columnPinningOptions || {}),
  onColumnPinningChange: updaterOrValue => valueUpdater(updaterOrValue, columnPinningState),
  ...(props.rowSelectionOptions || {}),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelectionState),
  ...(props.sortingOptions || {}),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sortingState),
  ...(props.expandedOptions || {}),
  getExpandedRowModel: getExpandedRowModel(),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expandedState),
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
    get columnPinning() {
      return columnPinningState.value
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
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :class="ui.th({ class: [props.ui?.th], pinned: !!header.column.getIsPinned() })"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </th>
        </tr>
      </thead>

      <tbody :class="ui.tbody({ class: [props.ui?.tbody] })">
        <template v-if="tableApi.getRowModel().rows?.length">
          <template v-for="row in tableApi.getRowModel().rows" :key="row.id">
            <tr :data-selected="row.getIsSelected()" :data-expanded="row.getIsExpanded()" :class="ui.tr({ class: [props.ui?.tr] })">
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-pinned="cell.column.getIsPinned()"
                :class="ui.td({ class: [props.ui?.td], pinned: !!cell.column.getIsPinned() })"
              >
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
