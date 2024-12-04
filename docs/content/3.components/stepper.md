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

Use the `v-model` directive to control the value of the Stepper or the `default-value` prop to set the initial value when you do not need to control its state.

::tip{to="#control-active-item"}
You can also use the `@update:model-value` event to listen to the active item.
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `title?: string`{lang="ts-type"}
- `description?: AvatarProps`{lang="ts-type"}
- `content?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `value?: string | number`{lang="ts-type"}
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

## Examples

### With controls

You can add additional controls for the stepper using buttons

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

## Theme

:component-theme
