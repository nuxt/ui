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

Use the `columns` prop as an array of objects with the following properties:

- `accessorKey`: The key of the column.
- `header`: The header of the column.
- `footer`: The footer of the column.

::component-example
---
collapse: true
class: '!p-0'
name: 'table-columns-example'
---
::

::note{to="https://tanstack.com/table/latest/docs/guide/column-defs" target="_blank"}
For more information on columns, see the [TanStack Table documentation](https://tanstack.com/table/latest/docs/guide/column-defs).
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

## Examples

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
