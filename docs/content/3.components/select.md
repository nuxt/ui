---
description: A select element to choose from a list of options.
links:
  - label: Select
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/select.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Select.vue
---

## Usage

Use the `v-model` directive to control the value of the Select or the `default-value` prop to set the initial value when you do not need to control its state.

### Items

Use the `items` prop as an array of strings, numbers or booleans:

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
  - class
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
  class: 'w-40'
---
::

You can also pass an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- [`value?: string`{lang="ts-type"}](#value-key)
- [`type?: "label" | "separator" | "item"`{lang="ts-type"}](#with-items-type)
- [`icon?: string`{lang="ts-type"}](#with-icons-in-items)
- [`avatar?: AvatarProps`{lang="ts-type"}](#with-avatar-in-items)
- [`chip?: ChipProps`{lang="ts-type"}](#with-chip-in-items)
- `disabled?: boolean`{lang="ts-type"}

::component-code
---
ignore:
  - modelValue
  - items
  - class
external:
  - items
  - modelValue
props:
  modelValue: 'backlog'
  items:
    - label: 'Backlog'
      value: 'backlog'
    - label: 'Todo'
      value: 'todo'
    - label: 'In Progress'
      value: 'in_progress'
    - label: 'Done'
      value: 'done'
  class: 'w-40'
---
::

::caution
When using objects, you need to reference the `value` property of the object in the `v-model` directive or the `default-value` prop.
::

You can also pass an array of arrays to the `items` prop to display separated groups of items.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
  - class
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
  class: 'w-40'
---
::

### Value Key

You can change the property that is used to set the value by using the `value-key` prop. Defaults to `value`.

::component-code
---
ignore:
  - modelValue
  - valueKey
  - items
  - class
external:
  - items
  - modelValue
props:
  modelValue: 'backlog'
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
  class: 'w-40'
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
prettier: true
ignore:
  - items
  - class
external:
  - items
props:
  placeholder: 'Select status'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

### Content

Use the `content` prop to control how the Select content is rendered, like its its `align`, `side` or `position` for example. Defaults to `popper` to match other components.

::warning
The `content.align`, `content.side`, etc. properties only apply when `content.position` is set to `popper`.
::

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
items:
  content.position:
    - 'item-aligned'
    - 'popper'
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
  content:
    position: 'item-aligned'
    align: center
    side: bottom
    sideOffset: 8
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  defaultValue: 'Todo'
  class: 'w-40'
---
::

::note{to="https://www.radix-vue.com/components/select.html#change-the-positioning-mode"}
Read more about the `content.position` prop in the [Radix Vue documentation](https://www.radix-vue.com/components/select.html#change-the-positioning-mode).
::

### Color

Use the `color` prop to change the ring color when the Select is focused.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  color: neutral
  highlight: true
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the Select.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  color: neutral
  variant: subtle
  highlight: false
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

### Size

Use the `size` prop to change the size of the Select.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  size: xl
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Select.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  icon: 'i-heroicons-magnifying-glass'
  size: md
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon). Defaults to `i-heroicons-chevron-down-20-solid`.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  trailingIcon: 'i-heroicons-arrow-small-down-20-solid'
  size: md
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
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
  - defaultValue
  - class
external:
  - items
props:
  selectedIcon: 'i-heroicons-fire'
  size: md
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
::

### Loading

Use the `loading` prop to show a loading icon on the Select.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  loading: true
  trailing: false
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
prettier: true
ignore:
  - items
  - defaultValue
  - class
external:
  - items
props:
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
  class: 'w-40'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

### Disabled

Use the `disabled` prop to disable the Select.

::component-code
---
prettier: true
ignore:
  - items
  - placeholder
  - class
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
  class: 'w-40'
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
  - class
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
  class: 'w-40'
---
::

### With icons in items

You can use the `icon` property to display an [Icon](/components/icon) inside the items.

::component-example
---
collapse: true
name: 'select-items-icon-example'
---
::

::note
In this example, the icon is computed from the `value` property of the selected item.
::

::tip
You can also use the `#leading` slot to display the selected icon, like in the next example.
::

### With avatar in items

You can use the `avatar` property to display an [Avatar](/components/avatar) inside the items.

::component-example
---
collapse: true
name: 'select-items-avatar-example'
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
name: 'select-items-chip-example'
---
::

::note
In this example, the `#leading` slot is used to display the selected chip.
::

### Control open state

You can control the open state by using the `default-open` prop or the `v-model:open` directive.

::component-example
---
name: 'select-open-example'
---
::

::note
In this example, press :kbd{value="O"} to toggle the Select.
::

### With rotating icon

Here is an example with a rotating icon that indicates the open state of the Select.

::component-example
---
name: 'select-icon-example'
---
::

### With fetched items

You can fetch items from an API and use them in the Select.

::component-example
---
name: 'select-fetch-example'
collapse: true
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
