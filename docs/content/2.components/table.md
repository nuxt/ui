---
description: 'Display data in a table.'
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/data/Table.vue
---

## Usage

Use the `rows` prop to set the data to display in the table. By default, the table will display all the fields of the rows.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-basic'
componentProps:
  class: 'flex-1'
---
::

### Columns

Use the `columns` prop to configure which columns to display. It's an array of objects with the following properties:

- `label` - The label to display in the table header. Can be changed through the `column-attribute` prop.
- `key` - The field to display from the row data.
- `sortable` - Whether the column is sortable. Defaults to `false`.
- `direction` - The sort direction to use on first click. Defaults to `asc`.
- `class` - The class to apply to the column cells.
- `sort` - Pass your own `sort` function. Defaults to a simple _greater than_ / _less than_ comparison.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-columns'
componentProps:
  class: 'flex-1'
---
::

You can easily use the [SelectMenu](/components/select-menu) component to change the columns to display.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-columns-selectable'
componentProps:
  class: 'flex-1'
---
::

You can apply styles to `tr` and `td` elements by passing a `class` to rows.

Also, you can apply styles to `th` elements by passing a `class` to columns.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-style'
componentProps:
  class: 'w-full'
---
::

### Sortable

You can make the columns sortable by setting the `sortable` property to `true` in the column configuration.

You may specify the default direction of each column through the `direction` property. It can be either `asc` or `desc`, but it will default to `asc`.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-columns-sortable'
componentProps:
  class: 'flex-1'
---
::

#### Default sorting

You can specify a default sort for the table through the `sort` prop. It's an object with the following properties:

- `column` - The column to sort by.
- `direction` - The sort direction. Can be either `asc` or `desc` and defaults to `asc`.

This will set the default sort and will work even if no column is set as `sortable`.

```vue
<script setup lang="ts">
const sort = ref({
  column: 'name',
  direction: 'desc'
})

const columns = [{
  label: 'Name',
  key: 'name',
  sortable: true
}]

const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}]
</script>

<template>
  <UTable :sort="sort" :columns="columns" :rows="people" />
</template>
```

#### Reactive sorting

You can use a `v-model:sort` to make the sorting reactive. You may also use `@update:sort` to call your own function with the sorting data.

