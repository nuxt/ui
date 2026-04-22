<script>
import theme from "#build/ui/table";
</script>

<script setup>
import { computed, useTemplateRef, watch, toRef } from "vue";
import { Primitive, useForwardProps } from "reka-ui";
import { upperFirst } from "scule";
import { defu } from "defu";
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getExpandedRowModel, useVueTable } from "@tanstack/vue-table";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { reactivePick, createReusableTemplate, createRef } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  data: { type: Array, required: false },
  columns: { type: Array, required: false },
  caption: { type: String, required: false },
  meta: { type: Object, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  empty: { type: String, required: false },
  sticky: { type: [Boolean, String], required: false },
  loading: { type: Boolean, required: false },
  loadingColor: { type: null, required: false },
  loadingAnimation: { type: null, required: false },
  watchOptions: { type: Object, required: false, default: () => ({
    deep: true
  }) },
  globalFilterOptions: { type: Object, required: false },
  columnFiltersOptions: { type: Object, required: false },
  columnPinningOptions: { type: Object, required: false },
  columnSizingOptions: { type: Object, required: false },
  visibilityOptions: { type: Object, required: false },
  sortingOptions: { type: Object, required: false },
  groupingOptions: { type: Object, required: false },
  expandedOptions: { type: Object, required: false },
  rowSelectionOptions: { type: Object, required: false },
  rowPinningOptions: { type: Object, required: false },
  paginationOptions: { type: Object, required: false },
  facetedOptions: { type: Object, required: false },
  onSelect: { type: Function, required: false },
  onHover: { type: Function, required: false },
  onContextmenu: { type: [Function, Array], required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  state: { type: Object, required: false },
  onStateChange: { type: Function, required: false },
  renderFallbackValue: { type: null, required: false },
  _features: { type: Array, required: false },
  autoResetAll: { type: Boolean, required: false },
  debugAll: { type: Boolean, required: false },
  debugCells: { type: Boolean, required: false },
  debugColumns: { type: Boolean, required: false },
  debugHeaders: { type: Boolean, required: false },
  debugRows: { type: Boolean, required: false },
  debugTable: { type: Boolean, required: false },
  defaultColumn: { type: Object, required: false },
  getRowId: { type: Function, required: false },
  getSubRows: { type: Function, required: false },
  initialState: { type: Object, required: false },
  mergeOptions: { type: Function, required: false }
});
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("table", props);
const data = createRef(props.data ?? [], props.watchOptions?.deep !== false);
const meta = computed(() => props.meta ?? {});
const columns = computed(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey) => ({ accessorKey, header: upperFirst(accessorKey) }))));
function processColumns(columns2) {
  return columns2.map((column) => {
    const col = { ...column };
    if ("columns" in col && col.columns) {
      col.columns = processColumns(col.columns);
    }
    if (!col.cell) {
      col.cell = ({ getValue }) => {
        const value = getValue();
        if (value === "" || value === null || value === void 0) {
          return "\xA0";
        }
        return String(value);
      };
    }
    return col;
  });
}
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.table || {} })({
  sticky: props.virtualize ? false : props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation,
  virtualize: !!props.virtualize
}));
const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate();
const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate({
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
});
const hasFooter = computed(() => {
  function hasFooterRecursive(columns2) {
    for (const column of columns2) {
      if ("footer" in column) {
        return true;
      }
      if ("columns" in column && hasFooterRecursive(column.columns)) {
        return true;
      }
    }
    return false;
  }
  return hasFooterRecursive(columns.value);
});
const globalFilterState = defineModel("globalFilter", { type: String });
const columnFiltersState = defineModel("columnFilters", { type: Array });
const columnOrderState = defineModel("columnOrder", { type: Array });
const columnVisibilityState = defineModel("columnVisibility", { type: Object });
const columnPinningState = defineModel("columnPinning", { type: Object });
const columnSizingState = defineModel("columnSizing", { type: Object });
const columnSizingInfoState = defineModel("columnSizingInfo", { type: Object });
const rowSelectionState = defineModel("rowSelection", { type: Object });
const rowPinningState = defineModel("rowPinning", { type: Object });
const sortingState = defineModel("sorting", { type: Array });
const groupingState = defineModel("grouping", { type: Array });
const expandedState = defineModel("expanded", { type: [Boolean, Object] });
const paginationState = defineModel("pagination", { type: Object });
const rootRef = useTemplateRef("rootRef");
const tableRef = useTemplateRef("tableRef");
const tableProps = useForwardProps(reactivePick(props, "_features", "autoResetAll", "debugAll", "debugCells", "debugColumns", "debugHeaders", "debugRows", "debugTable", "defaultColumn", "getRowId", "getSubRows", "initialState", "mergeOptions", "renderFallbackValue"));
const tableApi = useVueTable({
  ...tableProps.value,
  get data() {
    return data.value;
  },
  get columns() {
    return columns.value;
  },
  meta: meta.value,
  getCoreRowModel: getCoreRowModel(),
  ...props.globalFilterOptions || {},
  ...globalFilterState.value !== void 0 && { onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState) },
  ...props.columnFiltersOptions || {},
  getFilteredRowModel: getFilteredRowModel(),
  ...columnFiltersState.value !== void 0 && { onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState) },
  ...columnOrderState.value !== void 0 && { onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState) },
  ...props.visibilityOptions || {},
  ...columnVisibilityState.value !== void 0 && { onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState) },
  ...props.columnPinningOptions || {},
  ...columnPinningState.value !== void 0 && { onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState) },
  ...props.columnSizingOptions || {},
  ...columnSizingState.value !== void 0 && { onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState) },
  ...columnSizingInfoState.value !== void 0 && { onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState) },
  ...props.rowSelectionOptions || {},
  ...rowSelectionState.value !== void 0 && { onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState) },
  ...props.rowPinningOptions || {},
  ...rowPinningState.value !== void 0 && { onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState) },
  ...props.sortingOptions || {},
  getSortedRowModel: getSortedRowModel(),
  ...sortingState.value !== void 0 && { onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState) },
  ...props.groupingOptions || {},
  ...groupingState.value !== void 0 && { onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState) },
  ...props.expandedOptions || {},
  getExpandedRowModel: getExpandedRowModel(),
  ...expandedState.value !== void 0 && { onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState) },
  ...props.paginationOptions || {},
  ...paginationState.value !== void 0 && { onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState) },
  ...props.facetedOptions || {},
  state: {
    get globalFilter() {
      return globalFilterState.value;
    },
    get columnFilters() {
      return columnFiltersState.value;
    },
    get columnOrder() {
      return columnOrderState.value;
    },
    get columnVisibility() {
      return columnVisibilityState.value;
    },
    get columnPinning() {
      return columnPinningState.value;
    },
    get expanded() {
      return expandedState.value;
    },
    get rowSelection() {
      return rowSelectionState.value;
    },
    get sorting() {
      return sortingState.value;
    },
    get grouping() {
      return groupingState.value;
    },
    get rowPinning() {
      return rowPinningState.value;
    },
    get columnSizing() {
      return columnSizingState.value;
    },
    get columnSizingInfo() {
      return columnSizingInfoState.value;
    },
    get pagination() {
      return paginationState.value;
    }
  }
});
const rows = computed(() => tableApi.getRowModel().rows);
const topRows = computed(() => props.virtualize ? [] : tableApi.getTopRows());
const bottomRows = computed(() => props.virtualize ? [] : tableApi.getBottomRows());
const centerRows = computed(() => topRows.value.length || bottomRows.value.length ? tableApi.getCenterRows() : rows.value);
const virtualizerProps = toRef(() => defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
  estimateSize: 65,
  overscan: 12
}));
const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get count() {
    return centerRows.value.length;
  },
  getScrollElement: () => rootRef.value?.$el,
  estimateSize: (index) => {
    const estimate = virtualizerProps.value.estimateSize;
    return typeof estimate === "function" ? estimate(index) : estimate;
  }
});
const renderedSize = computed(() => {
  if (!virtualizer) {
    return 0;
  }
  const virtualItems = virtualizer.value.getVirtualItems();
  if (!virtualItems?.length) {
    return 0;
  }
  return virtualItems.reduce((sum, item) => sum + item.size, 0);
});
function valueUpdater(updaterOrValue, ref) {
  ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue;
}
function onRowSelect(e, row) {
  if (!props.onSelect) {
    return;
  }
  const target = e.target;
  const isInteractive = target.closest("button") || target.closest("a");
  if (isInteractive) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  props.onSelect(e, row);
}
function onRowHover(e, row) {
  if (!props.onHover) {
    return;
  }
  props.onHover(e, row);
}
function onRowContextmenu(e, row) {
  if (!props.onContextmenu) {
    return;
  }
  if (Array.isArray(props.onContextmenu)) {
    props.onContextmenu.forEach((fn) => fn(e, row));
  } else {
    props.onContextmenu(e, row);
  }
}
function resolveValue(prop, arg) {
  if (typeof prop === "function") {
    return prop(arg);
  }
  return prop;
}
function getColumnStyles(column) {
  const styles = {};
  const pinned = column.getIsPinned();
  if (pinned === "left") {
    styles.left = `${column.getStart("left")}px`;
  } else if (pinned === "right") {
    styles.right = `${column.getAfter("right")}px`;
  }
  return styles;
}
watch(() => props.data, () => {
  data.value = props.data ? [...props.data] : [];
}, props.watchOptions);
defineExpose({
  get $el() {
    return rootRef.value?.$el;
  },
  tableRef,
  tableApi
});
</script>

