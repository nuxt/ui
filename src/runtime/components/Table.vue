<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { Ref, WatchOptions, ComponentPublicInstance } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { Cell, Column, Header, RowData, TableMeta } from '@tanstack/table-core'
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
import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import theme from '#build/ui/table'
import type { TableHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

declare module '@tanstack/table-core' {

  interface ColumnMeta<TData extends RowData, TValue> {
    class?: {
      th?: string | ((cell: Header<TData, TValue>) => string)
      td?: string | ((cell: Cell<TData, TValue>) => string)
    }
    style?: {
      th?: string | Record<string, string> | ((cell: Header<TData, TValue>) => string | Record<string, string>)
      td?: string | Record<string, string> | ((cell: Cell<TData, TValue>) => string | Record<string, string>)
    }
    colspan?: {
      td?: string | ((cell: Cell<TData, TValue>) => string)
    }
    rowspan?: {
      td?: string | ((cell: Cell<TData, TValue>) => string)
    }

  }

  interface TableMeta<TData> {
    class?: {
      tr?: string | ((row: Row<TData>) => string)
    }
    style?: {
      tr?: string | Record<string, string> | ((row: Row<TData>) => string | Record<string, string>)
    }
  }

}

type Table = ComponentConfig<typeof theme, AppConfig, 'table'>

export type TableRow<T> = Row<T>
export type TableData = RowData
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<T, D>

export interface TableOptions<T extends TableData = TableData> extends Omit<CoreOptions<T>, 'data' | 'columns' | 'getCoreRowModel' | 'state' | 'onStateChange' | 'renderFallbackValue'> {
  state?: CoreOptions<T>['state']
  onStateChange?: CoreOptions<T>['onStateChange']
  renderFallbackValue?: CoreOptions<T>['renderFallbackValue']
}

export interface TableProps<T extends TableData = TableData> extends TableOptions<T>, /** @vue-ignore */ TableHTMLAttributes {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  data?: T[]
  columns?: TableColumn<T>[]
  caption?: string
  meta?: TableMeta<T>
  /**
   * Enable virtualization for large datasets.
   * Note: when enabled, the divider between rows and sticky properties are not supported.
   * @defaultValue false
   */
  virtualize?: boolean | (Partial<Omit<VirtualizerOptions<Element, Element>, 'getScrollElement' | 'count' | 'estimateSize' | 'overscan'>> & {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item, or a function that returns the size for a given index
     * @defaultValue 65
     */
    estimateSize?: number | ((index: number) => number)
  })
  /**
   * The text to display when the table is empty.
   * @defaultValue t('table.noData')
   */
  empty?: string
  /**
   * Whether the table should have a sticky header or footer. True for both, 'header' for header only, 'footer' for footer only.
   * Note: this prop is not supported when `virtualize` is true.
   * @defaultValue false
   */
  sticky?: boolean | 'header' | 'footer'
  /** Whether the table should be in loading state. */
  loading?: boolean
  /**
   * @defaultValue 'primary'
   */
  loadingColor?: Table['variants']['loadingColor']
  /**
   * @defaultValue 'carousel'
   */
  loadingAnimation?: Table['variants']['loadingAnimation']
  /**
   * Use the `watchOptions` prop to customize reactivity (for ex: disable deep watching for changes in your data or limiting the max traversal depth). This can improve performance by reducing unnecessary re-renders, but it should be used with caution as it may lead to unexpected behavior if not managed properly.
   * @see [API](https://vuejs.org/api/options-state.html#watch)
   * @see [Guide](https://vuejs.org/guide/essentials/watchers.html)
   * @defaultValue { deep: true }
   */
  watchOptions?: WatchOptions
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  columnFiltersOptions?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
   */
  columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
   */
  columnSizingOptions?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
   */
  visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/sorting#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/grouping#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/expanding#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/row-selection#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
   */
  rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
   */
  rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/pagination#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>
  /**
   * @see [API](https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options)
   * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  facetedOptions?: FacetedOptions<T>
  onSelect?: (e: Event, row: TableRow<T>) => void
  onHover?: (e: Event, row: TableRow<T> | null) => void
  onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>
  class?: any
  ui?: Table['slots']
}

type DynamicHeaderSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-header`, (props: HeaderContext<T, unknown>) => any>
type DynamicFooterSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-footer`, (props: HeaderContext<T, unknown>) => any>
type DynamicCellSlots<T, K = keyof T> = Record<string, (props: CellContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-cell`, (props: CellContext<T, unknown>) => any>

export type TableSlots<T extends TableData = TableData> = {
  'expanded': (props: { row: Row<T> }) => any
  'empty': (props?: {}) => any
  'loading': (props?: {}) => any
  'caption': (props?: {}) => any
  'body-top': (props?: {}) => any
  'body-bottom': (props?: {}) => any
} & DynamicHeaderSlots<T> & DynamicFooterSlots<T> & DynamicCellSlots<T>

</script>

<script setup lang="ts" generic="T extends TableData">
import { ref, computed, useTemplateRef, watch, toRef } from 'vue'
import { Primitive, useForwardProps } from 'reka-ui'
import { upperFirst } from 'scule'
import { defu } from 'defu'
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getExpandedRowModel, useVueTable } from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TableProps<T>>(), {
  watchOptions: () => ({
    deep: true
  }),
  virtualize: false
})
const slots = defineSlots<TableSlots<T>>()

const { t } = useLocale()
const appConfig = useAppConfig() as Table['AppConfig']

const data = ref(props.data ?? []) as Ref<T[]>
const meta = computed(() => props.meta ?? {})
const columns = computed<TableColumn<T>[]>(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey: string) => ({ accessorKey, header: upperFirst(accessorKey) }))))

function processColumns(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns.map((column) => {
    const col = { ...column } as TableColumn<T>

    if ('columns' in col && col.columns) {
      col.columns = processColumns(col.columns as TableColumn<T>[])
    }

    if (!col.cell) {
      col.cell = ({ getValue }) => {
        const value = getValue()
        if (value === '' || value === null || value === undefined) {
          return '\u00A0'
        }
        return String(value)
      }
    }

    return col
  })
}

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.table || {}) })({
  sticky: props.virtualize ? false : props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation,
  virtualize: !!props.virtualize
}))

const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate()
const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate<{ row: TableRow<T>, style?: Record<string, string> }>({
  props: {
    row: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      required: false
    }
  }
})

const hasFooter = computed(() => {
  function hasFooterRecursive(columns: TableColumn<T>[]): boolean {
    for (const column of columns) {
      if ('footer' in column) {
        return true
      }
      if ('columns' in column && hasFooterRecursive(column.columns as TableColumn<T>[])) {
        return true
      }
    }
    return false
  }

  return hasFooterRecursive(columns.value)
})

const globalFilterState = defineModel<string>('globalFilter')
const columnFiltersState = defineModel<ColumnFiltersState>('columnFilters')
const columnOrderState = defineModel<ColumnOrderState>('columnOrder')
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility')
const columnPinningState = defineModel<ColumnPinningState>('columnPinning')
const columnSizingState = defineModel<ColumnSizingState>('columnSizing')
const columnSizingInfoState = defineModel<ColumnSizingInfoState>('columnSizingInfo')
const rowSelectionState = defineModel<RowSelectionState>('rowSelection')
const rowPinningState = defineModel<RowPinningState>('rowPinning')
const sortingState = defineModel<SortingState>('sorting')
const groupingState = defineModel<GroupingState>('grouping')
const expandedState = defineModel<ExpandedState>('expanded')
const paginationState = defineModel<PaginationState>('pagination')

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')

const tableProps = useForwardProps(reactivePick(props, '_features', 'autoResetAll', 'debugAll', 'debugCells', 'debugColumns', 'debugHeaders', 'debugRows', 'debugTable', 'defaultColumn', 'getRowId', 'getSubRows', 'initialState', 'mergeOptions', 'renderFallbackValue'))

const tableApi = useVueTable({
  ...tableProps.value,
  get data() {
    return data.value
  },
  get columns() {
    return columns.value
  },
  meta: meta.value,
  getCoreRowModel: getCoreRowModel(),
  ...(props.globalFilterOptions || {}),
  ...(globalFilterState.value !== undefined && { onGlobalFilterChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, globalFilterState) }),
  ...(props.columnFiltersOptions || {}),
  getFilteredRowModel: getFilteredRowModel(),
  ...(columnFiltersState.value !== undefined && { onColumnFiltersChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnFiltersState) }),
  ...(columnOrderState.value !== undefined && { onColumnOrderChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnOrderState) }),
  ...(props.visibilityOptions || {}),
  ...(columnVisibilityState.value !== undefined && { onColumnVisibilityChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnVisibilityState) }),
  ...(props.columnPinningOptions || {}),
  ...(columnPinningState.value !== undefined && { onColumnPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnPinningState) }),
  ...(props.columnSizingOptions || {}),
  ...(columnSizingState.value !== undefined && { onColumnSizingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnSizingState) }),
  ...(columnSizingInfoState.value !== undefined && { onColumnSizingInfoChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnSizingInfoState) }),
  ...(props.rowSelectionOptions || {}),
  ...(rowSelectionState.value !== undefined && { onRowSelectionChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowSelectionState) }),
  ...(props.rowPinningOptions || {}),
  ...(rowPinningState.value !== undefined && { onRowPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowPinningState) }),
  ...(props.sortingOptions || {}),
  getSortedRowModel: getSortedRowModel(),
  ...(sortingState.value !== undefined && { onSortingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, sortingState) }),
  ...(props.groupingOptions || {}),
  ...(groupingState.value !== undefined && { onGroupingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, groupingState) }),
  ...(props.expandedOptions || {}),
  getExpandedRowModel: getExpandedRowModel(),
  ...(expandedState.value !== undefined && { onExpandedChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, expandedState) }),
  ...(props.paginationOptions || {}),
  ...(paginationState.value !== undefined && { onPaginationChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, paginationState) }),
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

const rows = computed(() => tableApi.getRowModel().rows)

const virtualizerProps = toRef(() => defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
  estimateSize: 65,
  overscan: 12
}))

const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get count() {
    return rows.value.length
  },
  getScrollElement: () => rootRef.value?.$el,
  estimateSize: (index: number) => {
    const estimate = virtualizerProps.value.estimateSize
    return typeof estimate === 'function' ? estimate(index) : estimate
  }
})

const renderedSize = computed(() => {
  if (!virtualizer) {
    return 0
  }

  const virtualItems = virtualizer.value.getVirtualItems()
  if (!virtualItems?.length) {
    return 0
  }

  // Sum up the actual sizes of virtual items
  return virtualItems.reduce((sum: number, item: any) => sum + item.size, 0)
})

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

function onRowSelect(e: Event, row: TableRow<T>) {
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

  props.onSelect(e, row)
}

function onRowHover(e: Event, row: TableRow<T> | null) {
  if (!props.onHover) {
    return
  }

  props.onHover(e, row)
}

function onRowContextmenu(e: Event, row: TableRow<T>) {
  if (!props.onContextmenu) {
    return
  }

  if (Array.isArray(props.onContextmenu)) {
    props.onContextmenu.forEach(fn => fn(e, row))
  } else {
    props.onContextmenu(e, row)
  }
}

function resolveValue<T, A = undefined>(prop: T | ((arg: A) => T), arg?: A): T | undefined {
  if (typeof prop === 'function') {
    // @ts-expect-error: TS can't know if prop is a function here
    return prop(arg)
  }
  return prop
}

function getColumnStyles(column: Column<T>): Record<string, string> {
  const styles: Record<string, string> = {}

  const pinned = column.getIsPinned()
  if (pinned === 'left') {
    styles.left = `${column.getStart('left')}px`
  } else if (pinned === 'right') {
    styles.right = `${column.getAfter('right')}px`
  }

  return styles
}

watch(() => props.data, () => {
  data.value = props.data ? [...props.data] : []
}, props.watchOptions)

defineExpose({
  get $el() {
    return rootRef.value?.$el as HTMLElement
  },
  tableRef,
  tableApi
})
</script>

<template>
  <DefineRowTemplate v-slot="{ row, style }">
    <tr
      :data-selected="row.getIsSelected()"
      :data-selectable="!!props.onSelect || !!props.onHover || !!props.onContextmenu"
      :data-expanded="row.getIsExpanded()"
      :role="props.onSelect ? 'button' : undefined"
      :tabindex="props.onSelect ? 0 : undefined"
      data-slot="tr"
      :class="ui.tr({
        class: [
          props.ui?.tr,
          resolveValue(tableApi.options.meta?.class?.tr, row)
        ]
      })"
      :style="[resolveValue(tableApi.options.meta?.style?.tr, row), style]"
      @click="onRowSelect($event, row)"
      @pointerenter="onRowHover($event, row)"
      @pointerleave="onRowHover($event, null)"
      @contextmenu="onRowContextmenu($event, row)"
    >
      <td
        v-for="cell in row.getVisibleCells()"
        :key="cell.id"
        :data-pinned="cell.column.getIsPinned()"
        :colspan="resolveValue(cell.column.columnDef.meta?.colspan?.td, cell)"
        :rowspan="resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell)"
        data-slot="td"
        :class="ui.td({
          class: [
            props.ui?.td,
            resolveValue(cell.column.columnDef.meta?.class?.td, cell)
          ],
          pinned: !!cell.column.getIsPinned()
        })"
        :style="[
          getColumnStyles(cell.column),
          resolveValue(cell.column.columnDef.meta?.style?.td, cell)
        ]"
      >
        <slot :name="`${cell.column.id}-cell`" v-bind="cell.getContext()">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </slot>
      </td>
    </tr>

    <tr v-if="row.getIsExpanded()" data-slot="tr" :class="ui.tr({ class: [props.ui?.tr] })">
      <td :colspan="row.getAllCells().length" data-slot="td" :class="ui.td({ class: [props.ui?.td] })">
        <slot name="expanded" :row="row" />
      </td>
    </tr>
  </DefineRowTemplate>

  <DefineTableTemplate>
    <table ref="tableRef" data-slot="base" :class="ui.base({ class: [props.ui?.base] })">
      <caption v-if="caption || !!slots.caption" data-slot="caption" :class="ui.caption({ class: [props.ui?.caption] })">
        <slot name="caption">
          {{ caption }}
        </slot>
      </caption>

      <thead data-slot="thead" :class="ui.thead({ class: [props.ui?.thead] })">
        <tr v-for="headerGroup in tableApi.getHeaderGroups()" :key="headerGroup.id" data-slot="tr" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :scope="header.colSpan > 1 ? 'colgroup' : 'col'"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            data-slot="th"
            :class="ui.th({
              class: [
                props.ui?.th,
                resolveValue(header.column.columnDef.meta?.class?.th, header)
              ],
              pinned: !!header.column.getIsPinned()
            })"
            :style="[
              getColumnStyles(header.column),
              resolveValue(header.column.columnDef.meta?.style?.th, header)
            ]"
          >
            <slot :name="`${header.id}-header`" v-bind="header.getContext()">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </slot>
          </th>
        </tr>

        <tr data-slot="separator" :class="ui.separator({ class: [props.ui?.separator] })" />
      </thead>

      <tbody data-slot="tbody" :class="ui.tbody({ class: [props.ui?.tbody] })">
        <slot name="body-top" />

        <template v-if="rows.length">
          <template v-if="virtualizer">
            <template v-for="(virtualRow, index) in virtualizer.getVirtualItems()" :key="rows[virtualRow.index]?.id">
              <ReuseRowTemplate
                :row="rows[virtualRow.index]!"
                :style="{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                }"
              />
            </template>
          </template>

          <template v-else>
            <ReuseRowTemplate v-for="row in rows" :key="row.id" :row="row" />
          </template>
        </template>

        <tr v-else-if="loading && !!slots['loading']">
          <td :colspan="tableApi.getAllLeafColumns().length" data-slot="loading" :class="ui.loading({ class: props.ui?.loading })">
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td :colspan="tableApi.getAllLeafColumns().length" data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty">
              {{ empty || t('table.noData') }}
            </slot>
          </td>
        </tr>

        <slot name="body-bottom" />
      </tbody>

      <tfoot
        v-if="hasFooter"
        data-slot="tfoot"
        :class="ui.tfoot({ class: [props.ui?.tfoot] })"
        :style="virtualizer ? {
          transform: `translateY(${virtualizer.getTotalSize() - renderedSize}px)`
        } : undefined"
      >
        <tr data-slot="separator" :class="ui.separator({ class: [props.ui?.separator] })" />

        <tr v-for="footerGroup in tableApi.getFooterGroups()" :key="footerGroup.id" data-slot="tr" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            data-slot="th"
            :class="ui.th({
              class: [
                props.ui?.th,
                resolveValue(header.column.columnDef.meta?.class?.th, header)
              ],
              pinned: !!header.column.getIsPinned()
            })"
            :style="[
              getColumnStyles(header.column),
              resolveValue(header.column.columnDef.meta?.style?.th, header)
            ]"
          >
            <slot :name="`${header.id}-footer`" v-bind="header.getContext()">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.footer" :props="header.getContext()" />
            </slot>
          </th>
        </tr>
      </tfoot>
    </table>
  </DefineTableTemplate>

  <Primitive ref="rootRef" :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div
      v-if="virtualizer"
      :style="{
        height: `${virtualizer.getTotalSize()}px`
      }"
    >
      <ReuseTableTemplate />
    </div>
    <ReuseTableTemplate v-else />
  </Primitive>
</template>
