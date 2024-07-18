---
description: A set of tab panels that are displayed one at a time.
links:
  - label: Tabs
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/tabs.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Tabs.vue
---

## Usage

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `value?: StringOrNumber`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}

::component-code
---
external:
  - items
hide:
  - class
props:
  class: 'w-full'
  items:
    - label: Tab 1
      icon: 'i-heroicons-academic-cap'
      content: 'Content 1'
    - label: Tab 2
      icon: 'i-heroicons-user'
      content: 'Content 2'
    - label: Tab 3
      icon: 'i-heroicons-bell'
      content: 'Content 3'
---
::

::tip
You can use Tabs without content by setting the `content` prop to `false`.
::

### Style

Use the `color` and `variant` props to change the style of the Tabs.

::component-code
---
ignore:
  - items
  - content
external:
  - items
hide:
  - class
props:
  color: gray
  variant: link
  class: 'w-full'
  content: false
  items:
    - label: Tab 1
    - label: Tab 2
    - label: Tab 3
---
::

### Size

Use the `size` prop to change the size of the Tabs.

::component-code
---
ignore:
  - items
  - content
external:
  - items
hide:
  - class
props:
  size: md
  class: 'w-full'
  content: false
  items:
    - label: Tab 1
    - label: Tab 2
    - label: Tab 3
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Tabs.

::component-code
---
ignore:
  - items
  - content
external:
  - items
hide:
  - class
props:
  orientation: vertical
  variant: pill
  class: 'w-full'
  content: false
  items:
    - label: Tab 1
    - label: Tab 2
    - label: Tab 3
---
::

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
