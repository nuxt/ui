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

The Splitter component renders a resizable panel for each entry in the `items` prop, inserting a draggable handle between them. Use the `slot` key of each item to fill its content.

The Splitter fills its container, so make sure a parent element defines a height.

::component-code
---
class: 'h-96'
prettier: true
ignore:
  - items
external:
  - items
externalTypes:
  - SplitterItem[]
props:
  items:
    - slot: 'first'
      min: 20
      default: 30
    - slot: 'second'
slots:
  first: |

    <Placeholder class="size-full" />

  second: |

    <Placeholder class="size-full" />
---

#first
:placeholder{class="size-full"}

#second
:placeholder{class="size-full"}
::

### Orientation

Use the `orientation` prop to change the direction of the splitter. Defaults to `horizontal`.

::component-code
---
class: 'h-96'
prettier: true
ignore:
  - items
external:
  - items
externalTypes:
  - SplitterItem[]
props:
  orientation: 'vertical'
  items:
    - slot: 'first'
    - slot: 'second'
slots:
  first: |

    <Placeholder class="size-full" />

  second: |

    <Placeholder class="size-full" />
---

#first
:placeholder{class="size-full"}

#second
:placeholder{class="size-full"}
::

### Sizes

Use the `default`, `min` and `max` keys on an item to control its size. Values are percentages by default, set `unit: 'px'` on an item for fixed pixel sizing.

## Examples

### With collapsible panel

Set `collapsible: true` on an item to let it collapse past its `min` size. The panel slot exposes `collapsed`, `collapse` and `expand` so you can control it programmatically.

::component-example
---
name: 'splitter-collapsible-example'
---
::

### With nested splitters

Nest a `Splitter` inside a panel to build two-dimensional, IDE-style layouts.

::component-example
---
name: 'splitter-nested-example'
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
