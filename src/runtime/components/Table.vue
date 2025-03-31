<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { Ref } from 'vue'
import type { VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type { RowData } from '@tanstack/table-core'
import type {
  CellContext,
  ColumnDef,
  ColumnFiltersOptions,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningOptions,
  ColumnPinningState,
  ColumnSizingInfoState,
  ColumnSizingOptions,
  ColumnSizingState,
  CoreOptions,
  ExpandedOptions,
  ExpandedState,
  FacetedOptions,
  GlobalFilterOptions,
  GroupingOptions,
  GroupingState,
  HeaderContext,
  PaginationOptions,
  PaginationState,
  Row,
  RowPinningOptions,
  RowPinningState,
  RowSelectionOptions,
  RowSelectionState,
  SortingOptions,
  SortingState,
  Updater,
  VisibilityOptions,
  VisibilityState
} from '@tanstack/vue-table'
import _appConfig from '#build/app.config'
import theme from '#build/ui/table'
import { tv } from '../utils/tv'

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    class?: {
      th?: string
      td?: string
    }
  }
}

const appConfigTable = _appConfig as AppConfig & { ui: { table: Partial<typeof theme> } }

const table = tv({ extend: tv(theme), ...(appConfigTable.ui?.table || {}) })

type TableVariants = VariantProps<typeof table>

export type TableRow<T> = Row<T>
export type TableData = RowData
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<T, D>

export interface TableOptions<T extends TableData> extends Omit<CoreOptions<T>, 'data' | 'columns' | 'getCoreRowModel' | 'state' | 'onStateChange' | 'renderFallbackValue'> {
  state?: CoreOptions<T>['state']
  onStateChange?: CoreOptions<T>['onStateChange']
  renderFallbackValue?: CoreOptions<T>['renderFallbackValue']
}

