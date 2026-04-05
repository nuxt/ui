---
description: A component to move items between two side-by-side lists.
category: data
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

Use the TransferList component to allow users to move items between a source (left) and target (right) list. The `v-model` represents the items in the target list.

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
  - TransferListItem[]
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
  sourceTitle: 'Available'
  targetTitle: 'Selected'
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
  - TransferListItem[]
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

### Searchable

Use the `searchable` prop to enable a search input in both lists. You can also pass an object to customize the [Input](/docs/components/input) component.

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
  - TransferListItem[]
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

Use the `size` prop to change the size of the TransferList.

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
  - TransferListItem[]
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

Use the `disabled` prop to prevent any user interaction with the TransferList.

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
  - TransferListItem[]
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

Use the `source-loading` / `target-loading` props to display a loading indicator in each list independently. Use the `loading-icon` prop to customize the icon.

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
  - TransferListItem[]
props:
  sourceLoading: true
  targetLoading: false
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

## Examples

### Control selected items

You can control the selected items by using the `default-value` prop or the `v-model` directive.

::component-example
---
name: 'transfer-list-model-value-example'
collapse: true
---
::

### With descriptions

Use the `description` property on items to display additional text below the label.

::component-example
---
name: 'transfer-list-description-example'
collapse: true
---
::

### With avatars

Use the `avatar` property on items to display an [Avatar](/docs/components/avatar) next to the label.

::component-example
---
name: 'transfer-list-avatar-example'
collapse: true
---
::

### With custom buttons

Use the `transfer` and `remove` props to customize the transfer buttons. These accept any [Button](/docs/components/button) props. Use `transfer-icon` and `remove-icon` to change the button icons.

::component-example
---
name: 'transfer-list-custom-buttons-example'
collapse: true
---
::

### With virtualization

Use the `virtualize` prop to enable virtualization for large lists as a boolean or an object with options like `{ estimateSize: 32, overscan: 12 }`.

::component-example
---
name: 'transfer-list-virtualize-example'
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
