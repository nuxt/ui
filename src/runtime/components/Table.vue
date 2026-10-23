<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AriaAttributes, Ref, WatchOptions, ComponentPublicInstance, VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type {
  BuiltInFilterFn,
  BuiltInSortFn,
  Cell,
  CellData,
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  ExpandedState,
  FilterFn,
  GroupingState,
  Header,
  HeaderContext,
  PaginationState,
  Row,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortFn,
  SortingState,
  StockFeatures,
  TableFeatures as TanStackTableFeatures,
  TableMeta,
  TableOptions_ColumnFiltering,
  TableOptions_ColumnGrouping,
  TableOptions_ColumnPinning,
  TableOptions_ColumnResizing,
  TableOptions_ColumnSizing,
  TableOptions_ColumnVisibility,
  TableOptions_GlobalFiltering,
  TableOptions_RowExpanding,
  TableOptions_RowPagination,
  TableOptions_RowPinning,
  TableOptions_RowSelection,
  TableOptions_RowSorting,
  TableOptions_Table,
  Updater,
  VueTable,
  columnResizingState
} from '@tanstack/vue-table'
import type { Virtualizer, VirtualizerOptions } from '@tanstack/vue-virtual'
import theme from '../theme/table'
import type { TableHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

declare module '@tanstack/table-core' {

  interface ColumnMeta<TFeatures extends TanStackTableFeatures, TData extends RowData, TValue extends CellData> {
    class?: {
      th?: string | ((cell: Header<TFeatures, TData, TValue>) => string)
      td?: string | ((cell: Cell<TFeatures, TData, TValue>) => string)
    }
    style?: {
      th?: string | Record<string, string> | ((cell: Header<TFeatures, TData, TValue>) => string | Record<string, string>)
      td?: string | Record<string, string> | ((cell: Cell<TFeatures, TData, TValue>) => string | Record<string, string>)
    }
    colspan?: {
      td?: string | ((cell: Cell<TFeatures, TData, TValue>) => string)
    }
    rowspan?: {
      td?: string | ((cell: Cell<TFeatures, TData, TValue>) => string)
    }

  }

  interface TableMeta<TFeatures extends TanStackTableFeatures, TData extends RowData> {
    class?: {
      tr?: string | ((row: Row<TFeatures, TData>) => string)
    }
    style?: {
      tr?: string | Record<string, string> | ((row: Row<TFeatures, TData>) => string | Record<string, string>)
    }
  }

  // The default features register every built-in sort and filter function, so their names stay valid on column definitions.
  interface SortFns extends Record<BuiltInSortFn, SortFn<any, any>> {}
  interface FilterFns extends Record<BuiltInFilterFn, FilterFn<any, any>> {}

}

type Table = ComponentConfig<typeof theme, AppConfig, 'table'>

/**
 * The feature set the table types are written against. Every stock feature is included, so column
 * definitions and `tableApi` expose the APIs of the features an app registers through the `features` prop.
 */
export type TableFeatures = StockFeatures
export type TableRow<T extends TableData> = Row<TableFeatures, T>
export type TableData = RowData
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<TableFeatures, T, D>

export interface TableOptions<T extends TableData = TableData> {
  autoResetAll?: TableOptions_Table<TableFeatures, T>['autoResetAll']
  initialState?: TableOptions_Table<TableFeatures, T>['initialState']
  mergeOptions?: TableOptions_Table<TableFeatures, T>['mergeOptions']
  state?: TableOptions_Table<TableFeatures, T>['state']
  defaultColumn?: Partial<TableColumn<T>>
  getRowId?: (originalRow: T, index: number, parent?: TableRow<T>) => string
  getSubRows?: (originalRow: T, index: number) => undefined | ReadonlyArray<T>
  renderFallbackValue?: any
  debugAll?: boolean
  debugCells?: boolean
  debugColumns?: boolean
  debugHeaders?: boolean
  debugRows?: boolean
  debugTable?: boolean
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
  meta?: TableMeta<TableFeatures, T>
  /**
   * Enable virtualization for large datasets.
   * Note: row pinning is not supported when virtualization is enabled.
   * @see https://tanstack.com/virtual/v3/docs/api/virtualizer#options
   * @defaultValue false
   */
  virtualize?: boolean | (Partial<Omit<VirtualizerOptions<Element, Element>, 'count' | 'estimateSize' | 'overscan'>> & {
    /**
     * Virtualize against an external scroll element instead of the table's own root.
     * Pair with `scrollMargin` set to the table's offset from the scroll element's start.
     * @defaultValue undefined
     */
    getScrollElement?: () => Element | null
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
   * Table features registered on top of the default ones (sorting, column and global filtering, expanding, row selection, column visibility, pinning and sizing, row pinning).
   * Register pagination, grouping, faceting or column ordering here with their row models, e.g. `{ rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() }`.
   * Read once when the table is created.
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/features)
   */
  features?: TanStackTableFeatures
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/global-filtering#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/global-filtering)
   */
  globalFilterOptions?: Omit<TableOptions_GlobalFiltering<TableFeatures, T>, 'onGlobalFilterChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/column-filtering#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/column-filtering)
   */
  columnFiltersOptions?: Omit<TableOptions_ColumnFiltering<TableFeatures, T>, 'onColumnFiltersChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/column-pinning#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/column-pinning)
   */
  columnPinningOptions?: Omit<TableOptions_ColumnPinning, 'onColumnPinningChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/column-sizing#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/column-sizing)
   */
  columnSizingOptions?: Omit<TableOptions_ColumnSizing & TableOptions_ColumnResizing, 'onColumnSizingChange' | 'onColumnResizingChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/column-visibility#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/column-visibility)
   */
  visibilityOptions?: Omit<TableOptions_ColumnVisibility, 'onColumnVisibilityChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/sorting#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/sorting)
   */
  sortingOptions?: Omit<TableOptions_RowSorting, 'onSortingChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/grouping#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/grouping)
   */
  groupingOptions?: Omit<TableOptions_ColumnGrouping, 'onGroupingChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/expanding#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/expanding)
   */
  expandedOptions?: Omit<TableOptions_RowExpanding<TableFeatures, T>, 'onExpandedChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/row-selection#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/row-selection)
   */
  rowSelectionOptions?: Omit<TableOptions_RowSelection<TableFeatures, T>, 'onRowSelectionChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/row-pinning#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/row-pinning)
   */
  rowPinningOptions?: Omit<TableOptions_RowPinning<TableFeatures, T>, 'onRowPinningChange'>
  /**
   * @see [API](https://tanstack.com/table/latest/docs/api/features/pagination#table-options)
   * @see [Guide](https://tanstack.com/table/latest/docs/guide/pagination)
   */
  paginationOptions?: Omit<TableOptions_RowPagination, 'onPaginationChange'>
  onSelect?: (e: Event, row: TableRow<T>) => void
  onHover?: (e: Event, row: TableRow<T> | null) => void
  onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>
  class?: any
  ui?: Table['slots']
}

type DynamicHeaderFooterSlots<T extends TableData, K = keyof T> = Record<`${K extends string ? K : never}-header` | `${K extends string ? K : never}-footer` | (string & {}), (props: HeaderContext<TableFeatures, T, unknown>) => VNode[]>
type DynamicCellSlots<T extends TableData, K = keyof T> = Record<`${K extends string ? K : never}-cell` | (string & {}), (props: CellContext<TableFeatures, T, unknown>) => VNode[]>

export type TableSlots<T extends TableData = TableData> = {
  'expanded'?: (props: { row: TableRow<T> }) => VNode[]
  'empty'?: (props?: {}) => VNode[]
  'loading'?: (props?: {}) => VNode[]
  'caption'?: (props?: {}) => VNode[]
  'body-top'?: (props?: {}) => VNode[]
  'body-bottom'?: (props?: {}) => VNode[]
} & DynamicHeaderFooterSlots<T> & DynamicCellSlots<T>

</script>

<script setup lang="ts" generic="T extends TableData">
import { computed, useTemplateRef, watch, toRef, onBeforeUnmount, h, isVNode } from 'vue'
import { Primitive } from 'reka-ui'
import { upperFirst } from 'scule'
import { defu } from 'defu'
import {
  useTable,
  tableFeatures,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  sortFns
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { reactivePick, createReusableTemplate, createRef } from '@vueuse/core'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<TableProps<T>>(), {
  watchOptions: () => ({
    deep: true
  }),
  virtualize: false
})
const slots = defineSlots<TableSlots<T>>()

const props = useComponentProps<TableProps<T>>('table', _props, theme)

const { t } = useLocale()
const overrides = useComponentOverrides((ui: Table['AppConfig']['ui']) => ui.table)

// eslint-disable-next-line vue/no-dupe-keys
const data = createRef(props.data ?? [], props.watchOptions?.deep !== false)
// eslint-disable-next-line vue/no-dupe-keys
const meta = computed(() => props.meta ?? {})
// TanStack resolves each column as `{ ...defaultColumn, ...columnDef }`, so any key set here shadows `defaultColumn`.
// The fallback `header` and `cell` are only injected when `defaultColumn` doesn't provide its own.
// eslint-disable-next-line vue/no-dupe-keys
const columns = computed<TableColumn<T>[]>(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey: string) => ({
  accessorKey,
  ...(props.defaultColumn?.header === undefined && { header: upperFirst(accessorKey) })
}))))

