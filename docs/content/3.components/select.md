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
ignore:
  - modelValue
  - items
external:
  - modelValue
  - items
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
- [`value?: string`{lang="ts-type"}](#value-key)
- [`type?: "label" | "separator" | "item"`{lang="ts-type"}](#items-type)
- [`icon?: string`{lang="ts-type"}](#items-icon)
- [`avatar?: AvatarProps`{lang="ts-type"}](#items-avatar)
- [`chip?: ChipProps`{lang="ts-type"}](#items-chip)
- `disabled?: boolean`{lang="ts-type"}

::component-code
---
collapse: true
ignore:
  - modelValue
  - items
external:
  - modelValue
  - items
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
---
::

::note
When using objects, you need to reference the `value` property of the object in the `v-model` directive or the `default-value` prop.
::

#### Value Key

You can change the property that is used to set the value by using the `value-key` prop.

::component-code
---
collapse: true
ignore:
  - modelValue
  - valueKey
  - items
external:
  - modelValue
  - items
props:
  valueKey: 'id'
  modelValue: 'backlog'
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

#### Group items

You can pass an array of arrays to the `items` prop to display separated groups of items.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  defaultValue: 'Apple'
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

#### Items Type

You can use the `type` property with `separator` to display a separator between items or `label` to display a label.

::component-code
---
prettier: true
collapse: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  defaultValue: 'Apple'
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

#### Items Icon

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

#### Items Avatar

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

#### Items Chip

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

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
prettier: true
external:
  - items
ignore:
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

### Color

Use the `color` prop to change the ring color when the Select is focused.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  color: gray
  highlight: true
  defaultValue: 'Backlog'
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

Use the `variant` prop to change the variant of the Select.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  color: gray
  variant: subtle
  highlight: false
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Size

Use the `size` prop to change the size of the Select.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  size: xl
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Select.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  icon: 'i-heroicons-magnifying-glass'
  size: md
  defaultValue: 'Backlog'
  items:
    - Backlog
    - Todo
    - In Progress
    - Done
---
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing icon. Defaults to `i-heroicons-chevron-down-20-solid`.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  trailingIcon: 'i-heroicons-arrow-small-right'
  size: md
  defaultValue: 'Backlog'
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
external:
  - items
ignore:
  - items
  - defaultValue
props:
  selectedIcon: 'i-heroicons-fire'
  size: md
  defaultValue: 'Backlog'
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

Use the `loading` prop to show a loading icon on the Select.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - defaultValue
props:
  loading: true
  trailing: false
  defaultValue: 'Backlog'
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
external:
  - items
ignore:
  - items
  - defaultValue
props:
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
  trailing: false
  defaultValue: 'Backlog'
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

Use the `disabled` prop to disable the Select.

::component-code
---
prettier: true
external:
  - items
ignore:
  - items
  - placeholder
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
