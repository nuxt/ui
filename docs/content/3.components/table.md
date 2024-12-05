---
description: A responsive table element to display data in rows and columns.
links:
  - label: TanStack Table
    avatar:
      src: https://github.com/tanstack.png
    to: https://tanstack.com/table/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Table.vue
---

## Usage

The Table component is built on top of [TanStack Table](https://tanstack.com/table/latest) and is powered by the [useVueTable](https://tanstack.com/table/latest/docs/framework/vue/vue-table#usevuetable) composable to provide a flexible and fully type-safe API. *Some features of TanStack Table are not supported yet, we'll add more over time.*

::component-example
---
source: false
name: 'table-example'
class: '!p-0'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/tree/v3/docs/app/components/content/examples/table/TableExample.vue"}
This example demonstrates the most common use case of the `Table` component. Check out the source code on GitHub.
::

### Data

Use the `data` prop as an array of objects, the columns will be generated based on the keys of the objects.

::component-code
---
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

- `accessorKey`: [The key of the row object to use when extracting the value for the column.]{class="text-[var(--ui-text-muted)]"}
- `header`: [The header to display for the column. If a string is passed, it can be used as a default for the column ID. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).]{class="text-[var(--ui-text-muted)]"}
- `cell`: [The cell to display each row for the column. If a function is passed, it will be passed a props object for the cell and should return the rendered cell value (the exact type depends on the adapter being used).]{class="text-[var(--ui-text-muted)]"}

In order to render components or other HTML elements, you will need to use the Vue [`h` function](https://vuejs.org/api/render-function.html#h) inside the `header` and `cell` props. This is different from other components that use slots but allows for more flexibility.

::tip{to="#with-slots"}
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
  - 105
---
::

::note
When rendering components with `h`, you can either use the `resolveComponent` function or import from `#components`.
::

### Loading

Use the `loading` prop to display a loading state, the `loading-color` prop to change its color and the `loading-animation` prop to change its animation.

::component-code
---
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

Use the `sticky` prop to make the header sticky.

::component-code
---
collapse: true
class: '!p-0'
ignore:
  - data
  - class
external:
  - data
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

You can add a new column that renders a [DropdownMenu](/components/dropdown-menu) component inside the `cell` to render row actions.

::component-example
---
prettier: true
collapse: true
name: 'table-row-actions-example'
highlights:
  - 110
  - 134
class: '!p-0'
---
::

### With expandable rows

You can add a new column that renders a [Button](/components/button) component inside the `cell` to toggle the expandable state of a row using the TanStack Table [Expanding APIs](https://tanstack.com/table/latest/docs/api/features/expanding).

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
  - 71
class: '!p-0'
---
::

::tip
You can use the `expanded` prop to control the expandable state of the rows (can be binded with `v-model`).
::

::note
You could also add this action to the [`DropdownMenu`](/components/dropdown-menu) component inside the `actions` column.
::

### With row selection

You can add a new column that renders a [Checkbox](/components/checkbox) component inside the `header` and `cell` to select rows using the TanStack Table [Row Selection APIs](https://tanstack.com/table/latest/docs/api/features/row-selection).

::component-example
---
prettier: true
collapse: true
name: 'table-row-selection-example'
highlights:
  - 55
  - 70
class: '!p-0'
---
::

::tip
You can use the `row-selection` prop to control the selection state of the rows (can be binded with `v-model`).
::

### With column sorting

You can update a column `header` to render a [Button](/components/button) component inside the `header` to toggle the sorting state using the TanStack Table [Sorting APIs](https://tanstack.com/table/latest/docs/api/features/sorting).

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

You can update a column `header` to render a [Button](/components/button) component inside the `header` to toggle the pinning state using the TanStack Table [Pinning APIs](https://tanstack.com/table/latest/docs/api/features/row-pinning).

::note
A pinned column will become sticky on the left or right side of the table.
::

::component-example
---
prettier: true
collapse: true
name: 'table-column-pinning-example'
highlights:
  - 100
  - 113
class: '!p-0 overflow-clip'
---
::

::tip
You can use the `column-pinning` prop to control the pinning state of the columns (can be binded with `v-model`).
::

### With column visibility

You can add use [DropdownMenu](/components/dropdown-menu) component to toggle the visibility of the columns using the TanStack Table [Column Visibility APIs](https://tanstack.com/table/latest/docs/api/features/column-visibility).

::component-example
---
prettier: true
collapse: true
name: 'table-column-visibility-example'
highlights:
  - 135
  - 142
class: '!p-0'
---
::

::tip
You can use the `column-visibility` prop to control the visibility state of the columns (can be binded with `v-model`).
::

### With column filters

You can use an [Input](/components/input) component to filter per column the rows using the TanStack Table [Column Filtering APIs](https://tanstack.com/table/latest/docs/api/features/column-filtering).

::component-example
---
prettier: true
collapse: true
name: 'table-column-filters-example'
highlights:
  - 135
  - 142
class: '!p-0'
---
::

::tip
You can use the `column-filters` prop to control the filters state of the columns (can be binded with `v-model`).
::

### With global filter

You can use an [Input](/components/input) component to filter the rows using the TanStack Table [Global Filtering APIs](https://tanstack.com/table/latest/docs/api/features/global-filtering).

::component-example
---
prettier: true
collapse: true
name: 'table-global-filter-example'
class: '!p-0'
---
::

::tip
You can use the `global-filter` prop to control the global filter state (can be binded with `v-model`).
::

### With fetched data

You can fetch data from an API and use them in the Table.

::component-example
---
prettier: true
collapse: true
name: 'table-fetch-example'
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
| `tableApi`{lang="ts-type"} | [`Ref<Table \| null>`{lang="ts-type"}](https://tanstack.com/table/latest/docs/api/core/table#table-api) |

## Theme

:component-theme