function processColumns(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns.map((column) => {
    const col = { ...column } as TableColumn<T>

    if ('columns' in col && col.columns) {
      col.columns = processColumns(col.columns as TableColumn<T>[])
    }

    if (!col.cell && !props.defaultColumn?.cell) {
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

// When an external scroll element is provided, it owns the scroll (the root grows inline).
const isExternalScroll = computed(() => typeof props.virtualize === 'object' && !!props.virtualize.getScrollElement)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  sticky: props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation,
  externalScroll: isExternalScroll.value
}))

const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate()
const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate<{ row: TableRow<T>, index?: number }>({
  props: {
    row: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
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
const columnVisibilityState = defineModel<ColumnVisibilityState>('columnVisibility')
const columnPinningState = defineModel<ColumnPinningState>('columnPinning')
const columnSizingState = defineModel<ColumnSizingState>('columnSizing')
const columnResizingState = defineModel<columnResizingState>('columnResizing')
const rowSelectionState = defineModel<RowSelectionState>('rowSelection')
const rowPinningState = defineModel<RowPinningState>('rowPinning')
const sortingState = defineModel<SortingState>('sorting')
const groupingState = defineModel<GroupingState>('grouping')
const expandedState = defineModel<ExpandedState>('expanded')
const paginationState = defineModel<PaginationState>('pagination')

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')

const tableProps = useForwardProps(reactivePick(props, 'autoResetAll', 'debugAll', 'debugCells', 'debugColumns', 'debugHeaders', 'debugRows', 'debugTable', 'defaultColumn', 'getRowId', 'getSubRows', 'initialState', 'mergeOptions', 'renderFallbackValue'))

// What the table renders itself. Pagination, grouping, faceting and column ordering are registered through the `features` prop.
const defaultFeatures = {
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns,
  sortFns
}

const registeredFeatures = tableFeatures({ ...defaultFeatures, ...props.features }) as TableFeatures

const models = {
  globalFilter: globalFilterState,
  columnFilters: columnFiltersState,
  columnOrder: columnOrderState,
  columnVisibility: columnVisibilityState,
  columnPinning: columnPinningState,
  columnSizing: columnSizingState,
  columnResizing: columnResizingState,
  rowSelection: rowSelectionState,
  rowPinning: rowPinningState,
  sorting: sortingState,
  grouping: groupingState,
  expanded: expandedState,
  pagination: paginationState
} as const

// TanStack falls back to the initial state for a slice that is present but `undefined`, so only bound models are passed.
const state = computed(() => {
  const state: Record<string, unknown> = { ...props.state }
  for (const [key, model] of Object.entries(models)) {
    if (model.value !== undefined) {
      state[key] = model.value
    }
  }
  return state
})

const tableApi: VueTable<TableFeatures, T> = useTable<TableFeatures, T>({
  ...tableProps.value,
  features: registeredFeatures,
  data,
  columns,
  meta: meta.value,
  ...(props.globalFilterOptions || {}),
  ...(globalFilterState.value !== undefined && { onGlobalFilterChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, globalFilterState) }),
  ...(props.columnFiltersOptions || {}),
  ...(columnFiltersState.value !== undefined && { onColumnFiltersChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnFiltersState) }),
  ...(columnOrderState.value !== undefined && { onColumnOrderChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnOrderState) }),
  ...(props.visibilityOptions || {}),
  ...(columnVisibilityState.value !== undefined && { onColumnVisibilityChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnVisibilityState) }),
  ...(props.columnPinningOptions || {}),
  ...(columnPinningState.value !== undefined && { onColumnPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnPinningState) }),
  ...(props.columnSizingOptions || {}),
  ...(columnSizingState.value !== undefined && { onColumnSizingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnSizingState) }),
  ...(columnResizingState.value !== undefined && { onColumnResizingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnResizingState) }),
  ...(props.rowSelectionOptions || {}),
  ...(rowSelectionState.value !== undefined && { onRowSelectionChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowSelectionState) }),
  ...(props.rowPinningOptions || {}),
  ...(rowPinningState.value !== undefined && { onRowPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowPinningState) }),
  ...(props.sortingOptions || {}),
  ...(sortingState.value !== undefined && { onSortingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, sortingState) }),
  ...(props.groupingOptions || {}),
  ...(groupingState.value !== undefined && { onGroupingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, groupingState) }),
  ...(props.expandedOptions || {}),
  ...(expandedState.value !== undefined && { onExpandedChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, expandedState) }),
  ...(props.paginationOptions || {}),
  ...(paginationState.value !== undefined && { onPaginationChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, paginationState) }),
  state
} as any)

