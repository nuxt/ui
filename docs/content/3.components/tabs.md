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
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `content?: string`{lang="ts-type"}
- `value?: string | number`{lang="ts-type"}
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

### Content

Use the `content` prop to control how the Tabs are rendered.

You can set it to `false` to prevent the Tabs from rendering any content and act as a toggle.

::component-code
---
ignore:
  - content
external:
  - items
hide:
  - class
props:
  class: 'w-full'
  content: false
  items:
    - label: Account
      icon: 'i-heroicons-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-heroicons-lock-closed'
      content: 'This is the password content.'
---
::

You can also choose to only render the content of the active tab by setting `content.forceMount` to `false`.

::component-code
---
ignore:
  - content.forceMount
external:
  - items
hide:
  - class
props:
  class: 'w-full'
  content:
    forceMount: false
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
You can inspect the DOM to see that the content of the inactive tab is not rendered.
::

### Style

Use the `color` and `variant` props to change the style of the Tabs.

::component-code
---
ignore:
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

## Examples

### Control active tab

You can control the active tab by using the `default-value` prop or the `v-model` directive with the index of the item.

::component-example
---
name: 'tabs-model-value-example'
props:
  class: 'w-full'
---
::

::tip
You can also pass the `value` of one of the items if provided.
::

### With content slot

Use the `#content` slot to customize the content of each item.

::component-example
---
name: 'tabs-content-slot-example'
props:
  class: 'w-full'
---
::

### With custom slot

Use the `slot` property to customize a specific item.

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
