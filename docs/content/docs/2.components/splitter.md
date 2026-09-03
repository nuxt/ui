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
navigation.badge: New
---

## Usage

Use the Splitter component to display a list of resizable panels separated by draggable handles.

::component-example
---
collapse: true
name: 'splitter-example'
---
::

::note
The Splitter fills the height of its container, so make sure a parent element defines one.
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

Use the `slot` key to fill the content of a panel and the `class` key to style it. Items without a `slot` key fall back to a `panel-{index}` slot. Sizes are percentages by default, set `sizeUnit: 'px'` on an item for pixel values.

::caution
When rendering on the server, set the `id` prop and give `defaultSize` to all items or to none. Ids are generated automatically otherwise and the server and the client can disagree, which breaks the layout on hydration. An item without a `defaultSize` falls back to an equal share on the server, so mixing the two makes panels jump once hydrated. Pixel sizes are measured on the client and always shift a little.
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
      minSize: 15
      maxSize: 40
      defaultSize: 25
      class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'
    - slot: 'main'
      defaultSize: 75
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

The handle is invisible by default. Use the `ui` prop to restyle it, for example as a visible divider for flush layouts, and the `resize-handle` slot to render content inside it like a grip.

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
  <USplitter id="my-layout" auto-save-id="my-layout" :items="items">
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
