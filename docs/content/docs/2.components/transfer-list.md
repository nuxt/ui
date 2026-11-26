---
description: Move items between two selectable lists, with filtering, bulk moves and rich item rendering.
category: form
keywords:
  - transfer
  - dual listbox
  - pick list
  - shuttle
links:
  - label: Listbox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/listbox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/TransferList.vue
navigation.badge: Soon
---

## Usage

The TransferList renders two Reka UI [Listbox](https://reka-ui.com/docs/components/listbox) primitives side by side with move buttons in between. Every item lives in the `items` prop: those whose value is in `v-model` are displayed in the target list, in order, the others in the source list. Use the `default-value` prop instead when you do not need to control its state.

Select items with a click, then move them with the buttons, or double-click an item to move it right away.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - modelValue
  - items
  - valueKey
external:
  - items
  - modelValue
externalTypes:
  - TransferListItem[]
props:
  modelValue:
    - 'DE'
  valueKey: 'value'
  items:
    - label: 'France'
      icon: 'i-lucide-map-pin'
      value: 'FR'
    - label: 'Germany'
      icon: 'i-lucide-map-pin'
      value: 'DE'
    - label: 'Italy'
      icon: 'i-lucide-map-pin'
      value: 'IT'
    - label: 'Spain'
      icon: 'i-lucide-map-pin'
      value: 'ES'
    - label: 'Netherlands'
      icon: 'i-lucide-map-pin'
      value: 'NL'
    - label: 'Portugal'
      icon: 'i-lucide-map-pin'
      value: 'PT'
  class: 'w-full'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- [`avatar?: AvatarProps`{lang="ts-type"}](#with-avatar-in-items)
- `chip?: ChipProps`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, itemLeadingIcon?: ClassNameValue, ... }`{lang="ts-type"}

A disabled item cannot be selected nor moved, not even with the move all buttons.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  valueKey: 'value'
  items:
    - label: 'Backlog'
      description: 'Ideas not yet planned'
      icon: 'i-lucide-circle-dashed'
      value: 'backlog'
    - label: 'Todo'
      description: 'Ready to be picked up'
      icon: 'i-lucide-circle'
      value: 'todo'
    - label: 'In Progress'
      description: 'Currently being worked on'
      icon: 'i-lucide-timer'
      value: 'in-progress'
    - label: 'Cancelled'
      description: "Won't be done"
      icon: 'i-lucide-circle-x'
      value: 'cancelled'
      disabled: true
  class: 'w-full'
---
::

### Value Key

Use the `value-key` prop to bind `v-model` to a field of the items instead of the whole object.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - modelValue
external:
  - items
  - modelValue
externalTypes:
  - TransferListItem[]
props:
  modelValue:
    - 'IT'
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Labels

Use the `source-label` and `target-label` props to set the titles displayed in the headers.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  sourceLabel: 'Countries'
  targetLabel: 'Visited'
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Header

Use the `header` prop to hide the header that holds the "select all" checkbox, the label and the selection count.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  header: false
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Filter

Use the `filter` prop to display a filter input in each list. You can pass an object to customize the inputs, and the `filter-fields` prop to choose the fields to filter by.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  filter:
    placeholder: 'Filter countries…'
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
    - label: 'Spain'
      value: 'ES'
    - label: 'Netherlands'
      value: 'NL'
  class: 'w-full'
---
::

::note
The "select all" checkbox and the move all buttons only act on the items that match the filter.
::

### Move All

Use the `move-all` prop to hide the buttons that move every item at once.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  moveAll: false
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Controls

Use the `controls` prop to customize the move buttons. It accepts every [Button](/docs/components/button) prop.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  controls:
    color: 'primary'
    variant: 'soft'
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the TransferList.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  size: xl
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

### Disabled

Use the `disabled` prop to disable the TransferList.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
  - valueKey
external:
  - items
externalTypes:
  - TransferListItem[]
props:
  disabled: true
  valueKey: 'value'
  items:
    - label: 'France'
      value: 'FR'
    - label: 'Germany'
      value: 'DE'
    - label: 'Italy'
      value: 'IT'
  class: 'w-full'
---
::

## Examples

### With avatar in items

Use the `avatar` property to display an [Avatar](/docs/components/avatar) in front of each item, here to assign members to a team.

::component-example
---
name: 'transfer-list-avatar-example'
collapse: true
---
::

### With custom controls

Use the `#controls` slot to replace the move buttons. It receives the move functions and whether each move is possible.

::component-example
---
name: 'transfer-list-controls-slot-example'
collapse: true
---
::

### Listen to moves

Use the `@move` event to react to the items moved and their destination.

::component-example
---
name: 'transfer-list-move-event-example'
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

## Changelog

:component-changelog
