---
title: HorizontalNavigation
description: Display a list of horizontal links.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/HorizontalNavigation.vue
---

## Usage

Pass an array to the `links` prop of the HorizontalNavigation component. Each link can have the following properties:

- `label` - The label of the link.
- `labelClass` - The class of the link label.
- `icon` - The icon of the link.
- `iconClass` - The class of the link icon.
- `avatar` - The avatar of the link. You can pass all the props of the [Avatar](/components/avatar) component.
- `badge` - A badge to display next to the label. You can pass all the props of the [Badge](/components/badge) component.
- `click` - The click handler of the link.

You can also pass any property from the [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `exact`, etc.

:component-example{component="horizontal-navigation-example"}

## Sections

Group your navigation links into distinct sections, they will be displayed apart thanks to a `justify-between` flexbox layout.

You can do this by passing an array of arrays to the `links` prop of the HorizontalNavigation component.

:component-example{component="horizontal-navigation-example-sections"}

## Slots

You can use slots to customize links display.

### `default`

Use the `#default` slot to customize the link label. You will have access to the `link` and `isActive` properties in the slot scope.

:component-example{component="horizontal-navigation-example-default-slot"}

### `avatar`

Use the `#avatar` slot to customize the link avatar. You will have access to the `link` and `isActive` properties in the slot scope.

### `icon`

Use the `#icon` slot to customize the link icon. You will have access to the `link` and `isActive` properties in the slot scope.

### `badge`

Use the `#badge` slot to customize the link badge. You will have access to the `link` and `isActive` properties in the slot scope.

## Props

:component-props

## Config

:component-preset
