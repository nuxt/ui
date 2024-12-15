---
description: A stacked set of collapsible panels.
links:
  - label: Accordion
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/accordion
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Accordion.vue
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
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
    - label: 'Components'
      icon: 'i-lucide-box'
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
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
    - label: 'Components'
      icon: 'i-lucide-box'
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
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
    - label: 'Components'
      icon: 'i-lucide-box'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Unmount

Use the `unmount-on-hide` prop to prevent the content from being unmounted when the accordion is collapsed. Defaults to `true`.

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
  unmountOnHide: false
  items:
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
    - label: 'Components'
      icon: 'i-lucide-box'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

::note
You can inspect the DOM to see each item's content being rendered.
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
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
      disabled: true
    - label: 'Components'
      icon: 'i-lucide-box'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
---
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon) of each item. Defaults to `i-lucide-chevron-down`.

::tip
You can also set an icon for a specific item by using the `trailingIcon` property in the item object.
::

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
  trailingIcon: 'i-lucide-arrow-down'
  items:
    - label: 'Icons'
      icon: 'i-lucide-smile'
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
      trailingIcon: 'i-lucide-plus'
    - label: 'Colors'
      icon: 'i-lucide-swatch-book'
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
    - label: 'Components'
      icon: 'i-lucide-box'
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
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

::caution
When `type="multiple"`, ensure to pass an array to the `default-value` prop or the `v-model` directive.
::

### With body slot

Use the `#body` slot to customize the body of each item.

::component-example
---
name: 'accordion-body-slot-example'
props:
  class: 'px-4'
---
::

::tip
The `#body` slot includes some pre-defined styles, use the [`#content` slot](#with-content-slot) if you want to start from scratch.
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

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-body`{lang="ts-type"}

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
