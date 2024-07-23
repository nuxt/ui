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

### Items

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
    - label: Account
      icon: 'i-heroicons-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-heroicons-lock-closed'
      content: 'This is the password content.'
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
    - label: Account
    - label: Password
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
  variant: pill
  class: 'w-full'
  content: false
  items:
    - label: Account
    - label: Password
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
    - label: Account
    - label: Password
---
::

### Default value

Use the `default-value` prop to set the default value of the Tabs with the index of the item. You can also pass the value of one of the items if provided.

::component-code
---
ignore:
  - items
  - content
  - defaultValue
external:
  - items
hide:
  - class
props:
  defaultValue: '1'
  class: 'w-full'
  content: false
  items:
    - label: Account
    - label: Password
---
::

### Model value

You can control the selected tab by using the `v-model` directive.

::component-example
---
name: 'tabs-model-value-example'
props:
  class: 'w-full'
---
::

## Examples

### With content slot

Use the `#content` slot to customize each item.

::component-example
---
name: 'tabs-content-slot-example'
props:
  class: 'w-full'
---
::

### With custom slot

Use the `slot` property to customize a specific item with a form for example.

::component-example
---
name: 'tabs-custom-slot-example'
props:
  class: 'w-full'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
