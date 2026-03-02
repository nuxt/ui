---
description: A responsive table element to display data in rows and columns.
category: data
links:
  - label: TanStack Table
    avatar:
      src: https://github.com/tanstack.png
    to: https://tanstack.com/table/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Table.vue
---

## Usage

The Table component is built on top of [TanStack Table](https://tanstack.com/table/latest) and is powered by the [useVueTable](https://tanstack.com/table/latest/docs/framework/vue/vue-table#usevuetable) composable to provide a flexible and fully type-safe API.

::component-example
---
source: false
name: 'table-example'
class: '!p-0'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/tree/v4/docs/app/components/content/examples/table/TableExample.vue" aria-label="View source code"}
This example demonstrates the most common use case of the `Table` component. Check out the source code on GitHub.
::

### Data

Use the `data` prop as an array of objects, the columns will be generated based on the keys of the objects.

::component-code
---
prettier: true
collapse: true
class: '!p-0'
ignore:
  - data
  - class
external:
  - data
props:
  data:
    - id: '4600'
      date: '2024-03-11T15:30:00'
      status: 'paid'
      email: 'james.anderson@example.com'
      amount: 594
    - id: '4599'
      date: '2024-03-11T10:10:00'
      status: 'failed'
      email: 'mia.white@example.com'
      amount: 276
    - id: '4598'
      date: '2024-03-11T08:50:00'
      status: 'refunded'
      email: 'william.brown@example.com'
      amount: 315
    - id: '4597'
      date: '2024-03-10T19:45:00'
      status: 'paid'
      email: 'emma.davis@example.com'
      amount: 529
    - id: '4596'
      date: '2024-03-10T15:55:00'
      status: 'paid'
      email: 'ethan.harris@example.com'
      amount: 639
  class: 'flex-1'
---
::

### Columns

Use the `columns` prop as an array of [ColumnDef](https://tanstack.com/table/latest/docs/api/core/column-def) objects with properties like:

- `accessorKey`: [The key of the row object to use when extracting the value for the column.]{class="text-muted"}
- `header`: [The header to display for the column. If a string is passed, it can be used as a default for the column ID. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).]{class="text-muted"}
- `footer`: [The footer to display for the column. Works exactly like header, but is displayed under the table.]{class="text-muted"}
- `cell`: [The cell to display each row for the column. If a function is passed, it will be passed a props object for the cell and should return the rendered cell value (the exact type depends on the adapter being used).]{class="text-muted"}
- `meta`: [Extra properties for the column.]{class="text-muted"}
  - `class`:
    - `td`: [The classes to apply to the `td` element.]{class="text-muted"}
    - `th`: [The classes to apply to the `th` element.]{class="text-muted"}
  - `style`:
    - `td`: [The style to apply to the `td` element.]{class="text-muted"}
    - `th`: [The style to apply to the `th` element.]{class="text-muted"}

In order to render components or other HTML elements, you will need to use the Vue [`h` function](https://vuejs.org/api/render-function.html#h) inside the `header` and `cell` props. This is different from other components that use slots but allows for more flexibility.

::tip{to="#with-slots" aria-label="Table columns with slots"}
You can also use slots to customize the header and data cells of the table.
::

::component-example
---
prettier: true
collapse: true
class: '!p-0'
name: 'table-columns-example'
highlights:
  - 53
  - 108
---
::

::note
When rendering components with `h`, you can either use the `resolveComponent` function or import from `#components`.
::

### Meta

Use the `meta` prop as an object ([TableMeta](https://tanstack.com/table/latest/docs/api/core/table#meta)) to pass properties like:

- `class`:
  - `tr`: [The classes to apply to the `tr` element.]{class="text-muted"}
- `style`:
  - `tr`: [The style to apply to the `tr` element.]{class="text-muted"}

::component-example
---
prettier: true
collapse: true
name: 'table-meta-example'
class: '!p-0'
highlights:
  - 128
  - 140
---
::

### Loading

Use the `loading` prop to display a loading state, the `loading-color` prop to change its color and the `loading-animation` prop to change its animation.

::component-code
---
prettier: true
collapse: true
class: '!p-0'
ignore:
  - data
  - class
external:
  - data
props:
  loading: true
  loadingColor: primary
  loadingAnimation: carousel
  data:
    - id: '4600'
      date: '2024-03-11T15:30:00'
      status: 'paid'
      email: 'james.anderson@example.com'
      amount: 594
    - id: '4599'
      date: '2024-03-11T10:10:00'
      status: 'failed'
      email: 'mia.white@example.com'
      amount: 276
    - id: '4598'
      date: '2024-03-11T08:50:00'
      status: 'refunded'
      email: 'william.brown@example.com'
      amount: 315
    - id: '4597'
      date: '2024-03-10T19:45:00'
      status: 'paid'
      email: 'emma.davis@example.com'
      amount: 529
    - id: '4596'
      date: '2024-03-10T15:55:00'
      status: 'paid'
      email: 'ethan.harris@example.com'
      amount: 639
  class: 'flex-1'
---
::

### Sticky

Use the `sticky` prop to make the header or footer sticky.

::component-code
---
prettier: true
collapse: true
class: '!p-0'
ignore:
  - data
  - class
external:
  - data
items:
  sticky:
    - true
    - false
props:
  sticky: true
  data:
    - id: '4600'
      date: '2024-03-11T15:30:00'
      status: 'paid'
      email: 'james.anderson@example.com'
      amount: 594
    - id: '4599'
      date: '2024-03-11T10:10:00'
      status: 'failed'
      email: 'mia.white@example.com'
      amount: 276
    - id: '4598'
      date: '2024-03-11T08:50:00'
      status: 'refunded'
      email: 'william.brown@example.com'
      amount: 315
    - id: '4597'
      date: '2024-03-10T19:45:00'
      status: 'paid'
      email: 'emma.davis@example.com'
      amount: 529
    - id: '4596'
      date: '2024-03-10T15:55:00'
      status: 'paid'
      email: 'ethan.harris@example.com'
      amount: 639
    - id: '4595'
      date: '2024-03-10T15:55:00'
      status: 'paid'
      email: 'ethan.harris@example.com'
      amount: 639
    - id: '4594'
      date: '2024-03-10T15:55:00'
      status: 'paid'
      email: 'ethan.harris@example.com'
      amount: 639
  class: 'flex-1 max-h-[312px]'
---
::

## Examples

### With row actions

You can add a new column that renders a [DropdownMenu](/docs/components/dropdown-menu) component inside the `cell` to render row actions.

::component-example
---
prettier: true
collapse: true
name: 'table-row-actions-example'
highlights:
  - 115
  - 141
class: '!p-0'
---
::

### With expandable rows

You can add a new column that renders a [Button](/docs/components/button) component inside the `cell` to toggle the expandable state of a row using the TanStack Table [Expanding APIs](https://tanstack.com/table/latest/docs/api/features/expanding).

::caution
You need to define the `#expanded` slot to render the expanded content which will receive the row as a parameter.
::

::component-example
---
prettier: true
collapse: true
name: 'table-row-expandable-example'
highlights:
  - 55
  - 72
class: '!p-0'
---
::

::tip
You can use the `expanded` prop to control the expandable state of the rows (can be binded with `v-model`).
::

::note
You could also add this action to the [`DropdownMenu`](/docs/components/dropdown-menu) component inside the `actions` column.
::

### With grouped rows

You can group rows based on a given column value and show/hide sub rows via some button added to the cell using the TanStack Table [Grouping APIs](https://tanstack.com/table/latest/docs/api/features/grouping).

#### Important parts:

* Add `grouping` prop with an array of column ids you want to group by.
* Add `grouping-options` prop. It must include `getGroupedRowModel`, you can import it from `@tanstack/vue-table` or implement your own.
* Expand rows via `row.toggleExpanded()` method on any cell of the row. Keep in mind, it also toggles `#expanded` slot.
* Use `aggregateFn` on column definition to define how to aggregate the rows.
* `agregatedCell` renderer on column definition only works if there is no `cell` renderer.

::component-example
---
prettier: true
collapse: true
name: 'table-grouped-rows-example'
highlights:
  - 157
  - 160
class: '!p-0'
---
::

### With row selection

You can add a new column that renders a [Checkbox](/docs/components/checkbox) component inside the `header` and `cell` to select rows using the TanStack Table [Row Selection APIs](https://tanstack.com/table/latest/docs/api/features/row-selection).

::component-example
---
prettier: true
collapse: true
name: 'table-row-selection-example'
highlights:
  - 55
  - 72
class: '!p-0'
---
::

::tip
You can use the `row-selection` prop to control the selection state of the rows (can be binded with `v-model`).
::

### With row select event

You can add a `@select` listener to make rows clickable with or without a checkbox column.

::note
The handler function receives the `Event` and `TableRow` instance as the first and second arguments respectively.
::

::component-example
---
prettier: true
collapse: true
name: 'table-row-select-event-example'
highlights:
  - 124
  - 131
class: '!p-0'
---
::

::tip
You can use this to navigate to a page, open a modal or even to select the row manually.
::

### With row context menu event

You can add a `@contextmenu` listener to make rows right clickable and wrap the Table in a [ContextMenu](/docs/components/context-menu) component to display row actions for example.

::note
The handler function receives the `Event` and `TableRow` instance as the first and second arguments respectively.
::

::component-example
---
prettier: true
collapse: true
name: 'table-row-context-menu-event-example'
highlights:
  - 133
  - 173
class: '!p-0'
---
::

### With row hover event

You can add a `@hover` listener to make rows hoverable and use a [Popover](/docs/components/popover) or a [Tooltip](/docs/components/tooltip) component to display row details for example.

::note
The handler function receives the `Event` and `TableRow` instance as the first and second arguments respectively.
::

::component-example
---
prettier: true
collapse: true
name: 'table-row-hover-event-example'
highlights:
  - 129
  - 152
class: '!p-0'
---
::

::note
This example is similar as the Popover [with following cursor example](/docs/components/popover#with-following-cursor) and uses a [`refDebounced`](https://vueuse.org/shared/refDebounced/#refdebounced) to prevent the Popover from opening and closing too quickly when moving the cursor from one row to another.
::

### With column footer

You can add a `footer` property to the column definition to render a footer for the column.

::component-example
---
prettier: true
collapse: true
name: 'table-column-footer-example'
highlights:
  - 100
  - 112
class: '!p-0'
---
::

### With column sorting

You can update a column `header` to render a [Button](/docs/components/button) component inside the `header` to toggle the sorting state using the TanStack Table [Sorting APIs](https://tanstack.com/table/latest/docs/api/features/sorting).

::component-example
---
prettier: true
collapse: true
name: 'table-column-sorting-example'
highlights:
  - 90
  - 105
class: '!p-0'
---
::

::tip
You can use the `sorting` prop to control the sorting state of the columns (can be binded with `v-model`).
::

You can also create a reusable component to make any column header sortable.

::component-example
---
prettier: true
collapse: true
name: 'table-column-sorting-reusable-example'
highlights:
  - 110
  - 161
class: '!p-0'
---
::

::note
In this example, we use a function to define the column header but you can also create an actual component.
::

### With column pinning

You can update a column `header` to render a [Button](/docs/components/button) component inside the `header` to toggle the pinning state using the TanStack Table [Pinning APIs](https://tanstack.com/table/latest/docs/api/features/row-pinning).

::note
A pinned column will become sticky on the left or right side of the table. When using column pinning, you should define explicit `size` values for your columns to ensure proper column width handling, especially with multiple pinned columns.
::

::component-example
---
prettier: true
collapse: true
overflowHidden: true
name: 'table-column-pinning-example'
highlights:
  - 108
  - 126
class: '!p-0 overflow-clip'
---
::

::tip
You can use the `column-pinning` prop to control the pinning state of the columns (can be binded with `v-model`).
::

### With column visibility

You can use a [DropdownMenu](/docs/components/dropdown-menu) component to toggle the visibility of the columns using the TanStack Table [Column Visibility APIs](https://tanstack.com/table/latest/docs/api/features/column-visibility).

::component-example
---
prettier: true
collapse: true
name: 'table-column-visibility-example'
highlights:
  - 121
  - 146
class: '!p-0'
---
::

::tip
You can use the `column-visibility` prop to control the visibility state of the columns (can be binded with `v-model`).
::

### With column filters

You can use an [Input](/docs/components/input) component to filter per column the rows using the TanStack Table [Column Filtering APIs](https://tanstack.com/table/latest/docs/api/features/column-filtering).

::component-example
---
prettier: true
collapse: true
name: 'table-column-filters-example'
highlights:
  - 123
  - 128
class: '!p-0'
---
::

::tip
You can use the `column-filters` prop to control the filters state of the columns (can be binded with `v-model`).
::

### With global filter

You can use an [Input](/docs/components/input) component to filter the rows using the TanStack Table [Global Filtering APIs](https://tanstack.com/table/latest/docs/api/features/global-filtering).

::component-example
---
prettier: true
collapse: true
name: 'table-global-filter-example'
class: '!p-0'
highlights:
  - 116
---
::

::tip
You can use the `global-filter` prop to control the global filter state (can be binded with `v-model`).
::

### With pagination

You can use a [Pagination](/docs/components/pagination) component to control the pagination state using the [Pagination APIs](https://tanstack.com/table/latest/docs/api/features/pagination).

There are different pagination approaches as explained in [Pagination Guide](https://tanstack.com/table/latest/docs/guide/pagination#pagination-guide). In this example, we use client-side pagination so we need to manually pass `getPaginationRowModel()`{lang="ts-type"} function.

::component-example
---
prettier: true
collapse: true
name: 'table-pagination-example'
class: '!p-0'
highlights:
  - 204
  - 209
---
::

::tip
You can use the `pagination` prop to control the pagination state (can be binded with `v-model`).
::

### With fetched data

You can fetch data from an API and use them in the Table.

::component-example
---
prettier: true
collapse: true
name: 'table-fetch-example'
highlights:
  - 15
  - 26
class: '!p-0'
---
::

### With infinite scroll

If you use server-side pagination, you can use the [`useInfiniteScroll`](https://vueuse.org/core/useInfiniteScroll/#useinfinitescroll) composable to load more data  as the user scrolls.

::component-example
---
prettier: true
collapse: true
highlights:
  - 72
  - 83
overflowHidden: true
name: 'table-infinite-scroll-example'
class: '!p-0'
---
::

### With drag and drop

You can use the [`useSortable`](https://vueuse.org/integrations/useSortable/) composable from [`@vueuse/integrations`](https://vueuse.org/integrations/README.html) to enable drag and drop functionality on the Table. This integration wraps [Sortable.js](https://sortablejs.github.io/Sortable/) to provide a seamless drag and drop experience.

::note
Since the table ref doesn't expose the tbody element, add a unique class to it via the `:ui` prop to target it with `useSortable` (e.g. `:ui="{ tbody: 'my-table-tbody' }"`).
::

::component-example
---
prettier: true
collapse: true
highlights:
  - 81
  - 83
name: 'table-drag-and-drop-example'
class: '!p-0'
---
::

### With virtualization :badge{label="4.1+" class="align-text-top"}

Use the `virtualize` prop to enable virtualization for large datasets as a boolean or an object with options like `{ estimateSize: 65, overscan: 12 }`. You can also pass other [TanStack Virtual options](https://tanstack.com/virtual/latest/docs/api/virtualizer#optional-options) to customize the virtualization behavior.

::warning
When virtualization is enabled, the divider between rows and sticky properties are not supported.
::

::component-example
---
prettier: true
collapse: true
name: 'table-virtualize-example'
class: '!p-0'
---
::

::note
A height constraint is required on the table for virtualization to work properly (e.g., `class="h-[400px]"`).
::

### With tree data

You can use the `get-sub-rows` prop to display hierarchical (tree) data in the table.
For example, if your data objects have a `children` array, set `:get-sub-rows="row => row.children"` to enable expandable rows.

::component-example
---
prettier: true
collapse: true
highlights:
  - 175
name: 'table-tree-data-example'
class: '!p-0'
---
::

### With slots

You can use slots to customize the header and data cells of the table.

Use the `#<column>-header` slot to customize the header of a column. You will have access to the `column`, `header` and `table` properties in the slot scope.

Use the `#<column>-cell` slot to customize the cell of a column. You will have access to the `cell`, `column`, `getValue`, `renderValue`, `row`, and `table` properties in the slot scope.

::component-example
---
prettier: true
collapse: true
name: 'table-slots-example'
class: '!p-0'
---
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table#attributes" target="_blank"}
This component also supports all native `<table>` HTML attributes.
::

### Slots

:component-slots

### Expose

You can access the typed component instance using [`useTemplateRef`](https://vuejs.org/api/composition-api-helpers.html#usetemplateref).

```vue
<script setup lang="ts">
const table = useTemplateRef('table')
</script>

<template>
  <UTable ref="table" />
</template>
```

This will give you access to the following:

| Name | Type |
| ---- | ---- |
| `tableRef`{lang="ts-type"} | `Ref<HTMLTableElement \| null>`{lang="ts-type"} |
| `tableApi`{lang="ts-type"} | [`Table`{lang="ts-type"}](https://tanstack.com/table/latest/docs/api/core/table#table-api) |

## Theme

:component-theme

## Changelog

:component-changelog