export interface TableProps<T extends TableData> extends TableOptions<T> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  data?: T[]
  columns?: TableColumn<T>[]
  caption?: string
  /**
   * The text to display when the table is empty.
   * @defaultValue t('table.noData')
   */
  empty?: string
  /**
   * Whether the table should have a sticky header.
   * @defaultValue false
   */
  sticky?: boolean
  /** Whether the table should be in loading state. */
  loading?: boolean
  /**
   * @defaultValue 'primary'
   */
  loadingColor?: TableVariants['loadingColor']
  /**
   * @defaultValue 'carousel'
   */
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
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  columnSizingOptions?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>
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
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>
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
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>
  /**
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  facetedOptions?: FacetedOptions<T>
  onSelect?: (row: TableRow<T>, e?: Event) => void
  class?: any
  ui?: Partial<typeof table.slots>
}

type DynamicHeaderSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-header`, (props: HeaderContext<T, unknown>) => any>
type DynamicCellSlots<T, K = keyof T> = Record<string, (props: CellContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-cell`, (props: CellContext<T, unknown>) => any>

export type TableSlots<T> = {
  expanded: (props: { row: Row<T> }) => any
  empty: (props?: {}) => any
  loading: (props?: {}) => any
  caption: (props?: {}) => any
} & DynamicHeaderSlots<T> & DynamicCellSlots<T>

</script>

<script setup lang="ts" generic="T extends TableData">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { upperFirst } from 'scule'
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getExpandedRowModel, useVueTable } from '@tanstack/vue-table'
import { reactiveOmit } from '@vueuse/core'
import { useLocale } from '../composables/useLocale'

const props = defineProps<TableProps<T>>()
const slots = defineSlots<TableSlots<T>>()

const { t } = useLocale()

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
const columnOrderState = defineModel<ColumnOrderState>('columnOrder', { default: [] })
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility', { default: {} })
const columnPinningState = defineModel<ColumnPinningState>('columnPinning', { default: {} })
const columnSizingState = defineModel<ColumnSizingState>('columnSizing', { default: {} })
const columnSizingInfoState = defineModel<ColumnSizingInfoState>('columnSizingInfo', { default: {} })
const rowSelectionState = defineModel<RowSelectionState>('rowSelection', { default: {} })
const rowPinningState = defineModel<RowPinningState>('rowPinning', { default: {} })
const sortingState = defineModel<SortingState>('sorting', { default: [] })
const groupingState = defineModel<GroupingState>('grouping', { default: [] })
const expandedState = defineModel<ExpandedState>('expanded', { default: {} })
const paginationState = defineModel<PaginationState>('pagination', { default: {} })

const tableApi = useVueTable({
  ...reactiveOmit(props, 'as', 'data', 'columns', 'caption', 'sticky', 'loading', 'loadingColor', 'loadingAnimation', 'class', 'ui'),
  data,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  ...(props.globalFilterOptions || {}),
  onGlobalFilterChange: updaterOrValue => valueUpdater(updaterOrValue, globalFilterState),
  ...(props.columnFiltersOptions || {}),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFiltersState),
  onColumnOrderChange: updaterOrValue => valueUpdater(updaterOrValue, columnOrderState),
  ...(props.visibilityOptions || {}),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibilityState),
  ...(props.columnPinningOptions || {}),
  onColumnPinningChange: updaterOrValue => valueUpdater(updaterOrValue, columnPinningState),
  ...(props.columnSizingOptions || {}),
  onColumnSizingChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizingState),
  onColumnSizingInfoChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizingInfoState),
  ...(props.rowSelectionOptions || {}),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelectionState),
  ...(props.rowPinningOptions || {}),
  onRowPinningChange: updaterOrValue => valueUpdater(updaterOrValue, rowPinningState),
  ...(props.sortingOptions || {}),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sortingState),
  ...(props.groupingOptions || {}),
  onGroupingChange: updaterOrValue => valueUpdater(updaterOrValue, groupingState),
  ...(props.expandedOptions || {}),
  getExpandedRowModel: getExpandedRowModel(),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expandedState),
  ...(props.paginationOptions || {}),
  onPaginationChange: updaterOrValue => valueUpdater(updaterOrValue, paginationState),
  ...(props.facetedOptions || {}),
  state: {
    get globalFilter() {
      return globalFilterState.value
    },
    get columnFilters() {
      return columnFiltersState.value
    },
    get columnOrder() {
      return columnOrderState.value
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
    },
    get grouping() {
      return groupingState.value
    },
    get rowPinning() {
      return rowPinningState.value
    },
    get columnSizing() {
      return columnSizingState.value
    },
    get columnSizingInfo() {
      return columnSizingInfoState.value
    },
    get pagination() {
      return paginationState.value
    }
  }
})

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

function handleRowSelect(row: TableRow<T>, e: Event) {
  if (!props.onSelect) {
    return
  }
  const target = e.target as HTMLElement
  const isInteractive = target.closest('button') || target.closest('a')
  if (isInteractive) {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  props.onSelect(row, e)
}

defineExpose({
  tableApi
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <table :class="ui.base({ class: [props.ui?.base] })">
      <caption v-if="caption || !!slots.caption" :class="ui.caption({ class: [props.ui?.caption] })">
        <slot name="caption">
          {{ caption }}
        </slot>
      </caption>

      <thead :class="ui.thead({ class: [props.ui?.thead] })">
        <tr v-for="headerGroup in tableApi.getHeaderGroups()" :key="headerGroup.id" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :class="ui.th({ class: [props.ui?.th, header.column.columnDef.meta?.class?.th], pinned: !!header.column.getIsPinned() })"
          >
            <slot :name="`${header.id}-header`" v-bind="header.getContext()">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </slot>
          </th>
        </tr>
      </thead>

      <tbody :class="ui.tbody({ class: [props.ui?.tbody] })">
        <template v-if="tableApi.getRowModel().rows?.length">
          <template v-for="row in tableApi.getRowModel().rows" :key="row.id">
            <tr
              :data-selected="row.getIsSelected()"
              :data-selectable="!!props.onSelect"
              :data-expanded="row.getIsExpanded()"
              :role="props.onSelect ? 'button' : undefined"
              :tabindex="props.onSelect ? 0 : undefined"
              :class="ui.tr({ class: [props.ui?.tr] })"
              @click="handleRowSelect(row, $event)"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-pinned="cell.column.getIsPinned()"
                :class="ui.td({ class: [props.ui?.td, cell.column.columnDef.meta?.class?.td], pinned: !!cell.column.getIsPinned() })"
              >
                <slot :name="`${cell.column.id}-cell`" v-bind="cell.getContext()">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </td>
            </tr>
            <tr v-if="row.getIsExpanded()" :class="ui.tr({ class: [props.ui?.tr] })">
              <td :colspan="row.getAllCells().length" :class="ui.td({ class: [props.ui?.td] })">
                <slot name="expanded" :row="row" />
              </td>
            </tr>
          </template>
        </template>

        <tr v-else-if="loading && !!slots['loading']">
          <td :colspan="columns?.length" :class="ui.loading({ class: props.ui?.loading })">
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td :colspan="columns?.length" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty">
              {{ empty || t('table.noData') }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </Primitive>
</template>