When fetching data from an API, we can take advantage of the [`useFetch`](https://nuxt.com/docs/api/composables/use-fetch) or [`useAsyncData`](https://nuxt.com/docs/api/composables/use-async-data) composables to fetch the data based on the sorting column and direction every time the `sort` reactive element changes.

When doing so, you might want to set the `sort-mode` prop to `manual` to disable the automatic sorting and return the rows as is.

```vue
<script setup lang="ts">
// Ensure it uses `ref` instead of `reactive`.
const sort = ref({
  column: 'name',
  direction: 'desc'
})

const columns = [{
  label: 'Name',
  key: 'name',
  sortable: true
}]

const { data, pending } = await useLazyFetch(() => `/api/users?orderBy=${sort.value.column}&order=${sort.value.direction}`)
</script>

<template>
  <UTable v-model:sort="sort" :loading="pending" :columns="columns" :rows="data" sort-mode="manual" />
</template>
```

::callout{icon="i-heroicons-light-bulb" to="https://nuxt.com/docs/api/composables/use-fetch#params" target="_blank"}
We pass a function to `useLazyFetch` here to make the url reactive but you can use the `query` / `params` options alongside `watch`.
::

#### Custom sorting

Use the `sort-button` prop to customize the sort button in the header. You can pass all the props of the [Button](/components/button) component to customize it through this prop or globally through `ui.table.default.sortButton`. Its icon defaults to `i-heroicons-arrows-up-down-20-solid`.

::component-card{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
baseProps:
  class: 'w-full'
  columns:
    - key: 'id'
      label: 'ID'
    - key: 'name'
      label: 'Name'
      sortable: true
    - key: 'title'
      label: 'Title'
      sortable: true
    - key: 'email'
      label: 'Email'
      sortable: true
    - key: 'role'
      label: 'Role'
  rows:
    - id: 1
      name: 'Lindsay Walton'
      title: 'Front-end Developer'
      email: 'lindsay.walton@example.com'
      role: 'Member'
    - id: 2
      name: 'Courtney Henry'
      title: 'Designer'
      email: 'courtney.henry@example.com'
      role: 'Admin'
    - id: 3
      name: 'Tom Cook'
      title: 'Director of Product'
      email: 'tom.cook@example.com'
      role: 'Member'
    - id: 4
      name: 'Whitney Francis'
      title: 'Copywriter'
      email: 'whitney.francis@example.com'
      role: 'Admin'
    - id: 5
      name: 'Leonard Krasner'
      title: 'Senior Designer'
      email: 'leonard.krasner@example.com'
      role: 'Owner'
    - id: 6
      name: 'Floyd Miles'
      title: 'Principal Designer'
      email: 'floyd.miles@example.com'
      role: 'Member'
props:
  sortAscIcon: 'i-heroicons-arrow-up-20-solid'
  sortDescIcon: 'i-heroicons-arrow-down-20-solid'
  sortButton:
    icon: 'i-heroicons-sparkles-20-solid'
    color: 'primary'
    variant: 'outline'
    size: '2xs'
    square: false
    ui:
      rounded: 'rounded-full'
excludedProps:
  - sortButton
  - sortAscIcon
  - sortDescIcon
---
::

Use the `sort-asc-icon` prop to set a different icon or change it globally in `ui.table.default.sortAscIcon`. Defaults to `i-heroicons-bars-arrow-up-20-solid`.

Use the `sort-desc-icon` prop to set a different icon or change it globally in `ui.table.default.sortDescIcon`. Defaults to `i-heroicons-bars-arrow-down-20-solid`.

::callout{icon="i-heroicons-light-bulb"}
You can also customize the entire header cell, read more in the [Slots](#slots) section.
::

### Selectable

Use a `v-model` to make the table selectable. The `v-model` will be an array of the selected rows.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-selectable'
componentProps:
  class: 'flex-1'
---
::

::callout{icon="i-heroicons-light-bulb"}
You can use the `by` prop to compare objects by a field instead of comparing object instances. We've replicated the behavior of Headless UI [Combobox](https://headlessui.com/vue/combobox#binding-objects-as-values).
::

You can also add a `select` listener on your Table to make the rows clickable. The function will receive the row as the first argument.

You can use this to navigate to a page, open a modal or even to select the row manually.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-clickable'
componentProps:
  class: 'flex-1'
---
::

### Searchable

You can easily use the [Input](/components/input) component to filter the rows.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-searchable'
componentProps:
  class: 'flex-1'
---
::

### Paginable

You can easily use the [Pagination](/components/pagination) component to paginate the rows.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-paginable'
componentProps:
  class: 'flex-1'
---
::

### Loading

Use the `loading` prop to indicate that data is currently loading with an indeterminate [Progress](/components/progress#indeterminate) bar.

You can use the `progress` prop to customize the `color` and `animation` of the progress bar or change them globally in `ui.table.default.progress` (you can set it to `null` to hide the progress bar).

If there is no rows provided, a loading state will also be displayed. You can use the `loading-state` prop to customize the `icon` and `label` or change them globally in `ui.table.default.loadingState` (you can set it to `null` to hide the loading state).

::component-card
---
extraClass: 'overflow-hidden'
padding: false
baseProps:
  class: 'w-full'
  columns:
    - key: 'id'
      label: 'ID'
    - key: 'name'
      label: 'Name'
    - key: 'title'
      label: 'Title'
    - key: 'email'
      label: 'Email'
    - key: 'role'
      label: 'Role'
props:
  loading: true
  loadingState:
    icon: 'i-heroicons-arrow-path-20-solid'
    label: "Loading..."
  progress:
    color: 'primary'
    animation: 'carousel'
excludedProps:
  - loadingState
  - progress
---
::

This can be easily used with Nuxt `useAsyncData` composable.

```vue
<script setup lang="ts">
const columns = [...]

const { pending, data: people } = await useLazyAsyncData('people', () => $fetch('/api/people'))
</script>

<template>
  <UTable :rows="people" :columns="columns" :loading="pending" />
</template>
```

### Empty

An empty state will be displayed when there are no results.

Use the `empty-state` prop to customize the `icon` and `label` or change them globally in `ui.table.default.emptyState`.

You can also set it to `null` to hide the empty state.

::component-card
---
extraClass: 'overflow-hidden'
padding: false
baseProps:
  class: 'w-full'
  columns:
    - key: 'id'
      label: 'ID'
    - key: 'name'
      label: 'Name'
    - key: 'title'
      label: 'Title'
    - key: 'email'
      label: 'Email'
    - key: 'role'
      label: 'Role'
props:
  emptyState:
    icon: 'i-heroicons-circle-stack-20-solid'
    label: "No items."
excludedProps:
  - emptyState
---
::

## Slots

You can use slots to customize the header and data cells of the table.

### `<column>-header`

Use the `#<column>-header` slot to customize the header cell of a column. You will have access to the `column`, `sort` and `on-sort` properties in the slot scope.

The `sort` property is an object with the following properties:

- `field` - The field to sort by.
- `direction` - The direction to sort by. Can be `asc` or `desc`.

The `on-sort` property is a function that you can call to sort the table and accepts the column as parameter.

::callout{icon="i-heroicons-light-bulb"}
Even though you can customize the sort button as mentioned in the [Sortable](#sortable) section, you can use this slot to completely override its behavior, with a custom dropdown for example.
::

### `<column>-data`

Use the `#<column>-data` slot to customize the data cell of a column. You will have access to the `row`, `column` and `getRowData` properties in the slot scope.

You can for example create an extra column for actions with a [Dropdown](/components/dropdown) component inside or change the color of the rows based on a selection.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-slots'
componentProps:
  class: 'flex-1'
---
::

### `loading-state`

Use the `#loading-state` slot to customize the loading state.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-loading-slot'
componentProps:
  class: 'flex-1'
---
::

### `empty-state`

Use the `#empty-state` slot to customize the empty state.

::component-example{class="grid"}
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-empty-slot'
componentProps:
  class: 'flex-1'
---
::

### `caption`

Use the `#caption` slot to customize the table's caption.

::component-example
---
padding: false
component: 'table-example-caption-slot'
componentProps:
  class: 'flex-1'
---
::

## Props

:component-props

## Config

:component-preset

## Example

Here is an example of a Table component with all its features implemented.

::component-example
---
extraClass: 'overflow-hidden'
padding: false
component: 'table-example-advanced'
componentProps:
  class: 'flex-1'
hiddenCode: true
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/dev/docs/components/content/examples/TableExampleAdvanced.vue" target="_blank"}
Take a look at the component!
::