// TanStack fills the rows above a shallow column with placeholders and puts its header in the bottom row.
// Keep only the top placeholder of each chain (header groups are numbered by column depth) and render the real header there with a `rowspan`.
const headerGroups = computed(() => tableApi.getHeaderGroups().map(headerGroup => ({
  ...headerGroup,
  headers: headerGroup.headers
    .filter(header => header.column.depth >= headerGroup.depth)
    .map((header) => {
      let rowSpan = 1

      while (header.isPlaceholder && header.subHeaders[0]) {
        rowSpan++
        header = header.subHeaders[0]
      }

      return { header, rowSpan }
    })
})))

const rows = computed(() => tableApi.getRowModel().rows)
const topRows = computed(() => props.virtualize ? [] : tableApi.getTopRows())
const bottomRows = computed(() => props.virtualize ? [] : tableApi.getBottomRows())
const centerRows = computed(() => topRows.value.length || bottomRows.value.length ? tableApi.getCenterRows() : rows.value)

const virtualizerProps = toRef(() => defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
  estimateSize: 65,
  overscan: 12
}))

// Rows must carry the attribute the virtualizer reads their index from when measuring them.
const indexAttribute = computed(() => virtualizerProps.value.indexAttribute ?? 'data-index')

const getScrollElement = () => (isExternalScroll.value ? virtualizerProps.value.getScrollElement?.() : rootRef.value?.$el) ?? null
// Offset applied to the spacer rows: `scrollMargin` is the table's offset within the scroll element (0 unless set).
const scrollMargin = computed(() => virtualizerProps.value.scrollMargin ?? 0)

