---
title: DashboardSearchButton
description: 'A pre-styled Button to open the DashboardSearch modal.'
category: dashboard
links:
  - label: Button
    to: /docs/components/button
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardSearchButton.vue
---

## Usage

The DashboardSearchButton component is used to open the [DashboardSearch](/docs/components/dashboard-search) modal.

:component-code

It extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

::component-code
---
ignore:
  - variant
props:
  variant: 'subtle'
---
::

::note{to="#collapsed"}
The button defaults to `color="neutral"` and `variant="outline"` when not collapsed, `variant="ghost"` when collapsed.
::

### Collapsed

Use the `collapsed` prop to hide the button's label and [kbds](#kbds). Defaults to `false`.

::component-code
---
prettier: true
props:
  collapsed: true
---
::

::tip{to="/docs/components/dashboard-sidebar#slots"}
When using the button in the **DashboardSidebar** component, use the `collapsed` slot prop directly.
::

### Kbds

Use the `kbds` prop to display keyboard keys in the button. Defaults to `['meta', 'K']`{lang="ts-type"} to match the default shortcut of the [DashboardSearch](/docs/components/dashboard-search#shortcut) component.

::component-code
---
prettier: true
ignore:
  - kbds
props:
  collapsed: false
  kbds:
    - 'alt'
    - 'O'
---
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes" target="_blank"}
This component also supports all native `<button>` HTML attributes.
::

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
