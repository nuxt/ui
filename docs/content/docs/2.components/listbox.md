---
description: A selectable list of items with search, virtualization and rich item rendering.
category: form
links:
  - label: Listbox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/listbox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Listbox.vue
navigation.badge: New
---

## Usage

Use the `v-model` directive to control the value of the Listbox or the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - modelValue.label
  - modelValue.icon
  - modelValue.value
  - items
external:
  - items
  - modelValue
externalTypes:
  - ListboxItem[]
props:
  modelValue:
    label: 'France'
    icon: 'i-lucide-map-pin'
    value: 'FR'
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
    - label: 'Belgium'
      icon: 'i-lucide-map-pin'
      value: 'BE'
    - label: 'Portugal'
      icon: 'i-lucide-map-pin'
      value: 'PT'
    - label: 'Austria'
      icon: 'i-lucide-map-pin'
      value: 'AT'
    - label: 'Sweden'
      icon: 'i-lucide-map-pin'
      value: 'SE'
  class: 'w-full'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- [`description?: string`{lang="ts-type"}](#with-description-in-items)
- [`type?: "label" | "separator" | "item"`{lang="ts-type"}](#with-items-type)
- [`icon?: string`{lang="ts-type"}](#with-icon-in-items)
- [`avatar?: AvatarProps`{lang="ts-type"}](#with-avatar-in-items)
- [`chip?: ChipProps`{lang="ts-type"}](#with-chip-in-items)
- `disabled?: boolean`{lang="ts-type"}
- `onSelect?: (e: Event) => void`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { label?: ClassNameValue, separator?: ClassNameValue, item?: ClassNameValue, itemLeadingIcon?: ClassNameValue, ... }`{lang="ts-type"}

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

You can also pass an array of arrays to the `items` prop to display separated groups of items.

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
  - ListboxItem[][]
props:
  items:
    - - label: 'France'
        icon: 'i-lucide-map-pin'
        value: 'FR'
      - label: 'Germany'
        icon: 'i-lucide-map-pin'
        value: 'DE'
      - label: 'Italy'
        icon: 'i-lucide-map-pin'
        value: 'IT'
    - - label: 'Brazil'
        icon: 'i-lucide-map-pin'
        value: 'BR'
      - label: 'Argentina'
        icon: 'i-lucide-map-pin'
        value: 'AR'
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
  - multiple
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

### Value Key

You can choose to bind a single property of the object rather than the whole object by using the `value-key` prop. Defaults to `undefined`.

::component-code
---
collapse: true
ignore:
  - modelValue
  - valueKey
  - items
  - class
external:
  - items
  - modelValue
externalTypes:
  - ListboxItem[]
props:
  modelValue: 'FR'
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
  class: 'w-full'
---
::

### Filter

Use the `filter` prop to display a filter input or pass an object to customize the [Input](/docs/components/input) component. Defaults to `false`.

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
  filter:
    placeholder: 'Filter...'
    icon: 'i-lucide-search'
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

### Selected Icon

Use the `selected-icon` prop to customize the icon when an item is selected. Defaults to `i-lucide-check`.

::component-code
---
collapse: true
ignore:
  - items
  - modelValue
  - valueKey
  - class
external:
  - items
  - modelValue
externalTypes:
  - ListboxItem[]
props:
  modelValue: 'FR'
  selectedIcon: 'i-lucide-flame'
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

## Examples

### With items type

You can use the `type` property with `separator` to display a separator between items or `label` to display a label.

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
  - ListboxItem[][]
props:
  items:
    - - type: 'label'
        label: 'Fruits'
      - label: 'Apple'
      - label: 'Banana'
      - label: 'Blueberry'
      - label: 'Grapes'
      - label: 'Pineapple'
    - - type: 'label'
        label: 'Vegetables'
      - label: 'Aubergine'
      - label: 'Broccoli'
      - label: 'Carrot'
      - label: 'Courgette'
      - label: 'Leek'
  class: 'w-full'
---
::

### With icon in items

You can use the `icon` property to display an [Icon](/docs/components/icon) inside the items.

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
    - label: 'Backlog'
      icon: 'i-lucide-circle-help'
      value: 'backlog'
    - label: 'Todo'
      icon: 'i-lucide-circle-plus'
      value: 'todo'
    - label: 'In Progress'
      icon: 'i-lucide-circle-arrow-up'
      value: 'in_progress'
    - label: 'Done'
      icon: 'i-lucide-circle-check'
      value: 'done'
  class: 'w-full'
---
::

### With avatar in items

You can use the `avatar` property to display an [Avatar](/docs/components/avatar) inside the items.

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
    - label: 'benjamincanac'
      avatar:
        src: 'https://github.com/benjamincanac.png'
    - label: 'romhml'
      avatar:
        src: 'https://github.com/romhml.png'
    - label: 'atinux'
      avatar:
        src: 'https://github.com/atinux.png'
    - label: 'HugoRCD'
      avatar:
        src: 'https://github.com/HugoRCD.png'
  class: 'w-full'
---
::

### With chip in items

You can use the `chip` property to display a [Chip](/docs/components/chip) inside the items.

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
    - label: 'bug'
      chip:
        color: 'error'
    - label: 'feature'
      chip:
        color: 'success'
    - label: 'enhancement'
      chip:
        color: 'info'
  class: 'w-full'
---
::

### With description in items

You can use the `description` property to display additional text below the label.

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

### Control selected items

You can control the selected item by using the `default-value` prop or the `v-model` directive.

::component-example
---
name: 'listbox-model-value-example'
collapse: true
---
::

### Control search term

Use the `v-model:search-term` directive to control the search term.

::component-example
---
name: 'listbox-search-term-example'
---
::

### With ignore filter

Set the `ignore-filter` prop to `true` to disable the internal search and use your own search logic.

::component-example
---
collapse: true
name: 'listbox-ignore-filter-example'
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
name: 'listbox-filter-fields-example'
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