// Key measurements by row id so cached heights follow their rows through sorting and filtering.
// The virtualizer memoizes measurements on the `getItemKey` reference, so a new function (wrapping a custom one too) is created for each set of rows.
const getItemKey = computed(() => {
  const rows = centerRows.value
  const getKey = virtualizerProps.value.getItemKey
  return getKey ? (index: number) => getKey(index) : (index: number) => rows[index]?.id ?? index
})

const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get count() {
    return centerRows.value.length
  },
  get scrollMargin() {
    return scrollMargin.value
  },
  get getItemKey() {
    return getItemKey.value
  },
  measureElement: measureRowElement,
  getScrollElement,
  estimateSize: (index: number) => {
    const estimate = virtualizerProps.value.estimateSize
    return typeof estimate === 'function' ? estimate(index) : estimate
  }
})

const virtualItems = computed(() => virtualizer ? virtualizer.value.getVirtualItems() : [])

// `start`/`end` include `scrollMargin`; exclude it from the spacers so the rows sit inline below preceding content.
const virtualPaddingTop = computed(() => (virtualItems.value[0]?.start ?? 0) - scrollMargin.value)

const virtualPaddingBottom = computed(() => {
  if (!virtualizer || !virtualItems.value.length) return 0
  return virtualizer.value.getTotalSize() - (virtualItems.value[virtualItems.value.length - 1]?.end ?? 0) + scrollMargin.value
})

// The instance never changes: reading it once keeps the row template from subscribing to every virtualizer update (e.g. on scroll).
const virtualizerInstance = virtualizer ? virtualizer.value : undefined

// Register each rendered row with the virtualizer so its actual height is measured (and re-measured on resize).
function measureRow(el: Element | ComponentPublicInstance | null) {
  if (el instanceof Element) {
    virtualizerInstance?.measureElement(el)
  }
}

const measureRowRef = virtualizerInstance ? measureRow : undefined

// An expanded `<tr>` belongs to its row's virtual item, so its height is added to the row's (measured by a custom `measureElement` if given). Maps it to its row's `<tr>`.
const expandedRows = new WeakMap<Element, Element>()
let expandedRowsObserver: ResizeObserver | undefined

