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

The Table component is built on top of [TanStack Table](https://tanstack.com/table/latest) and is powered by the [useVueTable](https://tanstack.com/table/latest/docs/framework/vue/vue-table#usevuetable) composable to provide a flexible and fully type-safe API.

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

::tip
When rendering components with the `h` function, you can utilize the `resolveComponent` function to dynamically resolve and reference components.
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

### With row selection

You can add a new column that renders a [Checkbox](/components/checkbox) component inside the `header` and `cell` to select rows.

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

::note{to="https://tanstack.com/table/latest/docs/api/features/row-selection" target="_blank"}
This example uses the Row Selection APIs from TanStack Table:

- `table.getIsAllPageRowsSelected()`
- `table.getIsSomePageRowsSelected()`
- `table.toggleAllPageRowsSelected()`
- `row.getIsSelected()`
- `row.toggleSelected()`
::

### With row actions

You can add a new column that renders a [DropdownMenu](/components/dropdown-menu) component inside the `cell` to render row actions.

::component-example
---
prettier: true
collapse: true
name: 'table-row-actions-example'
highlights:
  - 109
  - 133
class: '!p-0'
---
::

### With expandable rows

You can control the expandable state of a row using the `row.getIsExpanded()`{lang="ts-type"} and `row.toggleExpanded()`{lang="ts-type"} methods using the TanStack Table [Expanding APIs](https://tanstack.com/table/latest/docs/api/features/expanding).

You need to define the `#expanded` slot to render the expanded content which will receive the row as a parameter.

::component-example
---
prettier: true
collapse: true
name: 'table-row-expandable-example'
highlights:
  - 135
  - 142
class: '!p-0'
---
::

::note
In this example, the `Expand/Collapse` action is added to the [DropdownMenu](/components/dropdown-menu) component inside the `actions` column.
::

### With column sorting

### With column visibility

### With column pinning

### With column filtering

### With global filtering

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
