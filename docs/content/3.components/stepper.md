---
description: A set of steps that are used to indicate progress through a multi-step process.
links:
  - label: Stepper
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/stepper
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Stepper.vue
navigation.badge: New
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `title?: string`{lang="ts-type"}
- `description?: AvatarProps`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
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
    - title: 'Address'
      description: 'Add your address here'
      icon: 'i-lucide-house'
    - title: 'Shipping'
      description: 'Set your preferred shipping method'
      icon: 'i-lucide-truck'
    - title: 'Checkout'
      description: 'Confirm your order'
  class: 'w-full'
---
::

::note
Click on the items to navigate through the steps.
::

### Color

Use the `color` prop to change the color of the Stepper.

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
  items:
    - title: 'Address'
      description: 'Add your address here'
      icon: 'i-lucide-house'
    - title: 'Shipping'
      description: 'Set your preferred shipping method'
      icon: 'i-lucide-truck'
    - title: 'Checkout'
      description: 'Confirm your order'
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the Stepper.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  size: xl
  items:
  - title: 'Address'
    description: 'Add your address here'
    icon: 'i-lucide-house'
  - title: 'Shipping'
    description: 'Set your preferred shipping method'
    icon: 'i-lucide-truck'
  - title: 'Checkout'
    description: 'Confirm your order'
  class: 'w-full'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Stepper. Defaults to `horizontal`.

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
  items:
  - title: 'Address'
    description: 'Add your address here'
    icon: 'i-lucide-house'
  - title: 'Shipping'
    description: 'Set your preferred shipping method'
    icon: 'i-lucide-truck'
  - title: 'Checkout'
    description: 'Confirm your order'
  class: 'w-full'
---
::

### Disabled

Use the `disabled` prop to disable navigation through the steps.

::component-code
---
ignore:
  - content
  - items
  - class
external:
  - items
props:
  disabled: true
  items:
  - title: 'Address'
    description: 'Add your address here'
    icon: 'i-lucide-house'
  - title: 'Shipping'
    description: 'Set your preferred shipping method'
    icon: 'i-lucide-truck'
  - title: 'Checkout'
    description: 'Confirm your order'
---
::

::note{to="#with-controls"}
This can be useful when you want to force navigation with controls.
::

## Examples

### With controls

You can add additional controls for the stepper using buttons.

:component-example{name="stepper-with-controls-example"}

### Control active item

You can control the active item by using the `default-value` prop or the `v-model` directive with the index of the item.

:component-example{name="stepper-model-value-example"}

::tip
You can also pass the `value` of one of the items if provided.
::

### With content slot

Use the `#content` slot to customize the content of each item.

:component-example{name="stepper-content-slot-example"}

### With custom slot

Use the `slot` property to customize a specific item.

:component-example{name="stepper-custom-slot-example"}

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

You can access the typed component instance using [`useTemplateRef`](https://vuejs.org/api/composition-api-helpers.html#usetemplateref).

```vue
<script setup lang="ts">
const stepper = useTemplateRef('stepper')
</script>

<template>
  <UStepper ref="stepper" />
</template>
```

This will give you access to the following:

| Name | Type |
| ---- | ---- |
| `next`{lang="ts-type"} | `() => void`{lang="ts-type"} |
| `prev`{lang="ts-type"} | `() => void`{lang="ts-type"} |
| `hasNext`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} |
| `hasPrev`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} |

## Theme

:component-theme