function measureRowElement(el: Element, entry: ResizeObserverEntry | undefined, instance: Virtualizer<Element, Element>) {
  const measure = virtualizerProps.value.measureElement
  const height = measure ? measure(el, entry, instance) : entry?.borderBoxSize?.[0]?.blockSize ?? (el as HTMLElement).offsetHeight
  const expanded = el.nextElementSibling
  return Math.round(height + (expanded && expandedRows.get(expanded) === el ? (expanded as HTMLElement).offsetHeight : 0))
}

function remeasureRow(el: Element | null | undefined) {
  if (!el?.isConnected || !virtualizer) return
  const instance = virtualizer.value
  instance.resizeItem(instance.indexFromElement(el), instance.options.measureElement(el, undefined, instance))
}

function onExpandedRowMounted({ el }: VNode) {
  if (!virtualizer || !(el instanceof Element) || !el.previousElementSibling) return
  expandedRows.set(el, el.previousElementSibling)
  remeasureRow(el.previousElementSibling)
  if (typeof ResizeObserver === 'undefined') return
  // Keep the row's size in sync when the expanded content resizes (e.g. async content).
  expandedRowsObserver ??= new ResizeObserver(entries => entries.forEach(entry => remeasureRow(expandedRows.get(entry.target))))
  expandedRowsObserver.observe(el)
}

function onExpandedRowUnmounted({ el }: VNode) {
  if (!(el instanceof Element)) return
  const row = expandedRows.get(el)
  expandedRows.delete(el)
  expandedRowsObserver?.unobserve(el)
  // Collapsed while its row stays rendered: shrink it back to the row's own height.
  remeasureRow(row)
}

onBeforeUnmount(() => expandedRowsObserver?.disconnect())

// TanStack's `FlexRender` passes an array returned by a column template to `h()` as if it were a component, so arrays are returned as they are.
function FlexRender({ render, props }: { render: unknown, props: unknown }) {
  const rendered = typeof render === 'function' ? render(props) : render
  if (rendered === null || (typeof rendered !== 'object' && typeof rendered !== 'function') || Array.isArray(rendered) || isVNode(rendered)) {
    return rendered
  }
  return h(rendered as any, props as any)
}

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

