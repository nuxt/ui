---
description: A set of resizable panels separated by draggable handles.
category: layout
links:
  - label: Splitter
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/splitter
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Splitter.vue
navigation.badge: Soon
---

## Usage

Use the Splitter component to display a list of resizable panels separated by draggable handles.

::component-example
---
collapse: true
name: 'splitter-example'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `defaultSize?: number`{lang="ts-type"}
- `minSize?: number`{lang="ts-type"}
- `maxSize?: number`{lang="ts-type"}
- `collapsible?: boolean`{lang="ts-type"}
- `collapsedSize?: number`{lang="ts-type"}
- `sizeUnit?: '%' | 'px'`{lang="ts-type"}
- `order?: number`{lang="ts-type"}
- `id?: string`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { panel?: ClassNameValue }`{lang="ts-type"}

Use the `slot` key to fill the content of a panel and the `class` key to style it. Sizes are percentages by default, set `sizeUnit: 'px'` on an item for pixel values.

::caution
When rendering on the server, set the `id` prop and give every item a `defaultSize`. Ids are generated on the client otherwise and can differ from the server which breaks the layout on hydration, and panels without a `defaultSize` are laid out incorrectly until then.
::

::component-code
---
collapse: true
class: 'h-96'
prettier: true
ignore:
  - items
  - id
external:
  - items
externalTypes:
  - SplitterItem[]
props:
  id: 'splitter-items'
  items:
    - slot: 'sidebar'
      sizeUnit: 'px'
      minSize: 150
      maxSize: 400
      defaultSize: 250
      class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'
    - slot: 'main'
      sizeUnit: 'px'
      defaultSize: 750
      class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'
slots:
  sidebar: Sidebar
  main: Main
---

#sidebar
Sidebar

#main
Main
::

### Orientation

Use the `orientation` prop to change the direction of the splitter. Defaults to `horizontal`.

::component-code
---
collapse: true
class: 'h-96'
prettier: true
ignore:
  - items
  - id
external:
  - items
externalTypes:
  - SplitterItem[]
props:
  id: 'splitter-orientation'
  orientation: 'vertical'
  items:
    - slot: 'first'
      class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'
    - slot: 'second'
      class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'
slots:
  first: First
  second: Second
---

#first
First

#second
Second
::

## Examples

### With collapsible panel

Set `collapsible: true` on an item to let it collapse past its `minSize`, and use `collapsedSize` to keep part of the panel visible when collapsed. The panel slot exposes `collapsed`, `collapse` and `expand` so you can control it programmatically, and the `collapse`, `expand` and `resize` events fire with the panel index.

::component-example
---
collapse: true
name: 'splitter-collapsible-example'
---
::

### With nested splitters

Nest a `Splitter` inside a panel to build two-dimensional, IDE-style layouts.

::component-example
---
collapse: true
name: 'splitter-nested-example'
---
::

### With custom handle

The handle is invisible by default. Use the `ui` prop to restyle it, for example as a visible divider for flush layouts.

::component-example
---
collapse: true
name: 'splitter-custom-handle-example'
---
::

### With persistence

Provide an `auto-save-id` to persist the layout to `localStorage` and restore it on reload.

```vue
<template>
  <USplitter auto-save-id="my-layout" :items="items">
    <!-- ... -->
  </USplitter>
</template>
```

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
