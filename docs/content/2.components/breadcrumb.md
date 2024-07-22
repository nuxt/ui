---
title: Breadcrumb
description: A list of links that indicate the current page's location within a navigational hierarchy.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/Breadcrumb.vue
---

## Usage

Pass an array to the `links` prop of the Breadcrumb component. Each link can have the following properties:

- `label` - The label of the link.
- `labelClass` - The class of the link label.
- `icon` - The icon of the link.
- `iconClass` - The class of the link icon.

You can also pass any property from the [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `exact`, etc.

:component-example{component="breadcrumb-example-basic"}

::callout{icon="i-heroicons-light-bulb"}
A `span` will be rendered instead of a link when the `to` property is not defined.
::

## Divider

Use the `divider` prop to customize the divider between each link, it can be **an icon or a string**. You can change it globally in `ui.breadcrumb.default.divider`. Defaults to `i-heroicons-chevron-right-20-solid`.

You can set the prop to `null` to hide the divider. Additionally, you can customize it using the [`divider`](#divider-1) slot.

::component-card
---
baseProps:
  links:
    - label: Home
      to: /
    - label: Navigation
    - label: Breadcrumb
props:
  divider: '/'
---
::

## Slots

### `default`

Use the `#default` slot to customize the link label. You will have access to the `link`, `index` and `isActive` properties in the slot scope.

:component-example{component="breadcrumb-example-default-slot"}

### `icon`

Use the `#icon` slot to customize the link icon. You will have access to the `link`, `index` and `isActive` properties in the slot scope.

:component-example{component="breadcrumb-example-icon-slot"}

### `divider`

Use the `divider` slot to customize the divider of the Breadcrumb.

:component-example{component="breadcrumb-example-divider-slot"}

## Props

:component-props

## Config

:component-preset