function onRowSelect(e: Event, row: TableRow<T>) {
  if (!props.onSelect) {
    return
  }
  const target = e.target as HTMLElement
  const isInteractive = target.closest('a, button, input, label, select, textarea')
  if (isInteractive) {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  if ((e as KeyboardEvent).repeat) {
    return
  }

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

function getColumnStyles(column: Column<TableFeatures, T, unknown>): Record<string, string> {
  const styles: Record<string, string> = {}

  const pinned = column.getIsPinned()
  if (pinned === 'start') {
    styles.insetInlineStart = `${column.getStart('start')}px`
  } else if (pinned === 'end') {
    styles.insetInlineEnd = `${column.getAfter('end')}px`
  }

  return styles
}

// `getCanSort()` is true for every accessor column, so it cannot tell a column that offers sort UI
// from a plain one, and an explicit `enableSorting: true` can still come from `defaultColumn` or be
// overridden by `sortingOptions`. A header is sortable only when both agree.
function isSortable(column: Column<TableFeatures, T, unknown>) {
  return column.columnDef.enableSorting === true && column.getCanSort()
}

function getAriaSort(header: Header<TableFeatures, T, unknown>): AriaAttributes['aria-sort'] {
  if (header.isPlaceholder || !isSortable(header.column)) {
    return undefined
  }

  const sorted = header.column.getIsSorted()
  if (!sorted) {
    return 'none'
  }

  // `aria-sort` is a single-column pattern, so the direction goes to the first sort key that has a
  // header on screen. Keys for an unknown id, a hidden column or a column with no sort UI are
  // skipped, otherwise every header would report `none` while the rows are sorted.
  const sortableIds = new Set(tableApi.getVisibleLeafColumns()
    .filter(isSortable)
    .map(column => column.id))
  const primary = tableApi.atoms.sorting.get().find(({ id }) => sortableIds.has(id))

  if (primary?.id !== header.column.id) {
    return 'none'
  }

  return sorted === 'asc' ? 'ascending' : 'descending'
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
  <DefineRowTemplate v-slot="{ row, index }">
    <tr
      :ref="measureRowRef"
      :[indexAttribute]="index"
      :data-selected="row.getIsSelected()"
      :data-selectable="!!props.onSelect || !!props.onHover || !!props.onContextmenu"
      :data-expanded="row.getIsExpanded()"
      :data-pinned="row.getIsPinned() || undefined"
      :tabindex="props.onSelect ? 0 : undefined"
      data-slot="table-tr"
      :class="ui.tr({
        class: [
          props.ui?.tr,
          resolveValue(tableApi.options.meta?.class?.tr, row)
        ]
      })"
      :style="resolveValue(tableApi.options.meta?.style?.tr, row)"
      @click="onRowSelect($event, row)"
      @keydown.self.exact.enter.space="onRowSelect($event, row)"
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
        data-slot="table-td"
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

    <tr
      v-if="row.getIsExpanded()"
      data-slot="table-tr"
      :class="ui.tr({ class: [props.ui?.tr] })"
      @vue:mounted="onExpandedRowMounted"
      @vue:unmounted="onExpandedRowUnmounted"
    >
      <td :colspan="row.getVisibleCells().length" data-slot="table-td" :class="ui.td({ class: [props.ui?.td] })">
        <slot name="expanded" :row="row" />
      </td>
    </tr>
  </DefineRowTemplate>

  <DefineTableTemplate>
    <table ref="tableRef" data-slot="table-base" :class="ui.base({ class: [props.ui?.base] })">
      <caption v-if="props.caption || !!slots.caption" data-slot="table-caption" :class="ui.caption({ class: [props.ui?.caption] })">
        <slot name="caption">
          {{ props.caption }}
        </slot>
      </caption>

      <thead data-slot="table-thead" :class="ui.thead({ class: [props.ui?.thead] })">
        <tr v-for="headerGroup in headerGroups" :key="headerGroup.id" data-slot="table-tr" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="{ header, rowSpan } in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :scope="header.colSpan > 1 ? 'colgroup' : 'col'"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="rowSpan > 1 ? rowSpan : undefined"
            :aria-sort="getAriaSort(header)"
            data-slot="table-th"
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

        <tr data-slot="table-separator" :class="ui.separator({ class: [props.ui?.separator] })" />
      </thead>

      <tbody data-slot="table-tbody" :class="ui.tbody({ class: [props.ui?.tbody] })">
        <slot name="body-top" />

        <template v-if="rows.length">
          <ReuseRowTemplate v-for="row in topRows" :key="row.id" :row="row" />

          <template v-if="virtualizer">
            <tr v-if="virtualPaddingTop > 0" :style="{ height: `${virtualPaddingTop}px` }" aria-hidden="true">
              <td :colspan="tableApi.getVisibleLeafColumns().length" />
            </tr>
            <template v-for="virtualRow in virtualItems" :key="centerRows[virtualRow.index]?.id ?? `virtual-${virtualRow.index}`">
              <ReuseRowTemplate
                v-if="centerRows[virtualRow.index]"
                :row="centerRows[virtualRow.index]!"
                :index="virtualRow.index"
              />
            </template>
            <tr v-if="virtualPaddingBottom > 0" :style="{ height: `${virtualPaddingBottom}px` }" aria-hidden="true">
              <td :colspan="tableApi.getVisibleLeafColumns().length" />
            </tr>
          </template>

          <template v-else>
            <ReuseRowTemplate v-for="row in centerRows" :key="row.id" :row="row" />
          </template>

          <ReuseRowTemplate v-for="row in bottomRows" :key="row.id" :row="row" />
        </template>

        <tr v-else-if="props.loading && !!slots['loading']">
          <td :colspan="tableApi.getVisibleLeafColumns().length" data-slot="table-loading" :class="ui.loading({ class: props.ui?.loading })">
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td :colspan="tableApi.getVisibleLeafColumns().length" data-slot="table-empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty">
              {{ props.empty || t('table.noData') }}
            </slot>
          </td>
        </tr>

        <slot name="body-bottom" />
      </tbody>

      <tfoot
        v-if="hasFooter"
        data-slot="table-tfoot"
        :class="ui.tfoot({ class: [props.ui?.tfoot] })"
      >
        <tr data-slot="table-separator" :class="ui.separator({ class: [props.ui?.separator] })" />

        <tr v-for="footerGroup in tableApi.getFooterGroups()" :key="footerGroup.id" data-slot="table-tr" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            data-slot="table-th"
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

  <Primitive ref="rootRef" :as="props.as" data-slot="table" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ReuseTableTemplate />
  </Primitive>
</template>
