---
title: VerticalNavigation
description: Display a list of vertical links.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/VerticalNavigation.vue
---

## Usage

Pass an array to the `links` prop of the VerticalNavigation component. Each link can have the following properties:

- `label` - The label of the link.
- `labelClass` - The class of the link label.
- `icon` - The icon of the link.
- `iconClass` - The class of the link icon.
- `avatar` - The avatar of the link. You can pass all the props of the [Avatar](/components/avatar) component.
- `badge` - A badge to display next to the label. You can pass all the props of the [Badge](/components/badge) component.
- `click` - The click handler of the link.

You can also pass any property from the [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `exact`, etc.

:component-example{component="vertical-navigation-example"}

## Sections

Group your navigation links into distinct sections, separated by a divider. You can do this by passing an array of arrays to the `links` prop of the VerticalNavigation component.

:component-example{component="vertical-navigation-example-sections"}

## Slots

You can use slots to customize links display.

### `default`

Use the `#default` slot to customize the link label. You will have access to the `link` and `isActive` properties in the slot scope.

:component-example{component="vertical-navigation-example-default-slot"}

### `avatar`

Use the `#avatar` slot to customize the link avatar. You will have access to the `link` and `isActive` properties in the slot scope.

:component-example{component="vertical-navigation-example-avatar-slot"}

### `icon`

Use the `#icon` slot to customize the link icon. You will have access to the `link` and `isActive` properties in the slot scope.

:component-example{component="vertical-navigation-example-icon-slot"}

### `badge`

Use the `#badge` slot to customize the link badge. You will have access to the `link` and `isActive` properties in the slot scope.

:component-example{component="vertical-navigation-example-badge-slot"}

## Props

:component-props

## Config

:component-preset

## Example

Here is an example illustrating how you can customize the appearance of the `VerticalNavigation` component by utilizing its `ui` prop.

:component-example{component="vertical-navigation-example-theme-tailwind"}
