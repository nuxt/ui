import type { WatchOptions, VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { Cell, CellContext, ColumnDef, ColumnFiltersOptions, ColumnFiltersState, ColumnOrderState, ColumnPinningOptions, ColumnPinningState, ColumnSizingInfoState, ColumnSizingOptions, ColumnSizingState, CoreOptions, ExpandedOptions, ExpandedState, FacetedOptions, GlobalFilterOptions, GroupingOptions, GroupingState, Header, HeaderContext, PaginationOptions, PaginationState, Row, RowData, RowPinningOptions, RowPinningState, RowSelectionOptions, RowSelectionState, SortingOptions, SortingState, TableMeta, VisibilityOptions, VisibilityState } from '@tanstack/vue-table';
import type { VirtualizerOptions } from '@tanstack/vue-virtual';
import theme from '#build/ui/table';
import type { TableHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        class?: {
            th?: string | ((cell: Header<TData, TValue>) => string);
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
        style?: {
            th?: string | Record<string, string> | ((cell: Header<TData, TValue>) => string | Record<string, string>);
            td?: string | Record<string, string> | ((cell: Cell<TData, TValue>) => string | Record<string, string>);
        };
        colspan?: {
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
        rowspan?: {
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
    }
    interface TableMeta<TData> {
        class?: {
            tr?: string | ((row: Row<TData>) => string);
        };
        style?: {
            tr?: string | Record<string, string> | ((row: Row<TData>) => string | Record<string, string>);
        };
    }
}
type Table = ComponentConfig<typeof theme, AppConfig, 'table'>;
export type TableRow<T> = Row<T>;
export type TableData = RowData;
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<T, D>;
export interface TableOptions<T extends TableData = TableData> extends Omit<CoreOptions<T>, 'data' | 'columns' | 'getCoreRowModel' | 'state' | 'onStateChange' | 'renderFallbackValue'> {
    state?: CoreOptions<T>['state'];
    onStateChange?: CoreOptions<T>['onStateChange'];
    renderFallbackValue?: CoreOptions<T>['renderFallbackValue'];
}
export interface TableProps<T extends TableData = TableData> extends TableOptions<T>, /** @vue-ignore */ TableHTMLAttributes {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    data?: T[];
    columns?: TableColumn<T>[];
    caption?: string;
    meta?: TableMeta<T>;
    /**
     * Enable virtualization for large datasets.
     * Note: row pinning is not supported when virtualization is enabled.
     * @see https://tanstack.com/virtual/latest/docs/api/virtualizer#options
     * @defaultValue false
     */
    virtualize?: boolean | (Partial<Omit<VirtualizerOptions<Element, Element>, 'getScrollElement' | 'count' | 'estimateSize' | 'overscan'>> & {
        /**
         * Number of items rendered outside the visible area
         * @defaultValue 12
         */
        overscan?: number;
        /**
         * Estimated size (in px) of each item, or a function that returns the size for a given index
         * @defaultValue 65
         */
        estimateSize?: number | ((index: number) => number);
    });
    /**
     * The text to display when the table is empty.
     * @defaultValue t('table.noData')
     */
    empty?: string;
    /**
     * Whether the table should have a sticky header or footer. True for both, 'header' for header only, 'footer' for footer only.
     * @defaultValue false
     */
    sticky?: boolean | 'header' | 'footer';
    /** Whether the table should be in loading state. */
    loading?: boolean;
    /**
     * @defaultValue 'primary'
     */
    loadingColor?: Table['variants']['loadingColor'];
    /**
     * @defaultValue 'carousel'
     */
    loadingAnimation?: Table['variants']['loadingAnimation'];
    /**
     * Use the `watchOptions` prop to customize reactivity (for ex: disable deep watching for changes in your data or limiting the max traversal depth). This can improve performance by reducing unnecessary re-renders, but it should be used with caution as it may lead to unexpected behavior if not managed properly.
     * @see [API](https://vuejs.org/api/options-state.html#watch)
     * @see [Guide](https://vuejs.org/guide/essentials/watchers.html)
     * @defaultValue { deep: true }
     */
    watchOptions?: WatchOptions;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
     */
    globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
     */
    columnFiltersOptions?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
     */
    columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
     */
    columnSizingOptions?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
     */
    visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/sorting#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
     */
    sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/grouping#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
     */
    groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/expanding#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
     */
    expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/row-selection#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
     */
    rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
     */
    rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/pagination#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
     */
    paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
     */
    facetedOptions?: FacetedOptions<T>;
    onSelect?: (e: Event, row: TableRow<T>) => void;
    onHover?: (e: Event, row: TableRow<T> | null) => void;
    onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>;
    class?: any;
    ui?: Table['slots'];
}
type DynamicHeaderFooterSlots<T, K = keyof T> = Record<`${K extends string ? K : never}-header` | `${K extends string ? K : never}-footer` | (string & {}), (props: HeaderContext<T, unknown>) => VNode[]>;
type DynamicCellSlots<T, K = keyof T> = Record<`${K extends string ? K : never}-cell` | (string & {}), (props: CellContext<T, unknown>) => VNode[]>;
export type TableSlots<T extends TableData = TableData> = {
    'expanded'?: (props: {
        row: Row<T>;
    }) => VNode[];
    'empty'?: (props?: {}) => VNode[];
    'loading'?: (props?: {}) => VNode[];
    'caption'?: (props?: {}) => VNode[];
    'body-top'?: (props?: {}) => VNode[];
    'body-bottom'?: (props?: {}) => VNode[];
} & DynamicHeaderFooterSlots<T> & DynamicCellSlots<T>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends TableData>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(TableProps<T> & {
        globalFilter?: string;
        columnFilters?: ColumnFiltersState;
        columnOrder?: ColumnOrderState;
        columnVisibility?: VisibilityState;
        columnPinning?: ColumnPinningState;
        columnSizing?: ColumnSizingState;
        columnSizingInfo?: ColumnSizingInfoState;
        rowSelection?: RowSelectionState;
        rowPinning?: RowPinningState;
        sorting?: SortingState;
        grouping?: GroupingState;
        expanded?: ExpandedState;
        pagination?: PaginationState;
    }) & {
        "onUpdate:globalFilter"?: ((value: string | undefined) => any) | undefined;
        "onUpdate:columnFilters"?: ((value: ColumnFiltersState | undefined) => any) | undefined;
        "onUpdate:columnOrder"?: ((value: ColumnOrderState | undefined) => any) | undefined;
        "onUpdate:columnVisibility"?: ((value: VisibilityState | undefined) => any) | undefined;
        "onUpdate:columnPinning"?: ((value: ColumnPinningState | undefined) => any) | undefined;
        "onUpdate:columnSizing"?: ((value: ColumnSizingState | undefined) => any) | undefined;
        "onUpdate:columnSizingInfo"?: ((value: ColumnSizingInfoState | undefined) => any) | undefined;
        "onUpdate:rowSelection"?: ((value: RowSelectionState | undefined) => any) | undefined;
        "onUpdate:rowPinning"?: ((value: RowPinningState | undefined) => any) | undefined;
        "onUpdate:sorting"?: ((value: SortingState | undefined) => any) | undefined;
        "onUpdate:grouping"?: ((value: GroupingState | undefined) => any) | undefined;
        "onUpdate:expanded"?: ((value: ExpandedState | undefined) => any) | undefined;
        "onUpdate:pagination"?: ((value: PaginationState | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        readonly $el: HTMLElement;
        tableRef: Readonly<import("vue").ShallowRef<HTMLTableElement | null>>;
        tableApi: import("@tanstack/table-core").Table<T>;
    }>) => void;
    attrs: any;
    slots: TableSlots<T>;
    emit: ((event: "update:globalFilter", value: string | undefined) => void) & ((event: "update:columnFilters", value: ColumnFiltersState | undefined) => void) & ((event: "update:columnOrder", value: ColumnOrderState | undefined) => void) & ((event: "update:columnVisibility", value: VisibilityState | undefined) => void) & ((event: "update:columnPinning", value: ColumnPinningState | undefined) => void) & ((event: "update:columnSizing", value: ColumnSizingState | undefined) => void) & ((event: "update:columnSizingInfo", value: ColumnSizingInfoState | undefined) => void) & ((event: "update:rowSelection", value: RowSelectionState | undefined) => void) & ((event: "update:rowPinning", value: RowPinningState | undefined) => void) & ((event: "update:sorting", value: SortingState | undefined) => void) & ((event: "update:grouping", value: GroupingState | undefined) => void) & ((event: "update:expanded", value: ExpandedState | undefined) => void) & ((event: "update:pagination", value: PaginationState | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
