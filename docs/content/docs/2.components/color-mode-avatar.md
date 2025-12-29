---
title: ColorModeAvatar
description: 'An Avatar with a different source for light and dark mode.'
category: color-mode
links:
  - label: Avatar
    to: /docs/components/avatar
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/color-mode/ColorModeAvatar.vue
---

## Usage

The ColorModeAvatar component extends the [Avatar](/docs/components/avatar) component, so you can pass any property such as `size`, `icon`, etc.

Use the `light` and `dark` props to define the source for light and dark mode.

::component-code{prefix="color-mode"}
---
props:
  light: 'https://github.com/vuejs.png'
  dark: 'https://github.com/nuxt.png'
---
::

::note
Switch between light and dark mode to see the different images: :u-color-mode-select{size="sm"}
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes" target="_blank"}
This component also supports all native `<img>` HTML attributes.
::

## Changelog

:component-changelog{prefix="color-mode"}
