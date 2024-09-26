---
title: SelectMenu
description: An advanced searchable select element.
links:
  - label: Combobox
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/combobox.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/SelectMenu.vue
---

## Usage

Use the `v-model` directive to control the value of the SelectMenu or the `default-value` prop to set the initial value when you do not need to control its state.

::tip
Use this over a [Select](/components/select) to take advantage of Radix Vue's [Combobox](https://www.radix-vue.com/components/combobox.html) component that offers search capabilities and multiple selection.
::

::note
This component is similar to the [InputMenu](/components/input-menu) but it's using a Select instead of an Input with the search inside the menu.
::

### Items

Use the `items` prop as an array of strings, numbers or booleans:

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

You can also pass an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- [`type?: "label" | "separator" | "item"`{lang="ts-type"}](#with-typed-items)
- [`icon?: string`{lang="ts-type"}](#with-icons-in-items)
- [`avatar?: AvatarProps`{lang="ts-type"}](#with-avatar-in-items)
- [`chip?: ChipProps`{lang="ts-type"}](#with-chip-in-items)
- `disabled?: boolean`{lang="ts-type"}
- `select?(e: Event): void`{lang="ts-type"}

::component-code
---
ignore:
  - modelValue.label
  - items
external:
  - items
  - modelValue
props:
  modelValue:
    label: 'Todo'
  items:
    - label: 'Backlog'
    - label: 'Todo'
    - label: 'In Progress'
    - label: 'Done'
---
::

::note
Unlike the [Select](/components/select) component, the SelectMenu expects the whole object to be passed to the `v-model` directive or the `default-value` prop by default.
::

You can also pass an array of arrays to the `items` prop to display separated groups of items.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'Apple'
  items:
    - - Apple
      - Banana
      - Blueberry
      - Grapes
      - Pineapple
    - - Aubergine
      - Broccoli
      - Carrot
      - Courgette
      - Leek
---
::

### Value Key

You can choose to bind a single property of the object rather than the whole object by using the `value-key` prop. Defaults to `undefined`.

::component-code
---
collapse: true
ignore:
  - modelValue
  - valueKey
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'todo'
  valueKey: 'id'
  items:
    - label: 'Backlog'
      id: 'backlog'
    - label: 'Todo'
      id: 'todo'
    - label: 'In Progress'
      id: 'in_progress'
    - label: 'Done'
      id: 'done'
---
::

### Multiple

Use the `multiple` prop to allow multiple selections, the selected items will be separated by a comma in the trigger.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
  - multiple
external:
  - items
  - modelValue
props:
  modelValue:
    - Backlog
    - Todo
  multiple: true
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::caution
Ensure to pass an array to the `default-value` prop or the `v-model` directive.
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
prettier: true
ignore:
  - items
external:
  - items
props:
  placeholder: 'Select status'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Search Input

Use the `search-input` prop to customize the search input. Defaults to `{ placeholder: 'Search...' }`{lang="ts-type"}.

::component-code
---
prettier: true
ignore:
  - modelValue.label
  - modelValue.icon
  - items
external:
  - items
  - modelValue
props:
  modelValue:
    label: 'Backlog'
    icon: 'i-heroicons-question-mark-circle'
  searchInput:
    placeholder: 'Filter...'
  items:
    - label: Backlog
      icon: 'i-heroicons-question-mark-circle'
    - label: Todo
      icon: 'i-heroicons-plus-circle'
    - label: In Progress
      icon: 'i-heroicons-arrow-up-circle'
    - label: Done
      icon: 'i-heroicons-check-circle'
---
::

::tip
You can set the `search-input` prop to `false` to hide the search input.
::

### Content

Use the `content` prop to control how the SelectMenu content is rendered, like its `align` or `side` for example.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
items:
  content.align:
    - start
    - center
    - end
  content.side:
    - right
    - left
    - top
    - bottom
props:
  modelValue: Backlog
  content:
    align: center
    side: bottom
    sideOffset: 8
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Color

Use the `color` prop to change the ring color when the SelectMenu is focused.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  color: gray
  highlight: true
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the SelectMenu.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  color: gray
  variant: subtle
  highlight: false
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Size

Use the `size` prop to change the size of the SelectMenu.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  size: xl
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the SelectMenu.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  icon: 'i-heroicons-magnifying-glass'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon). Defaults to `i-heroicons-chevron-down-20-solid`.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  trailingIcon: 'i-heroicons-arrow-small-down-20-solid'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
::

### Selected Icon

Use the `selected-icon` prop to customize the icon when an item is selected. Defaults to `i-heroicons-check-20-solid`.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  selectedIcon: 'i-heroicons-fire'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
::

### Loading

Use the `loading` prop to show a loading icon on the SelectMenu.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  loading: true
  trailing: false
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

### Disabled

Use the `disabled` prop to disable the SelectMenu.

::component-code
---
prettier: true
ignore:
  - items
  - placeholder
external:
  - items
props:
  disabled: true
  placeholder: 'Select status'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

## Examples

### With typed items

You can use the `type` property with `separator` to display a separator between items or `label` to display a label.

::component-code
---
collapse: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'Apple'
  items:
    - type: 'label'
      label: 'Fruits'
    - Apple
    - Banana
    - Blueberry
    - Grapes
    - Pineapple
    - type: 'separator'
    - type: 'label'
      label: 'Vegetables'
    - Aubergine
    - Broccoli
    - Carrot
    - Courgette
    - Leek
---
::

### With icons in items

You can use the `icon` property to display an [Icon](/components/icon) inside the items.

::component-example
---
collapse: true
name: 'select-menu-items-icon-example'
---
::

::tip
You can also use the `#leading` slot to display the selected icon, like in the next example.
::

### With avatar in items

You can use the `avatar` property to display an [Avatar](/components/avatar) inside the items.

::component-example
---
collapse: true
name: 'select-menu-items-avatar-example'
---
::

::note
In this example, the `#leading` slot is used to display the selected avatar.
::

### With chip in items

You can use the `chip` property to display a [Chip](/components/chip) inside the items.

::component-example
---
collapse: true
name: 'select-menu-items-chip-example'
---
::

::note
In this example, the `#leading` slot is used to display the selected chip.
::

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'select-menu-open-example'
---
::

::note
In this example, press :kbd{value="O"} to toggle the SelectMenu.
::

### Control search term

Use the `v-model:search-term` directive to control the search term.

::component-example
---
name: 'select-menu-search-term-example'
---
::

### With rotating icon

Here is an example with a rotating icon that indicates the open state of the SelectMenu.

::component-example
---
name: 'select-menu-icon-example'
---
::

### With fetched items

You can fetch items from an API and use them in the SelectMenu.

::component-example
---
collapse: true
name: 'select-menu-fetch-example'
---
::

### Without internal search

Set the `filter` prop to `false` to disable the internal search and use your own search logic.

::component-example
---
collapse: true
name: 'select-menu-filter-example'
---
::

::note
This example uses [refDebounced](https://vueuse.org/shared/refDebounced/#refdebounced) to debounce the API calls.
::

### With custom search

Use the `filter` prop with an array of fields to filter on.

::component-example
---
collapse: true
name: 'select-menu-filter-fields-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
