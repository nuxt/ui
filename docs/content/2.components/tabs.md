---
description: A set of tab panels that are displayed one at a time.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/Tabs.vue
---

## Usage

Pass an array to the `items` prop of the Tabs component. Each item can have the following properties:

- `label` - The label of the item.
- `icon` - The icon of the item.
- `slot` - A key to customize the item with a slot.
- `content` - The content to display in the panel by default.
- `disabled` - Determines whether the item is disabled or not.

::component-example
---
component: 'tabs-example-basic'
componentProps:
  class: 'w-full'
---
::

### Vertical

You can change the orientation of the tabs by setting the `orientation` prop to `vertical`.

::component-example
---
component: 'tabs-example-vertical'
componentProps:
  class: 'w-full'
---
::

### Default index

You can set the default index of the tabs by setting the `default-index` prop.

::component-example
---
component: 'tabs-example-index'
componentProps:
  class: 'w-full'
---
::

::callout{icon="i-heroicons-exclamation-triangle"}
  This will have no effect if you are using a `v-model` to control the selected index.
::

### Listen to changes

You can listen to changes by using the `@change` event. The event will emit the index of the selected item.

::component-example
---
component: 'tabs-example-change'
componentProps:
  class: 'w-full'
---
::

You can use the `content` prop and set it to `false` to avoid the rendering of the HTML content if you don't need it.

### Control the selected index

Use a `v-model` to control the selected index.

::component-example
---
component: 'tabs-example-v-model'
componentProps:
  class: 'w-full'
---
::

::callout{icon="i-heroicons-information-circle"}
In this example, we are binding tabs to the route query. Refresh the page to see the selected tab change.
::

## Slots

You can use slots to customize the buttons and items content of the Accordion.

### `default`

Use the `#default` slot to customize the content of the trigger buttons. You will have access to the `item`, `index`, `selected` and `disabled` in the slot scope.

:component-example{component="tabs-example-default-slot"}

### `icon`

Use the `#icon` slot to customize the icon of the trigger buttons. You will have access to the `item`, `index`, `selected` and `disabled` in the slot scope.

:component-example{component="tabs-example-icon-slot"}

### `item`

Use the `#item` slot to customize the items content. You will have access to the `item`, `index` and `selected` properties in the slot scope.

:component-example{component="tabs-example-item-slot"}

You can also pass a `slot` property to customize a specific item.

:component-example{component="tabs-example-item-custom-slot"}

## Props

:component-props

## Config

:component-preset
