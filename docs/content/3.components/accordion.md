---
description: A stacked set of collapsible panels.
links:
  - label: Accordion
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/accordion.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Accordion.vue
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `trailingIcon?: string`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `value?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)

::component-code
---
ignore:
  - items
external:
  - items
hide:
  - class
props:
  class: 'px-4'
  items:
    - label: 'Colors'
      icon: 'i-heroicons-swatch'
      content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
    - label: 'Icons'
      icon: 'i-heroicons-face-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Multiple

Set the `type` prop to `multiple` to allow multiple items to be active at the same time. Defaults to `single`.

::component-code
---
ignore:
  - type
  - items
external:
  - items
hide:
  - class
props:
  class: 'px-4'
  type: 'multiple'
  items:
    - label: 'Colors'
      icon: 'i-heroicons-swatch'
      content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
    - label: 'Icons'
      icon: 'i-heroicons-face-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Collapsible

When `type` is `single`, you can set the `collapsible` prop to `false` to prevent the active item from collapsing.

::component-code
---
ignore:
  - collapsible
  - items
external:
  - items
hide:
  - class
props:
  class: 'px-4'
  collapsible: false
  items:
    - label: 'Colors'
      icon: 'i-heroicons-swatch'
      content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
    - label: 'Icons'
      icon: 'i-heroicons-face-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Disabled

Use the `disabled` property to disable the Accordion.

You can also disable a specific item by using the `disabled` property in the item object.

::component-code
---
ignore:
  - items
external:
  - items
hide:
  - class
props:
  class: 'px-4'
  disabled: true
  items:
    - label: 'Colors'
      icon: 'i-heroicons-swatch'
      content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
    - label: 'Icons'
      icon: 'i-heroicons-face-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
      disabled: true
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon) of each item. Defaults to `i-heroicons-chevron-down-20-solid`.

You can also set an icon for a specific item by using the `trailingIcon` property in the item object.

::component-code
---
ignore:
  - items
external:
  - items
hide:
  - class
props:
  class: 'px-4'
  trailingIcon: 'i-heroicons-plus'
  items:
    - label: 'Colors'
      icon: 'i-heroicons-swatch'
      content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
    - label: 'Icons'
      icon: 'i-heroicons-face-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
      trailingIcon: 'i-heroicons-arrow-down'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
::

## Examples

### Control active item(s)

You can control the active item(s) by using the `default-value` prop or the `v-model` directive with the index of the item.

::component-example
---
name: 'accordion-model-value-example'
props:
  class: 'px-4'
---
::

::tip
You can also pass the `value` of one of the items if provided.
::

### With content slot

Use the `#content` slot to customize the content of each item.

::component-example
---
name: 'accordion-content-slot-example'
props:
  class: 'px-4'
---
::

### With custom slot

Use the `slot` property instead of the `#content` slot to customize a specific item.

::component-example
---
name: 'accordion-custom-slot-example'
props:
  class: 'px-4'
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
