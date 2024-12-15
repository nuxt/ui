---
title: InputMenu
description: An autocomplete input with real-time suggestions.
links:
  - label: Combobox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/combobox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/InputMenu.vue
---

## Usage

Use the `v-model` directive to control the value of the InputMenu or the `default-value` prop to set the initial value when you do not need to control its state.

::tip
Use this over an [`Input`](/components/input) to take advantage of Reka UI's [`Combobox`](https://reka-ui.com/docs/components/combobox) component that offers autocomplete capabilities.
::

::note
This component is similar to the [`SelectMenu`](/components/select-menu) but it's using an Input instead of a Select.
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
- [`type?: "label" | "separator" | "item"`{lang="ts-type"}](#with-items-type)
- [`icon?: string`{lang="ts-type"}](#with-icons-in-items)
- [`avatar?: AvatarProps`{lang="ts-type"}](#with-avatar-in-items)
- [`chip?: ChipProps`{lang="ts-type"}](#with-chip-in-items)
- `disabled?: boolean`{lang="ts-type"}
- `onSelect?(e: Event): void`{lang="ts-type"}

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

Use the `multiple` prop to allow multiple selections, the selected items will be displayed as badges.

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

### Delete Icon

With `multiple`, use the `delete-icon` prop to customize the delete [Icon](/components/icon) in the badges. Defaults to `i-lucide-x`.

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
  deleteIcon: 'i-lucide-trash'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
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

### Content

Use the `content` prop to control how the InputMenu content is rendered, like its `align` or `side` for example.

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
  modelValue: 'Backlog'
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

### Arrow

Use the `arrow` prop to display an arrow on the InputMenu.

::component-code
---
prettier: true
ignore:
  - items
  - modelValue
  - arrow
external:
  - items
  - modelValue
props:
  modelValue: 'Backlog'
  arrow: true
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Color

Use the `color` prop to change the ring color when the InputMenu is focused.

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
  color: neutral
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

Use the `variant` prop to change the variant of the InputMenu.

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
  color: neutral
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

Use the `size` prop to change the size of the InputMenu.

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

Use the `icon` prop to show an [Icon](/components/icon) inside the InputMenu.

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
  icon: 'i-lucide-search'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon). Defaults to `i-lucide-chevron-down`.

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
  trailingIcon: 'i-lucide-arrow-down'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronDown` key.
:::
::

### Selected Icon

Use the `selected-icon` prop to customize the icon when an item is selected. Defaults to `i-lucide-check`.

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
  selectedIcon: 'i-lucide-flame'
  size: md
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.check` key.
:::
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar) inside the InputMenu.

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
  modelValue: 'Nuxt'
  avatar:
    src: 'https://github.com/nuxt.png'
  items:
    - Nuxt
    - NuxtHub
    - NuxtLabs
    - Nuxt Modules
    - Nuxt Community
---
::

### Loading

Use the `loading` prop to show a loading icon on the InputMenu.

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

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-refresh-cw`.

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
  loadingIcon: 'i-lucide-repeat-2'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.loading` key.
:::
::

### Disabled

Use the `disabled` prop to disable the InputMenu.

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

### With items type

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
name: 'input-menu-items-icon-example'
---
::

::tip
You can also use the `#leading` slot to display the selected icon.
::

### With avatar in items

You can use the `avatar` property to display an [Avatar](/components/avatar) inside the items.

::component-example
---
collapse: true
name: 'input-menu-items-avatar-example'
---
::

::tip
You can also use the `#leading` slot to display the selected avatar.
::

### With chip in items

You can use the `chip` property to display a [Chip](/components/chip) inside the items.

::component-example
---
collapse: true
name: 'input-menu-items-chip-example'
---
::

::note
In this example, the `#leading` slot is used to display the selected chip.
::

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'input-menu-open-example'
---
::

::note
In this example, leveraging [`defineShortcuts`](/composables/define-shortcuts), you can toggle the InputMenu by pressing :kbd{value="O"}.
::

### Control open state on focus

You can also use the `@focus` directive to control the open state.

::component-example
---
name: 'input-menu-open-focus-example'
---
::

### Control search term

Use the `v-model:search-term` directive to control the search term.

::component-example
---
name: 'input-menu-search-term-example'
---
::

### With rotating icon

Here is an example with a rotating icon that indicates the open state of the InputMenu.

::component-example
---
name: 'input-menu-icon-example'
---
::

### With create item

Use the `create-item` prop to enable users to add custom values that aren't in the predefined options.

::component-example
---
collapse: true
name: 'input-menu-create-item-example'
---
::

::note
The create option shows when no match is found by default. Set it to `always` to show it even when similar values exist.
::

::tip{to="#emits"}
Use the `@create` event to handle the creation of the item. You will receive the event and the item as arguments.
::

### With fetched items

You can fetch items from an API and use them in the InputMenu.

::component-example
---
collapse: true
name: 'input-menu-fetch-example'
---
::

### With ignore filter

Set the `ignore-filter` prop to `true` to disable the internal search and use your own search logic.

::component-example
---
collapse: true
name: 'input-menu-ignore-filter-example'
---
::

::note
This example uses [`refDebounced`](https://vueuse.org/shared/refDebounced/#refdebounced) to debounce the API calls.
::

### With filter fields

Use the `filter-fields` prop with an array of fields to filter on. Defaults to `[labelKey]`.

::component-example
---
collapse: true
name: 'input-menu-filter-fields-example'
---
::

### As a CountryPicker

This example demonstrates using the InputMenu as a country picker with lazy loading - countries are only fetched when the menu is opened.

::component-example
---
collapse: true
name: 'input-menu-countries-example'
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
