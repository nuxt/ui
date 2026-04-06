---
description: A selectable list of items with search, virtualization and rich item rendering.
category: data
links:
  - label: Listbox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/listbox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Listbox.vue
navigation.badge: Soon
---

## Usage

Use the Listbox component to display a selectable list of items. The `v-model` represents the selected item(s).

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
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
    - label: 'Poland'
      icon: 'i-lucide-map-pin'
      value: 'PL'
  class: 'w-full'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `chip?: ChipProps`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, itemLeadingIcon?: ClassNameValue, ... }`{lang="ts-type"}

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  items:
    - label: 'France'
      description: 'The Hexagon'
      icon: 'i-lucide-map-pin'
      value: 'FR'
    - label: 'Germany'
      description: 'The Federal Republic'
      icon: 'i-lucide-map-pin'
      value: 'DE'
    - label: 'Italy'
      description: 'The Boot'
      icon: 'i-lucide-map-pin'
      value: 'IT'
    - label: 'Spain'
      description: 'The Bull Skin'
      icon: 'i-lucide-map-pin'
      value: 'ES'
  class: 'w-full'
---
::

### Multiple

Use the `multiple` prop to allow selecting multiple items. When enabled, the `v-model` will be an array.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  multiple: true
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
  class: 'w-full'
---
::

### Searchable

Use the `searchable` prop to enable a search input. You can also pass an object to customize the [Input](/docs/components/input) component.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  searchable: true
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
    - label: 'Poland'
      icon: 'i-lucide-map-pin'
      value: 'PL'
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the Listbox.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  size: xl
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
  class: 'w-full'
---
::

### Disabled

Use the `disabled` prop to prevent any user interaction with the Listbox.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  disabled: true
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
  class: 'w-full'
---
::

### Loading

Use the `loading` prop to display a loading indicator. Use the `loading-icon` prop to customize the icon.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - items
external:
  - items
externalTypes:
  - ListboxItem[]
props:
  loading: true
  items:
    - label: 'France'
      icon: 'i-lucide-map-pin'
      value: 'FR'
    - label: 'Germany'
      icon: 'i-lucide-map-pin'
      value: 'DE'
  class: 'w-full'
---
::

## Examples

### Control selected items

You can control the selected item by using the `default-value` prop or the `v-model` directive.

::component-example
---
name: 'listbox-model-value-example'
collapse: true
---
::

### With multiple selection

Use the `multiple` prop to allow selecting multiple items.

::component-example
---
name: 'listbox-multiple-example'
collapse: true
---
::

### With descriptions

Use the `description` property on items to display additional text below the label.

::component-example
---
name: 'listbox-description-example'
collapse: true
---
::

### With avatars

Use the `avatar` property on items to display an [Avatar](/docs/components/avatar) next to the label.

::component-example
---
name: 'listbox-avatar-example'
collapse: true
---
::

### With virtualization

Use the `virtualize` prop to enable virtualization for large lists as a boolean or an object with options like `{ estimateSize: 32, overscan: 12 }`.

::component-example
---
name: 'listbox-virtualize-example'
collapse: true
---
::

### As a transfer list

You can compose two Listbox components with [Button](/docs/components/button) controls to build a transfer list pattern.

::component-example
---
name: 'listbox-transfer-list-example'
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
