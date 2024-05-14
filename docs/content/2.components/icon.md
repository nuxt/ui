---
description: Display any icon (100,000+) from Iconify.
links:
  - label: Nuxt Icon
    icon: i-simple-icons-github
    to: https://github.com/nuxt-modules/icon
---

## Usage

Use the `name` prop by following this pattern: `i-{collection_name}-{icon_name}`. You can search any icon from [Iconify](https://iconify.design/) using https://icones.js.org.

::component-card
---
props:
  name: 'i-heroicons-light-bulb'
---
::

::callout{icon="i-heroicons-exclamation-triangle"}
You won't be able to use all icons in the `name` prop here as icons are bundled using [egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons).
::

::callout{icon="i-heroicons-light-bulb"}
Don't forget to install and specify the icon collections you need in your `nuxt.config.ts`, read more about this in [Theming](/getting-started/theming#icons).
::

## Props

:component-props