<template>
  <DefineRowTemplate v-slot="{ row, style }">
    <tr
      :data-selected="row.getIsSelected()"
      :data-selectable="!!props.onSelect || !!props.onHover || !!props.onContextmenu"
      :data-expanded="row.getIsExpanded()"
      :data-pinned="row.getIsPinned() || void 0"
      :role="props.onSelect ? 'button' : void 0"
      :tabindex="props.onSelect ? 0 : void 0"
      data-slot="tr"
      :class="ui.tr({
  class: [
    uiProp?.tr,
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
    uiProp?.td,
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

    <tr v-if="row.getIsExpanded()" data-slot="tr" :class="ui.tr({ class: [uiProp?.tr] })">
      <td :colspan="row.getAllCells().length" data-slot="td" :class="ui.td({ class: [uiProp?.td] })">
        <slot name="expanded" :row="row" />
      </td>
    </tr>
  </DefineRowTemplate>

  <DefineTableTemplate>
    <table ref="tableRef" data-slot="base" :class="ui.base({ class: [uiProp?.base] })">
      <caption v-if="caption || !!slots.caption" data-slot="caption" :class="ui.caption({ class: [uiProp?.caption] })">
        <slot name="caption">
          {{ caption }}
        </slot>
      </caption>

      <thead data-slot="thead" :class="ui.thead({ class: [uiProp?.thead] })">
        <tr v-for="headerGroup in tableApi.getHeaderGroups()" :key="headerGroup.id" data-slot="tr" :class="ui.tr({ class: [uiProp?.tr] })">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :scope="header.colSpan > 1 ? 'colgroup' : 'col'"
            :colspan="header.colSpan > 1 ? header.colSpan : void 0"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : void 0"
            data-slot="th"
            :class="ui.th({
  class: [
    uiProp?.th,
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

        <tr data-slot="separator" :class="ui.separator({ class: [uiProp?.separator] })" />
      </thead>

      <tbody data-slot="tbody" :class="ui.tbody({ class: [uiProp?.tbody] })">
        <slot name="body-top" />

        <template v-if="rows.length">
          <ReuseRowTemplate v-for="row in topRows" :key="row.id" :row="row" />

          <template v-if="virtualizer">
            <template v-for="(virtualRow, index) in virtualizer.getVirtualItems()" :key="centerRows[virtualRow.index]?.id">
              <ReuseRowTemplate
                :row="centerRows[virtualRow.index]"
                :style="{
  height: `${virtualRow.size}px`,
  transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
}"
              />
            </template>
          </template>

          <template v-else>
            <ReuseRowTemplate v-for="row in centerRows" :key="row.id" :row="row" />
          </template>

          <ReuseRowTemplate v-for="row in bottomRows" :key="row.id" :row="row" />
        </template>

        <tr v-else-if="loading && !!slots['loading']">
          <td :colspan="tableApi.getAllLeafColumns().length" data-slot="loading" :class="ui.loading({ class: uiProp?.loading })">
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td :colspan="tableApi.getAllLeafColumns().length" data-slot="empty" :class="ui.empty({ class: uiProp?.empty })">
            <slot name="empty">
              {{ empty || t("table.noData") }}
            </slot>
          </td>
        </tr>

        <slot name="body-bottom" />
      </tbody>

      <tfoot
        v-if="hasFooter"
        data-slot="tfoot"
        :class="ui.tfoot({ class: [uiProp?.tfoot] })"
        :style="virtualizer ? {
  transform: `translateY(${virtualizer.getTotalSize() - renderedSize}px)`
} : void 0"
      >
        <tr data-slot="separator" :class="ui.separator({ class: [uiProp?.separator] })" />

        <tr v-for="footerGroup in tableApi.getFooterGroups()" :key="footerGroup.id" data-slot="tr" :class="ui.tr({ class: [uiProp?.tr] })">
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :colspan="header.colSpan > 1 ? header.colSpan : void 0"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : void 0"
            data-slot="th"
            :class="ui.th({
  class: [
    uiProp?.th,
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

  <Primitive ref="rootRef" :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
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
