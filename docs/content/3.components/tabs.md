---
description: A set of tab panels that are displayed one at a time.
links:
  - label: Tabs
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/tabs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Tabs.vue
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `value?: string | number`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)

::component-code
---
ignore:
  - items
  - class
external:
  - items
props:
  items:
    - label: Account
      icon: 'i-lucide-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-lucide-lock'
      content: 'This is the password content.'
  class: 'w-full'
---
::

### Content

Use the `content` prop to control how the Tabs are rendered.

You can set it to `false` to prevent the Tabs from rendering any content and act as a toggle.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  content: false
  items:
    - label: Account
      icon: 'i-lucide-user'
      content: 'This is the account content.'
    - label: Password
      icon: 'i-lucide-lock'
      content: 'This is the password content.'
  class: 'w-full'
---
::

### Color

Use the `color` prop to change the color of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  color: neutral
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Variant

Use the `variant` prop to change the variant of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  color: neutral
  variant: link
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the Tabs.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  size: md
  variant: pill
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Tabs. Defaults to `horizontal`.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  orientation: vertical
  variant: pill
  content: false
  items:
    - label: Account
    - label: Password
  class: 'w-full'
---
::

## Examples

### Control active item

You can control the active item by using the `default-value` prop or the `v-model` directive with the index of the item.

:component-example{name="tabs-model-value-example"}

::tip
You can also pass the `value` of one of the items if provided.
::

### With content slot

Use the `#content` slot to customize the content of each item.

:component-example{name="tabs-content-slot-example"}

### With custom slot

Use the `slot` property to customize a specific item.

:component-example{name="tabs-custom-slot-example"}

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
